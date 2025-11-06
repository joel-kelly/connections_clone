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
        scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'],
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

export async function fetchPuzzles() {
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
      range: 'Puzzles!A2:M', // Skip header row
    })

    const rows = response.data.values
    if (!rows || rows.length === 0) {
      return getSamplePuzzles()
    }

    return rows.map((row, index) => ({
      id: parseInt(row[0]) || index + 1,
      title: row[1] || `Puzzle ${index + 1}`,
      author: row[2] || '',
      dateCreated: row[3] || '',
      categories: [
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
      ],
    }))
  } catch (error) {
    console.error('Error fetching from Google Sheets:', error)
    return getSamplePuzzles()
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
