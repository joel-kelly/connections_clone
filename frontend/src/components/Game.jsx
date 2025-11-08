import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowLeft, Shuffle, Share2 } from 'lucide-react'
import WordGrid from './WordGrid'
import CategoryDisplay from './CategoryDisplay'
import Confetti from './Confetti'
import AchievementToast from './AchievementToast'

function Game() {
  const { puzzleId } = useParams()
  const navigate = useNavigate()

  const [puzzle, setPuzzle] = useState(null)
  const [words, setWords] = useState([])
  const [selectedWords, setSelectedWords] = useState([])
  const [foundCategories, setFoundCategories] = useState([])
  const [mistakes, setMistakes] = useState(0)
  const [gameWon, setGameWon] = useState(false)
  const [gameLost, setGameLost] = useState(false)
  const [shake, setShake] = useState(false)
  const [message, setMessage] = useState('')
  const [guessHistory, setGuessHistory] = useState([])
  const [loading, setLoading] = useState(true)
  const [achievement, setAchievement] = useState(null)
  const [showConfetti, setShowConfetti] = useState(false)

  const MAX_MISTAKES = 4

  useEffect(() => {
    loadPuzzle()
  }, [puzzleId])

  useEffect(() => {
    saveGameState()
  }, [words, selectedWords, foundCategories, mistakes, gameWon, gameLost, guessHistory, achievement])

  const loadPuzzle = async () => {
    try {
      const response = await fetch(`/api/puzzles/${puzzleId}`)
      const data = await response.json()
      setPuzzle(data)

      // Try to load saved game state
      const savedState = localStorage.getItem(`game_${puzzleId}`)
      if (savedState) {
        const state = JSON.parse(savedState)
        // Load saved state if it has progress (words remaining or game completed)
        if (state.words !== undefined && (state.words.length > 0 || state.gameWon || state.gameLost)) {
          setWords(state.words)
          setFoundCategories(state.foundCategories || [])
          setMistakes(state.mistakes || 0)
          setGameWon(state.gameWon || false)
          setGameLost(state.gameLost || false)
          setGuessHistory(state.guessHistory || [])
          setAchievement(state.achievement || null)
        } else {
          // Saved state is invalid, initialize new game
          const allWords = [
            ...data.categories[0].words,
            ...data.categories[1].words,
            ...data.categories[2].words,
            ...data.categories[3].words,
          ].map((word, index) => ({ id: index, text: word }))

          // Don't shuffle sample puzzles (author "System") for easier testing
          const isSamplePuzzle = data.author === 'System'
          setWords(isSamplePuzzle ? allWords : shuffleArray(allWords))
        }
      } else {
        // Initialize new game
        const allWords = [
          ...data.categories[0].words,
          ...data.categories[1].words,
          ...data.categories[2].words,
          ...data.categories[3].words,
        ].map((word, index) => ({ id: index, text: word }))

        // Don't shuffle sample puzzles (author "System") for easier testing
        const isSamplePuzzle = data.author === 'System'
        setWords(isSamplePuzzle ? allWords : shuffleArray(allWords))
      }
    } catch (error) {
      console.error('Error loading puzzle:', error)
    } finally {
      setLoading(false)
    }
  }

  const saveGameState = () => {
    const state = {
      words,
      foundCategories,
      mistakes,
      gameWon,
      gameLost,
      guessHistory,
      achievement,
    }
    localStorage.setItem(`game_${puzzleId}`, JSON.stringify(state))
  }

  const shuffleArray = (array) => {
    const shuffled = [...array]
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
    }
    return shuffled
  }

  const calculateAchievement = (newFoundCategories, currentMistakes) => {
    // Must win with no mistakes for special achievements
    if (currentMistakes === 0) {
      // Check if solved in yellow → green → blue → purple order
      const solvedOrder = newFoundCategories.map(cat => cat.difficulty)
      const isMindreader = JSON.stringify(solvedOrder) === JSON.stringify([0, 1, 2, 3])
      const isReverseRainbow = JSON.stringify(solvedOrder) === JSON.stringify([3, 2, 1, 0])

      if (isMindreader) return 'mindreader'
      if (isReverseRainbow) return 'reverse-rainbow'
      return 'perfect'
    }

    // Check for "Phew" - exactly 3 mistakes (1 life remaining)
    if (currentMistakes === 3) {
      return 'phew'
    }

    return null // Regular completion
  }

  const handleWordClick = (word) => {
    if (gameWon || gameLost) return

    if (selectedWords.find(w => w.id === word.id)) {
      setSelectedWords(selectedWords.filter(w => w.id !== word.id))
    } else if (selectedWords.length < 4) {
      setSelectedWords([...selectedWords, word])
    }
  }

  const handleShuffle = () => {
    setWords(shuffleArray(words))
  }

  const handleDeselectAll = () => {
    setSelectedWords([])
  }

  const handleSubmit = () => {
    if (selectedWords.length !== 4) return
    if (gameWon || gameLost) return // Prevent submitting after game ends

    const selectedTexts = selectedWords.map(w => w.text)

    // Check each category
    for (let i = 0; i < puzzle.categories.length; i++) {
      const category = puzzle.categories[i]
      const categoryWords = category.words

      // Check if all 4 selected words match this category
      const matches = selectedTexts.filter(text => categoryWords.includes(text)).length

      if (matches === 4) {
        // Correct guess!
        handleCorrectGuess(category, selectedTexts)
        return
      } else if (matches === 3) {
        // One away
        showMessage('One away!')
        triggerShake()
        return
      }
    }

    // Wrong guess
    handleWrongGuess(selectedTexts)
  }

  const handleCorrectGuess = (category, guessedWords) => {
    const newFoundCategories = [...foundCategories, category]
    setFoundCategories(newFoundCategories)

    // Record the guess
    const colorMap = {
      0: '🟨',
      1: '🟩',
      2: '🟦',
      3: '🟪',
    }
    const categoryIndex = puzzle.categories.findIndex(c => c.name === category.name)
    const categoryColor = colorMap[categoryIndex]
    // For correct guesses, all 4 words have the same color
    const newGuess = { words: guessedWords, colors: [categoryColor, categoryColor, categoryColor, categoryColor], correct: true }
    setGuessHistory([...guessHistory, newGuess])

    // Remove found words
    const remainingWords = words.filter(w => !guessedWords.includes(w.text))
    setWords(remainingWords)
    setSelectedWords([])
    showMessage('Correct!')

    // Check if game is won
    if (newFoundCategories.length === 4) {
      setGameWon(true)
      // Calculate achievement
      const earnedAchievement = calculateAchievement(newFoundCategories, mistakes)
      setAchievement(earnedAchievement)
      // Show confetti for achievements
      if (earnedAchievement) {
        setShowConfetti(true)
        setTimeout(() => setShowConfetti(false), 5000)
      }
    }
  }

  const handleWrongGuess = (guessedWords) => {
    const newMistakes = mistakes + 1
    setMistakes(newMistakes)

    // Record the guess with actual colors of each word
    const colorMap = {
      0: '🟨',
      1: '🟩',
      2: '🟦',
      3: '🟪',
    }

    // Find which category each word belongs to
    const guessColors = guessedWords.map(word => {
      for (let i = 0; i < puzzle.categories.length; i++) {
        if (puzzle.categories[i].words.includes(word)) {
          return colorMap[i]
        }
      }
      return '⬜' // fallback for words not found
    })

    const newGuess = { words: guessedWords, colors: guessColors, correct: false }
    setGuessHistory([...guessHistory, newGuess])

    setSelectedWords([])
    triggerShake()

    if (newMistakes >= MAX_MISTAKES) {
      setGameLost(true)
      // Reveal all remaining categories when game is lost
      setFoundCategories(puzzle.categories)
      setWords([])
    }
  }

  const triggerShake = () => {
    setShake(true)
    setTimeout(() => setShake(false), 500)
  }

  const showMessage = (msg) => {
    setMessage(msg)
    setTimeout(() => setMessage(''), 2000)
  }

  const handleShare = async () => {
    let shareText = `Connections #${puzzleId}\n`

    // Add each guess as a row (both correct and wrong)
    guessHistory.forEach(guess => {
      // Each guess has a colors array with 4 emojis
      shareText += guess.colors.join('') + '\n'
    })

    // Add status
    if (gameLost) {
      shareText += `\n❌ Lost after ${MAX_MISTAKES} mistakes`
    }

    // Try native share first (works on iOS)
    if (navigator.share) {
      try {
        await navigator.share({
          text: shareText,
        })
        return // Success!
      } catch (error) {
        // User cancelled - don't show error
        if (error.name === 'AbortError') {
          return
        }
        console.error('Share error:', error)
        // Fall through to manual copy
      }
    }

    // Fallback: Use textarea method (works on all browsers including iOS)
    try {
      const textarea = document.createElement('textarea')
      textarea.value = shareText
      textarea.style.position = 'fixed'
      textarea.style.opacity = '0'
      document.body.appendChild(textarea)
      textarea.select()
      textarea.setSelectionRange(0, 99999) // For mobile
      document.execCommand('copy')
      document.body.removeChild(textarea)
      showMessage('Copied to clipboard!')
    } catch (error) {
      console.error('Copy error:', error)
      showMessage('Tap and hold to copy:\n' + shareText)
    }
  }

  const handlePlayAgain = () => {
    // Clear saved state and restart
    localStorage.removeItem(`game_${puzzleId}`)
    loadPuzzle()
    setSelectedWords([])
    setFoundCategories([])
    setMistakes(0)
    setGameWon(false)
    setGameLost(false)
    setGuessHistory([])
    setAchievement(null)
    setShowConfetti(false)
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Loading puzzle...</div>
      </div>
    )
  }

  if (!puzzle) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Puzzle not found</div>
      </div>
    )
  }

  const remainingLives = MAX_MISTAKES - mistakes
  // Only sample puzzles (with author "System") should not be shuffled
  const isSamplePuzzle = puzzle.author === 'System'

  return (
    <div className="min-h-screen max-w-2xl mx-auto px-3 py-2 md:px-4 md:py-8">
      {/* Confetti and Achievement Toast */}
      {showConfetti && <Confetti />}
      <AchievementToast achievement={achievement} isVisible={showConfetti} />

      {/* Header */}
      <div className="mb-3 md:mb-6 flex items-center justify-between">
        <button
          onClick={() => navigate('/puzzles')}
          className="flex items-center gap-2 text-gray-600 hover:text-black transition-colors"
        >
          <ArrowLeft size={20} />
        </button>
        <h1 className="text-xl md:text-2xl font-bold">{puzzle.title}</h1>
        <div className="w-8"></div>
      </div>

      {/* Message */}
      <AnimatePresence>
        {message && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="text-center mb-4 text-lg font-semibold"
          >
            {message}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Found Categories */}
      <div className="space-y-1.5 md:space-y-2 mb-2 md:mb-4">
        {foundCategories.map((category, index) => (
          <CategoryDisplay key={index} category={category} />
        ))}
      </div>

      {/* Word Grid */}
      {words.length > 0 && (
        <motion.div
          animate={shake ? { x: [-10, 10, -10, 10, 0] } : {}}
          transition={{ duration: 0.5 }}
        >
          <WordGrid
            words={words}
            selectedWords={selectedWords}
            onWordClick={handleWordClick}
            disabled={gameWon || gameLost}
          />
        </motion.div>
      )}

      {/* Mistakes */}
      <div className="mt-3 md:mt-6 flex justify-center gap-2">
        {[...Array(MAX_MISTAKES)].map((_, i) => (
          <div
            key={i}
            className={`w-3 h-3 rounded-full ${
              i < mistakes ? 'bg-gray-400' : 'bg-gray-200'
            }`}
          />
        ))}
      </div>
      <div className="text-center mt-1 md:mt-2 text-sm text-gray-500">
        Mistakes remaining: {remainingLives}
      </div>

      {/* Controls */}
      {!gameWon && !gameLost && words.length > 0 && (
        <div className="mt-3 md:mt-6 flex flex-col gap-2 md:gap-3">
          <div className="flex gap-3">
            {!isSamplePuzzle && (
              <button
                onClick={handleShuffle}
                className="flex-1 py-2.5 md:py-3 px-3 md:px-4 border-2 border-black rounded-full font-semibold text-sm md:text-base
                         hover:bg-gray-100 transition-colors flex items-center justify-center gap-2"
              >
                <Shuffle size={18} />
                Shuffle
              </button>
            )}
            <button
              onClick={handleDeselectAll}
              disabled={selectedWords.length === 0}
              className={`${isSamplePuzzle ? 'w-full' : 'flex-1'} py-2.5 md:py-3 px-3 md:px-4 border-2 border-black rounded-full font-semibold text-sm md:text-base
                       hover:bg-gray-100 transition-colors disabled:opacity-30 disabled:cursor-not-allowed`}
            >
              Deselect All
            </button>
          </div>
          <button
            onClick={handleSubmit}
            disabled={selectedWords.length !== 4}
            className="w-full py-2.5 md:py-3 px-3 md:px-4 bg-black text-white rounded-full font-semibold text-sm md:text-base
                     hover:bg-gray-800 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
          >
            Submit
          </button>
        </div>
      )}

      {/* Game Complete Buttons */}
      {(gameWon || gameLost) && (
        <div className="mt-3 md:mt-6 flex flex-col gap-2 md:gap-3">
          <button
            onClick={handleShare}
            className="w-full py-2.5 md:py-3 px-3 md:px-4 bg-green-600 text-white rounded-full font-semibold text-sm md:text-base
                     hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
          >
            <Share2 size={18} />
            Share Results
          </button>
          <button
            onClick={handlePlayAgain}
            className="w-full py-2.5 md:py-3 px-3 md:px-4 bg-black text-white rounded-full font-semibold text-sm md:text-base
                     hover:bg-gray-800 transition-colors flex items-center justify-center gap-2"
          >
            Play Again
          </button>
          <button
            onClick={() => navigate('/puzzles')}
            className="w-full py-2.5 md:py-3 px-3 md:px-4 border-2 border-gray-300 rounded-full font-semibold text-sm md:text-base
                     hover:bg-gray-50 transition-colors"
          >
            Back to Puzzles
          </button>
        </div>
      )}
    </div>
  )
}

export default Game
