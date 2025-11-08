import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import { getSheetsClient, fetchPuzzles, submitPuzzle } from './sheets.js'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 3070
const SUBMIT_PASSWORD = process.env.SUBMIT_PASSWORD || 'kellyconnect'

app.use(cors())
app.use(express.json())

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' })
})

// Get all puzzles
app.get('/api/puzzles', async (req, res) => {
  try {
    const puzzles = await fetchPuzzles()
    res.json(puzzles)
  } catch (error) {
    console.error('Error fetching puzzles:', error)
    res.status(500).json({ error: 'Failed to fetch puzzles' })
  }
})

// Get specific puzzle
app.get('/api/puzzles/:id', async (req, res) => {
  try {
    const puzzles = await fetchPuzzles()
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

// Submit new puzzle
app.post('/api/puzzles', async (req, res) => {
  try {
    const { password, puzzleData } = req.body

    // Validate password
    if (password !== SUBMIT_PASSWORD) {
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
    const allWords = [
      ...puzzleData.yellowWords,
      ...puzzleData.greenWords,
      ...puzzleData.blueWords,
      ...puzzleData.purpleWords,
    ].map(w => w.toUpperCase().trim())

    const uniqueWords = new Set(allWords)
    if (uniqueWords.size !== 16) {
      return res.status(400).json({ error: 'Duplicate words found. Each word must be unique.' })
    }

    // Submit to Google Sheets
    const result = await submitPuzzle(puzzleData)

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

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`)
})
