import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import { getSheetsClient, fetchPuzzles, submitPuzzle, logGamePlay, fetchPlayStats } from './sheets.js'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 3070

// Sheet configurations with passwords and stats settings
const SHEET_CONFIGS = {
  'Puzzles': {
    submitPassword: process.env.SUBMIT_PASSWORD || 'kellyconnect',
    enableStats: true
  },
  'Aoife_Puzzles': {
    submitPassword: process.env.AOIFE_SUBMIT_PASSWORD || 'aoifeconnect',
    enableStats: false
  }
}

const DEFAULT_SHEET = 'Puzzles'

// Helper function to get validated sheet name from query parameter
function getValidatedSheetName(req) {
  const sheetParam = req.query.sheet || DEFAULT_SHEET
  return SHEET_CONFIGS[sheetParam] ? sheetParam : DEFAULT_SHEET
}

// Helper function to get sheet configuration
function getSheetConfig(sheetName) {
  return SHEET_CONFIGS[sheetName] || SHEET_CONFIGS[DEFAULT_SHEET]
}

app.use(cors())
app.use(express.json())

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' })
})

// Get all puzzles
app.get('/api/puzzles', async (req, res) => {
  try {
    const sheetName = getValidatedSheetName(req)
    const puzzles = await fetchPuzzles(sheetName)
    res.json(puzzles)
  } catch (error) {
    console.error('Error fetching puzzles:', error)
    res.status(500).json({ error: 'Failed to fetch puzzles' })
  }
})

// Get specific puzzle
app.get('/api/puzzles/:id', async (req, res) => {
  try {
    const sheetName = getValidatedSheetName(req)
    const puzzles = await fetchPuzzles(sheetName)
    const puzzle = puzzles.find(p => p.id === parseInt(req.params.id))

    if (!puzzle) {
      return res.status(404).json({ error: 'Puzzle not found' })
    }

    res.json(puzzle)
  } catch (error) {
    console.error('Error fetching puzzle:', error)
    res.status(500).json({ error: 'Failed to fetch puzzle' })
  }
})

// Validate password
app.post('/api/validate-password', (req, res) => {
  const { password } = req.body
  const sheetName = getValidatedSheetName(req)
  const config = getSheetConfig(sheetName)

  if (password === config.submitPassword) {
    res.json({ valid: true })
  } else {
    res.status(401).json({ valid: false, error: 'Invalid password' })
  }
})

// Submit new puzzle
app.post('/api/puzzles', async (req, res) => {
  try {
    const { password, puzzleData } = req.body
    const sheetName = getValidatedSheetName(req)
    const config = getSheetConfig(sheetName)

    // Validate password
    if (password !== config.submitPassword) {
      return res.status(401).json({ error: 'Invalid password' })
    }

    // Validate puzzle data
    if (!puzzleData || !puzzleData.title || !puzzleData.author) {
      return res.status(400).json({ error: 'Missing required fields' })
    }

    // Validate categories and words
    const categories = ['yellow', 'green', 'blue', 'purple']
    for (const color of categories) {
      const categoryKey = `${color}Category`
      const wordsKey = `${color}Words`

      if (!puzzleData[categoryKey] || !puzzleData[wordsKey]) {
        return res.status(400).json({ error: `Missing ${color} category or words` })
      }

      if (!Array.isArray(puzzleData[wordsKey]) || puzzleData[wordsKey].length !== 4) {
        return res.status(400).json({ error: `${color} category must have exactly 4 words` })
      }
    }

    // Check for duplicate words
    const wordsByCategory = {
      yellow: puzzleData.yellowWords.map(w => w.toUpperCase().trim()),
      green: puzzleData.greenWords.map(w => w.toUpperCase().trim()),
      blue: puzzleData.blueWords.map(w => w.toUpperCase().trim()),
      purple: puzzleData.purpleWords.map(w => w.toUpperCase().trim()),
    }

    const allWords = [
      ...wordsByCategory.yellow,
      ...wordsByCategory.green,
      ...wordsByCategory.blue,
      ...wordsByCategory.purple,
    ]

    const uniqueWords = new Set(allWords)
    if (uniqueWords.size !== 16) {
      // Find duplicates and which categories they're in
      const wordCounts = {}
      const wordLocations = {}

      for (const [category, words] of Object.entries(wordsByCategory)) {
        words.forEach(word => {
          wordCounts[word] = (wordCounts[word] || 0) + 1
          if (!wordLocations[word]) {
            wordLocations[word] = []
          }
          wordLocations[word].push(category)
        })
      }

      const duplicates = Object.entries(wordCounts)
        .filter(([word, count]) => count > 1)
        .map(([word, count]) => `"${word}" (in ${wordLocations[word].join(', ')})`)

      return res.status(400).json({
        error: `Duplicate words found: ${duplicates.join('; ')}. Each word must be unique.`
      })
    }

    // Submit to Google Sheets
    const result = await submitPuzzle(puzzleData, sheetName)

    res.json({
      success: true,
      puzzleId: result.id,
      message: 'Puzzle submitted successfully!'
    })
  } catch (error) {
    console.error('Error submitting puzzle:', error)
    res.status(500).json({ error: 'Failed to submit puzzle' })
  }
})

// Log game play
app.post('/api/stats/log', async (req, res) => {
  try {
    const sheetName = getValidatedSheetName(req)
    const config = getSheetConfig(sheetName)

    // Only log stats for sheets with stats enabled
    if (!config.enableStats) {
      return res.json({ success: true, message: 'Stats logging disabled for this sheet' })
    }

    const { puzzleId, puzzleTitle, won, mistakes, achievement, failedCategories } = req.body

    if (!puzzleId || won === undefined || mistakes === undefined) {
      return res.status(400).json({ error: 'Missing required fields' })
    }

    const result = await logGamePlay({
      puzzleId,
      puzzleTitle,
      won,
      mistakes,
      achievement,
      failedCategories,
    })

    res.json(result)
  } catch (error) {
    console.error('Error logging play:', error)
    res.status(500).json({ error: 'Failed to log play' })
  }
})

// Get play stats
app.get('/api/stats', async (req, res) => {
  try {
    const sheetName = getValidatedSheetName(req)
    const config = getSheetConfig(sheetName)

    // Only return stats for sheets with stats enabled
    if (!config.enableStats) {
      return res.json([])
    }

    const stats = await fetchPlayStats()
    res.json(stats)
  } catch (error) {
    console.error('Error fetching stats:', error)
    res.status(500).json({ error: 'Failed to fetch stats' })
  }
})

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`)
})
