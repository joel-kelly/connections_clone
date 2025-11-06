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
      title: 'Sample Puzzle 1',
      author: 'System',
      dateCreated: new Date().toISOString().split('T')[0],
      categories: [
        {
          difficulty: 0,
          name: 'FISH',
          words: ['BASS', 'FLOUNDER', 'SALMON', 'TROUT'],
        },
        {
          difficulty: 1,
          name: 'PLANETS',
          words: ['EARTH', 'MARS', 'VENUS', 'JUPITER'],
        },
        {
          difficulty: 2,
          name: '___ PAPER',
          words: ['TOILET', 'NEWS', 'WALL', 'SAND'],
        },
        {
          difficulty: 3,
          name: 'STARTS WITH METALS',
          words: ['GOLDEN', 'LEADERSHIP', 'IRONIC', 'BRAZEN'],
        },
      ],
    },
    {
      id: 2,
      title: 'Sample Puzzle 2',
      author: 'System',
      dateCreated: new Date().toISOString().split('T')[0],
      categories: [
        {
          difficulty: 0,
          name: 'COLORS',
          words: ['RED', 'BLUE', 'GREEN', 'YELLOW'],
        },
        {
          difficulty: 1,
          name: 'FRUITS',
          words: ['APPLE', 'BANANA', 'ORANGE', 'GRAPE'],
        },
        {
          difficulty: 2,
          name: 'WEATHER',
          words: ['RAIN', 'SNOW', 'WIND', 'FOG'],
        },
        {
          difficulty: 3,
          name: 'CHESS PIECES',
          words: ['KING', 'QUEEN', 'ROOK', 'KNIGHT'],
        },
      ],
    },
    {
      id: 3,
      title: 'Sample Puzzle 3',
      author: 'System',
      dateCreated: new Date().toISOString().split('T')[0],
      categories: [
        {
          difficulty: 0,
          name: 'BODY PARTS',
          words: ['ARM', 'LEG', 'HEAD', 'FOOT'],
        },
        {
          difficulty: 1,
          name: 'SEASONS',
          words: ['SPRING', 'SUMMER', 'FALL', 'WINTER'],
        },
        {
          difficulty: 2,
          name: 'CARD SUITS',
          words: ['HEARTS', 'DIAMONDS', 'CLUBS', 'SPADES'],
        },
        {
          difficulty: 3,
          name: 'SOCIAL MEDIA',
          words: ['TWITTER', 'FACEBOOK', 'INSTAGRAM', 'TIKTOK'],
        },
      ],
    },
  ]
}
