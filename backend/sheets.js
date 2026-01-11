import { google } from 'googleapis'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

let sheetsClient = null

export async function getSheetsClient() {
  if (sheetsClient) return sheetsClient

  try {
    // Try to use service account credentials
    const credPath = path.join(__dirname, 'credentials.json')

    if (fs.existsSync(credPath)) {
      const auth = new google.auth.GoogleAuth({
        keyFile: credPath,
        scopes: ['https://www.googleapis.com/auth/spreadsheets'], // Full access for read+write
      })

      sheetsClient = google.sheets({ version: 'v4', auth })
      return sheetsClient
    } else {
      console.warn('No credentials.json found. Using sample data.')
      return null
    }
  } catch (error) {
    console.error('Error initializing Google Sheets:', error)
    return null
  }
}

export async function fetchPuzzles(sheetName = 'Puzzles') {
  const client = await getSheetsClient()

  // If no Google Sheets connection, return sample data
  if (!client) {
    return getSamplePuzzles()
  }

  try {
    const spreadsheetId = process.env.GOOGLE_SHEET_ID
    if (!spreadsheetId) {
      console.warn('GOOGLE_SHEET_ID not set. Using sample data.')
      return getSamplePuzzles()
    }

    const response = await client.spreadsheets.values.get({
      spreadsheetId,
      range: `${sheetName}!A2:M`, // Include Status column (M)
    })

    const rows = response.data.values
    if (!rows || rows.length === 0) {
      return getSamplePuzzles()
    }

    return rows
      .filter(row => {
        // Filter out hidden puzzles - column M (index 12) is status
        const status = (row[12] || 'published').toLowerCase().trim()
        return status === 'published'
      })
      .map((row, index) => {
        const categories = [
          {
            difficulty: 0,
            name: row[4] || 'Yellow Category',
            words: (row[5] || '').split(',').map(w => w.trim()).filter(Boolean),
          },
          {
            difficulty: 1,
            name: row[6] || 'Green Category',
            words: (row[7] || '').split(',').map(w => w.trim()).filter(Boolean),
          },
          {
            difficulty: 2,
            name: row[8] || 'Blue Category',
            words: (row[9] || '').split(',').map(w => w.trim()).filter(Boolean),
          },
          {
            difficulty: 3,
            name: row[10] || 'Purple Category',
            words: (row[11] || '').split(',').map(w => w.trim()).filter(Boolean),
          },
        ]

        // Validate that each category has exactly 4 words
        categories.forEach((category, idx) => {
          if (category.words.length !== 4) {
            console.warn(
              `Puzzle "${row[1]}" (ID: ${row[0]}) has invalid ${['yellow', 'green', 'blue', 'purple'][idx]} category: ` +
              `expected 4 words but got ${category.words.length}. Words: ${category.words.join(', ')}`
            )
          }
        })

        return {
          id: parseInt(row[0]) || index + 1,
          title: row[1] || `Puzzle ${index + 1}`,
          author: row[2] || '',
          dateCreated: row[3] || '',
          categories,
        }
      })
      .filter(puzzle => {
        // Filter out puzzles with invalid categories (not exactly 4 words per category)
        const allValid = puzzle.categories.every(cat => cat.words.length === 4)
        if (!allValid) {
          console.warn(`Skipping puzzle "${puzzle.title}" (ID: ${puzzle.id}) due to invalid category word counts`)
        }
        return allValid
      })
  } catch (error) {
    console.error('Error fetching from Google Sheets:', error)
    return getSamplePuzzles()
  }
}

export async function submitPuzzle(puzzleData, sheetName = 'Puzzles') {
  const client = await getSheetsClient()

  if (!client) {
    throw new Error('Google Sheets not configured')
  }

  const spreadsheetId = process.env.GOOGLE_SHEET_ID
  if (!spreadsheetId) {
    throw new Error('GOOGLE_SHEET_ID not set')
  }

  try {
    // Get existing puzzles to determine next ID
    const existingPuzzles = await fetchPuzzles(sheetName)
    const maxId = existingPuzzles.reduce((max, p) => Math.max(max, p.id), 0)
    const nextId = maxId + 1

    // Format data as row for Google Sheets
    const row = [
      nextId, // puzzle_id
      puzzleData.title,
      puzzleData.author,
      new Date().toISOString().split('T')[0], // date_created
      puzzleData.yellowCategory,
      puzzleData.yellowWords.join(','),
      puzzleData.greenCategory,
      puzzleData.greenWords.join(','),
      puzzleData.blueCategory,
      puzzleData.blueWords.join(','),
      puzzleData.purpleCategory,
      puzzleData.purpleWords.join(','),
      'published', // status - default to published
    ]

    // Append to sheet
    await client.spreadsheets.values.append({
      spreadsheetId,
      range: `${sheetName}!A:M`,
      valueInputOption: 'RAW',
      requestBody: {
        values: [row],
      },
    })

    return { id: nextId, success: true }
  } catch (error) {
    console.error('Error submitting puzzle:', error)
    throw error
  }
}

export async function logGamePlay(playData) {
  const client = await getSheetsClient()

  if (!client) {
    console.warn('Google Sheets not configured. Play stat not logged.')
    return { success: false, message: 'Sheets not configured' }
  }

  const spreadsheetId = process.env.GOOGLE_SHEET_ID
  if (!spreadsheetId) {
    console.warn('GOOGLE_SHEET_ID not set. Play stat not logged.')
    return { success: false, message: 'Sheet ID not set' }
  }

  try {
    // Format: timestamp, puzzle_id, puzzle_title, won, mistakes, achievement, failed_categories
    const failedCategories = playData.failedCategories ? playData.failedCategories.join('; ') : ''

    const row = [
      new Date().toISOString(),
      playData.puzzleId,
      playData.puzzleTitle,
      playData.won ? 'Won' : 'Lost',
      playData.mistakes,
      playData.achievement || '',
      failedCategories,
    ]

    // Append to PlayStats sheet
    await client.spreadsheets.values.append({
      spreadsheetId,
      range: 'PlayStats!A:G',
      valueInputOption: 'RAW',
      requestBody: {
        values: [row],
      },
    })

    return { success: true }
  } catch (error) {
    console.error('Error logging play stat:', error)
    return { success: false, message: error.message }
  }
}

export async function fetchPlayStats() {
  const client = await getSheetsClient()

  if (!client) {
    console.warn('Google Sheets not configured. Returning empty stats.')
    return []
  }

  const spreadsheetId = process.env.GOOGLE_SHEET_ID
  if (!spreadsheetId) {
    console.warn('GOOGLE_SHEET_ID not set. Returning empty stats.')
    return []
  }

  try {
    const response = await client.spreadsheets.values.get({
      spreadsheetId,
      range: 'PlayStats!A2:G', // Skip header row
    })

    const rows = response.data.values
    if (!rows || rows.length === 0) {
      return []
    }

    return rows.map(row => ({
      timestamp: row[0] || '',
      puzzleId: parseInt(row[1]) || 0,
      puzzleTitle: row[2] || '',
      won: row[3] === 'Won',
      mistakes: parseInt(row[4]) || 0,
      achievement: row[5] || '',
      failedCategories: row[6] ? row[6].split('; ').filter(Boolean) : [],
    }))
  } catch (error) {
    // If PlayStats sheet doesn't exist yet, return empty array
    if (error.message.includes('Unable to parse range')) {
      console.warn('PlayStats sheet does not exist yet. Returning empty stats.')
      return []
    }
    console.error('Error fetching play stats:', error)
    return []
  }
}

function getSamplePuzzles() {
  return [
    {
      id: 1,
      title: 'Sample Puzzle 1 (Easy Test)',
      author: 'System',
      dateCreated: new Date().toISOString().split('T')[0],
      categories: [
        {
          difficulty: 0,
          name: 'STARTS WITH A',
          words: ['APPLE', 'ARROW', 'ANKLE', 'ALARM'],
        },
        {
          difficulty: 1,
          name: 'STARTS WITH B',
          words: ['BALL', 'BEAR', 'BOAT', 'BOOK'],
        },
        {
          difficulty: 2,
          name: 'STARTS WITH C',
          words: ['CAR', 'CAKE', 'COIN', 'CROW'],
        },
        {
          difficulty: 3,
          name: 'STARTS WITH D',
          words: ['DOOR', 'DUCK', 'DRUM', 'DESK'],
        },
      ],
    },
    {
      id: 2,
      title: 'Sample Puzzle 2 (Easy Test)',
      author: 'System',
      dateCreated: new Date().toISOString().split('T')[0],
      categories: [
        {
          difficulty: 0,
          name: 'RED THINGS',
          words: ['ROSE', 'RUBY', 'RADISH', 'ROBIN'],
        },
        {
          difficulty: 1,
          name: 'BLUE THINGS',
          words: ['BLUEBERRY', 'BLUE JAY', 'BLUE WHALE', 'SAPPHIRE'],
        },
        {
          difficulty: 2,
          name: 'GREEN THINGS',
          words: ['GRASS', 'EMERALD', 'LIME', 'FROG'],
        },
        {
          difficulty: 3,
          name: 'YELLOW THINGS',
          words: ['BANANA', 'SUNFLOWER', 'LEMON', 'GOLD'],
        },
      ],
    },
    {
      id: 3,
      title: 'Sample Puzzle 3 (Easy Test)',
      author: 'System',
      dateCreated: new Date().toISOString().split('T')[0],
      categories: [
        {
          difficulty: 0,
          name: 'NUMBERS',
          words: ['ONE', 'TWO', 'THREE', 'FOUR'],
        },
        {
          difficulty: 1,
          name: 'LETTERS',
          words: ['ALPHA', 'BRAVO', 'CHARLIE', 'DELTA'],
        },
        {
          difficulty: 2,
          name: 'MONTHS',
          words: ['JANUARY', 'FEBRUARY', 'MARCH', 'APRIL'],
        },
        {
          difficulty: 3,
          name: 'DAYS',
          words: ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY'],
        },
      ],
    },
  ]
}
