import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, TrendingUp, Target, Award } from 'lucide-react'

function Stats() {
  const navigate = useNavigate()
  const [stats, setStats] = useState([])
  const [loading, setLoading] = useState(true)
  const [puzzles, setPuzzles] = useState([])

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      const [statsResponse, puzzlesResponse] = await Promise.all([
        fetch('/api/stats'),
        fetch('/api/puzzles'),
      ])

      const statsData = await statsResponse.json()
      const puzzlesData = await puzzlesResponse.json()

      setStats(statsData)
      setPuzzles(puzzlesData)
    } catch (error) {
      console.error('Error loading stats:', error)
    } finally {
      setLoading(false)
    }
  }

  // Calculate stats by puzzle
  const calculatePuzzleStats = () => {
    const puzzleStats = {}

    stats.forEach(play => {
      if (!puzzleStats[play.puzzleId]) {
        puzzleStats[play.puzzleId] = {
          id: play.puzzleId,
          title: play.puzzleTitle,
          totalPlays: 0,
          wins: 0,
          losses: 0,
          totalMistakes: 0,
          achievements: {},
        }
      }

      const ps = puzzleStats[play.puzzleId]
      ps.totalPlays++
      if (play.won) {
        ps.wins++
      } else {
        ps.losses++
      }
      ps.totalMistakes += play.mistakes

      if (play.achievement) {
        ps.achievements[play.achievement] = (ps.achievements[play.achievement] || 0) + 1
      }
    })

    return Object.values(puzzleStats).sort((a, b) => b.totalPlays - a.totalPlays)
  }

  // Calculate which categories are hardest
  const calculateHardestCategories = () => {
    const categoryFailures = {}

    stats.forEach(play => {
      play.failedCategories.forEach(category => {
        categoryFailures[category] = (categoryFailures[category] || 0) + 1
      })
    })

    return Object.entries(categoryFailures)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
  }

  // Calculate overall stats
  const calculateOverallStats = () => {
    const total = stats.length
    const wins = stats.filter(s => s.won).length
    const losses = stats.filter(s => !s.won).length
    const winRate = total > 0 ? ((wins / total) * 100).toFixed(1) : 0
    const avgMistakes = total > 0 ? (stats.reduce((sum, s) => sum + s.mistakes, 0) / total).toFixed(1) : 0

    const achievements = {}
    stats.forEach(play => {
      if (play.achievement) {
        achievements[play.achievement] = (achievements[play.achievement] || 0) + 1
      }
    })

    return {
      total,
      wins,
      losses,
      winRate,
      avgMistakes,
      achievements,
    }
  }

  const achievementLabels = {
    'mindreader': 'Mindreader (Yellow→Purple, 0 mistakes)',
    'reverse-rainbow': 'Reverse Rainbow (Purple→Yellow, 0 mistakes)',
    'perfect': 'Perfect (0 mistakes)',
    'phew': 'Phew (3 mistakes)',
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Loading stats...</div>
      </div>
    )
  }

  const puzzleStats = calculatePuzzleStats()
  const hardestCategories = calculateHardestCategories()
  const overallStats = calculateOverallStats()

  return (
    <div className="min-h-screen max-w-4xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <button
          onClick={() => navigate('/puzzles')}
          className="flex items-center gap-2 text-gray-600 hover:text-black transition-colors"
        >
          <ArrowLeft size={20} />
          Back
        </button>
        <h1 className="text-3xl font-bold">Puzzle Statistics</h1>
        <div className="w-16"></div>
      </div>

      {stats.length === 0 ? (
        <div className="text-center text-gray-500 mt-12">
          <p className="text-xl">No games played yet!</p>
          <p className="mt-2">Complete some puzzles to see stats here.</p>
        </div>
      ) : (
        <div className="space-y-8">
          {/* Overall Stats */}
          <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg p-6 border-2 border-gray-200">
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
              <TrendingUp size={24} />
              Overall Stats
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-white rounded-lg p-4 text-center">
                <div className="text-3xl font-bold text-blue-600">{overallStats.total}</div>
                <div className="text-sm text-gray-600">Total Plays</div>
              </div>
              <div className="bg-white rounded-lg p-4 text-center">
                <div className="text-3xl font-bold text-green-600">{overallStats.winRate}%</div>
                <div className="text-sm text-gray-600">Win Rate</div>
              </div>
              <div className="bg-white rounded-lg p-4 text-center">
                <div className="text-3xl font-bold text-orange-600">{overallStats.avgMistakes}</div>
                <div className="text-sm text-gray-600">Avg Mistakes</div>
              </div>
              <div className="bg-white rounded-lg p-4 text-center">
                <div className="text-3xl font-bold text-purple-600">
                  {Object.values(overallStats.achievements).reduce((a, b) => a + b, 0)}
                </div>
                <div className="text-sm text-gray-600">Achievements</div>
              </div>
            </div>

            {Object.keys(overallStats.achievements).length > 0 && (
              <div className="mt-4 bg-white rounded-lg p-4">
                <h3 className="font-semibold mb-2 flex items-center gap-2">
                  <Award size={18} />
                  Achievements Earned
                </h3>
                <div className="space-y-1">
                  {Object.entries(overallStats.achievements).map(([achievement, count]) => (
                    <div key={achievement} className="flex justify-between text-sm">
                      <span>{achievementLabels[achievement] || achievement}</span>
                      <span className="font-semibold">{count}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Per-Puzzle Stats */}
          <div className="bg-white rounded-lg border-2 border-gray-200 p-6">
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
              <Target size={24} />
              Puzzle Breakdown
            </h2>
            <div className="space-y-4">
              {puzzleStats.map(ps => (
                <div key={ps.id} className="border-2 border-gray-100 rounded-lg p-4 hover:border-gray-300 transition-colors">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="font-bold text-lg">#{ps.id} - {ps.title}</h3>
                      <div className="text-sm text-gray-600 mt-1">
                        {ps.totalPlays} plays • {ps.wins}W - {ps.losses}L • {((ps.wins / ps.totalPlays) * 100).toFixed(0)}% win rate
                      </div>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm mt-3">
                    <div className="bg-blue-50 rounded px-3 py-2">
                      <div className="text-xs text-gray-600">Avg Mistakes</div>
                      <div className="font-semibold">{(ps.totalMistakes / ps.totalPlays).toFixed(1)}</div>
                    </div>
                    {Object.entries(ps.achievements).map(([achievement, count]) => (
                      <div key={achievement} className="bg-purple-50 rounded px-3 py-2">
                        <div className="text-xs text-gray-600 capitalize">{achievement.replace('-', ' ')}</div>
                        <div className="font-semibold">{count}x</div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Hardest Categories */}
          {hardestCategories.length > 0 && (
            <div className="bg-white rounded-lg border-2 border-gray-200 p-6">
              <h2 className="text-2xl font-bold mb-4">Hardest Categories</h2>
              <p className="text-sm text-gray-600 mb-4">Categories that caused the most wrong guesses</p>
              <div className="space-y-2">
                {hardestCategories.map(([category, count], index) => (
                  <div key={category} className="flex items-center gap-3">
                    <div className="text-2xl font-bold text-gray-400 w-8">{index + 1}</div>
                    <div className="flex-1 bg-gray-50 rounded-lg px-4 py-3">
                      <div className="flex justify-between items-center">
                        <span className="font-semibold">{category}</span>
                        <span className="text-sm text-gray-600">{count} wrong guesses</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default Stats
