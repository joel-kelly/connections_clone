import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowLeft, Circle } from 'lucide-react'

function PuzzleList() {
  const navigate = useNavigate()
  const [puzzles, setPuzzles] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchPuzzles()
  }, [])

  const fetchPuzzles = async () => {
    try {
      const response = await fetch('/api/puzzles')
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      const data = await response.json()
      // Sort puzzles by ID to maintain consistent order
      const sortedPuzzles = data.sort((a, b) => a.id - b.id)
      setPuzzles(sortedPuzzles)
    } catch (error) {
      console.error('Error fetching puzzles:', error)
      // Set empty array on error so UI still works
      setPuzzles([])
    } finally {
      setLoading(false)
    }
  }

  const getGameState = (puzzleId) => {
    const saved = localStorage.getItem(`game_${puzzleId}`)
    return saved ? JSON.parse(saved) : null
  }

  const isPuzzleCompleted = (puzzleId) => {
    const state = getGameState(puzzleId)
    return state?.gameWon === true
  }

  const getAchievementBadge = (puzzleId) => {
    const state = getGameState(puzzleId)
    if (!state?.gameWon) return null

    const achievementEmojis = {
      'mindreader': '🧠',
      'reverse-rainbow': '🌈',
      'perfect': '⭐',
      'phew': '😅',
    }

    return achievementEmojis[state.achievement] || '✅'
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Loading puzzles...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen max-w-2xl mx-auto px-4 py-8">
      <div className="mb-8">
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-2 text-gray-600 hover:text-black transition-colors"
        >
          <ArrowLeft size={20} />
          Back
        </button>
      </div>

      <h1 className="text-4xl font-bold mb-8">Select a Puzzle</h1>

      <div className="space-y-3">
        {puzzles.map((puzzle, index) => {
          const completed = isPuzzleCompleted(puzzle.id)
          const state = getGameState(puzzle.id)
          const badge = getAchievementBadge(puzzle.id)

          return (
            <motion.div
              key={puzzle.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <button
                onClick={() => navigate(`/play/${puzzle.id}`)}
                className="w-full bg-white rounded-lg p-4 shadow-sm hover:shadow-md
                         transition-all border border-gray-200 text-left"
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      {completed ? (
                        <div className="text-2xl">{badge}</div>
                      ) : state?.foundCategories?.length > 0 ? (
                        <div className="text-sm text-gray-500">
                          {state.foundCategories.length}/4
                        </div>
                      ) : (
                        <Circle className="text-gray-300" size={20} />
                      )}
                      <div>
                        <h2 className="text-lg font-semibold">{puzzle.title}</h2>
                        {puzzle.author && (
                          <p className="text-sm text-gray-500">by {puzzle.author}</p>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="text-sm text-gray-400">
                    #{puzzle.id}
                  </div>
                </div>
              </button>
            </motion.div>
          )
        })}
      </div>

      {puzzles.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          <p>No puzzles available yet.</p>
          <p className="text-sm mt-2">Ask your family to submit some puzzles!</p>
        </div>
      )}
    </div>
  )
}

export default PuzzleList
