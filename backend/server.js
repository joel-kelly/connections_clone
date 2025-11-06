import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import { getSheetsClient, fetchPuzzles } from './sheets.js'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 3001

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

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`)
})
