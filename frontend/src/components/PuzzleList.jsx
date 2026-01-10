import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowLeft, Circle, Plus, BarChart3, ArrowUpDown } from 'lucide-react'
import { useSheetParam } from '../hooks/useSheetParam'

function PuzzleList() {
  const navigate = useNavigate()
  const sheet = useSheetParam()
  const [puzzles, setPuzzles] = useState([])
  const [loading, setLoading] = useState(true)
  const [sortNewestFirst, setSortNewestFirst] = useState(true)
  const [hideCompleted, setHideCompleted] = useState(false)

  useEffect(() => {
    fetchPuzzles()
  }, [sheet])

  const fetchPuzzles = async () => {
    try {
      const url = sheet
        ? `/api/puzzles?sheet=${encodeURIComponent(sheet)}`
        : '/api/puzzles'
      const response = await fetch(url)
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      const data = await response.json()
      setPuzzles(data)
    } catch (error) {
      console.error('Error fetching puzzles:', error)
      // Set empty array on error so UI still works
      setPuzzles([])
    } finally {
      setLoading(false)
    }
  }

  // Get sorted and filtered puzzles
  const getDisplayedPuzzles = () => {
    let filteredPuzzles = [...puzzles]

    // Filter out completed puzzles if hideCompleted is true
    if (hideCompleted) {
      filteredPuzzles = filteredPuzzles.filter(puzzle => !isPuzzleCompleted(puzzle.id))
    }

    // Sort by ID (newest first or oldest first)
    return filteredPuzzles.sort((a, b) =>
      sortNewestFirst ? b.id - a.id : a.id - b.id
    )
  }

  const getGameState = (puzzleId) => {
    const storageKey = sheet
      ? `game_${sheet}_${puzzleId}`
      : `game_${puzzleId}`
    const saved = localStorage.getItem(storageKey)
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

      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-4xl font-bold">Select a Puzzle</h1>
          <div className="flex gap-2">
            {!sheet && (
              <button
                onClick={() => navigate('/stats')}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-700 transition-colors flex items-center gap-2"
              >
                <BarChart3 size={20} />
                Stats
              </button>
            )}
            <button
              onClick={() => navigate(`/submit${sheet ? `?sheet=${sheet}` : ''}`)}
              className="bg-green-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-green-700 transition-colors flex items-center gap-2"
            >
              <Plus size={20} />
              Submit Puzzle
            </button>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setSortNewestFirst(!sortNewestFirst)}
            className="bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2"
          >
            <ArrowUpDown size={18} />
            {sortNewestFirst ? 'Newest First' : 'Oldest First'}
          </button>

          <label className="flex items-center gap-2 bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded-lg font-medium transition-colors cursor-pointer">
            <input
              type="checkbox"
              checked={hideCompleted}
              onChange={(e) => setHideCompleted(e.target.checked)}
              className="w-4 h-4 rounded"
            />
            Hide Completed
          </label>
        </div>
      </div>

      <div className="space-y-3">
        {getDisplayedPuzzles().map((puzzle, index) => {
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
                onClick={() => navigate(`/play/${puzzle.id}${sheet ? `?sheet=${sheet}` : ''}`)}
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

      {getDisplayedPuzzles().length === 0 && puzzles.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          <p>No puzzles available yet.</p>
          <p className="text-sm mt-2">Ask your family to submit some puzzles!</p>
        </div>
      )}

      {getDisplayedPuzzles().length === 0 && puzzles.length > 0 && (
        <div className="text-center py-12 text-gray-500">
          <p>No puzzles match the current filters.</p>
          <p className="text-sm mt-2">Try adjusting your filter settings.</p>
        </div>
      )}
    </div>
  )
}

export default PuzzleList
