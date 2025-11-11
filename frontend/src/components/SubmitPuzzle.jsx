import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowLeft, Eye, Send, Lock } from 'lucide-react'

// CategorySection component - MUST be outside main component to prevent focus loss
const CategorySection = ({ color, label, bgColor, formData, updateFormData, updateWord, errors }) => (
  <div className={`${bgColor} rounded-lg p-4`}>
    <h3 className="font-bold mb-3 uppercase tracking-wide">{label}</h3>
    <div className="space-y-3">
      <div>
        <label className="block text-sm font-medium mb-1">Category Name</label>
        <input
          type="text"
          value={formData[`${color}Category`]}
          onChange={(e) => updateFormData(`${color}Category`, e.target.value)}
          placeholder={`e.g., "Types of Fish"`}
          className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:border-black focus:outline-none bg-white"
        />
        {errors[`${color}Category`] && (
          <p className="text-red-600 text-sm mt-1">{errors[`${color}Category`]}</p>
        )}
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">4 Words</label>
        <div className="grid grid-cols-2 gap-2">
          {[0, 1, 2, 3].map(i => (
            <input
              key={i}
              type="text"
              value={formData[`${color}Words`][i]}
              onChange={(e) => updateWord(color, i, e.target.value)}
              placeholder={`Word ${i + 1}`}
              className="px-3 py-2 border-2 border-gray-300 rounded-lg focus:border-black focus:outline-none bg-white uppercase"
            />
          ))}
        </div>
        {errors[`${color}Words`] && (
          <p className="text-red-600 text-sm mt-1">{errors[`${color}Words`]}</p>
        )}
      </div>
    </div>
  </div>
)

function SubmitPuzzle() {
  const navigate = useNavigate()
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [passwordError, setPasswordError] = useState('')
  const [checkingPassword, setCheckingPassword] = useState(false)

  const [formData, setFormData] = useState({
    title: '',
    author: '',
    yellowCategory: '',
    yellowWords: ['', '', '', ''],
    greenCategory: '',
    greenWords: ['', '', '', ''],
    blueCategory: '',
    blueWords: ['', '', '', ''],
    purpleCategory: '',
    purpleWords: ['', '', '', ''],
  })

  const [errors, setErrors] = useState({})
  const [submitting, setSubmitting] = useState(false)
  const [submitSuccess, setSubmitSuccess] = useState(false)
  const [submitError, setSubmitError] = useState('')

  const handlePasswordSubmit = async (e) => {
    e.preventDefault()
    setPasswordError('')
    setCheckingPassword(true)

    try {
      const response = await fetch('/api/validate-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      })

      if (response.ok) {
        setIsAuthenticated(true)
      } else {
        setPasswordError('Invalid password. Please try again.')
      }
    } catch (error) {
      console.error('Password validation error:', error)
      setPasswordError('Cannot connect to server. Make sure the backend is running.')
    } finally {
      setCheckingPassword(false)
    }
  }

  const updateFormData = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    // Clear error for this field
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev }
        delete newErrors[field]
        return newErrors
      })
    }
  }

  const updateWord = (color, index, value) => {
    const key = `${color}Words`
    const newWords = [...formData[key]]
    newWords[index] = value
    updateFormData(key, newWords)
  }

  const validate = () => {
    const newErrors = {}

    // Title and author
    if (!formData.title.trim()) newErrors.title = 'Title is required'
    if (!formData.author.trim()) newErrors.author = 'Author name is required'

    // Validate each category
    const colors = ['yellow', 'green', 'blue', 'purple']
    colors.forEach(color => {
      const categoryKey = `${color}Category`
      const wordsKey = `${color}Words`

      if (!formData[categoryKey].trim()) {
        newErrors[categoryKey] = `${color.charAt(0).toUpperCase() + color.slice(1)} category name is required`
      }

      const words = formData[wordsKey].filter(w => w.trim())
      if (words.length !== 4) {
        newErrors[wordsKey] = `Must have exactly 4 words`
      }
    })

    // Check for duplicates
    const wordsByCategory = {
      yellow: formData.yellowWords.map(w => w.trim().toUpperCase()).filter(Boolean),
      green: formData.greenWords.map(w => w.trim().toUpperCase()).filter(Boolean),
      blue: formData.blueWords.map(w => w.trim().toUpperCase()).filter(Boolean),
      purple: formData.purpleWords.map(w => w.trim().toUpperCase()).filter(Boolean),
    }

    const allWords = [
      ...wordsByCategory.yellow,
      ...wordsByCategory.green,
      ...wordsByCategory.blue,
      ...wordsByCategory.purple,
    ]

    const uniqueWords = new Set(allWords)
    if (allWords.length === 16 && uniqueWords.size !== 16) {
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

      newErrors.duplicates = `Duplicate words found: ${duplicates.join('; ')}. Each word must be unique.`
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!validate()) {
      return
    }

    setSubmitting(true)
    setSubmitError('')

    try {
      const response = await fetch('/api/puzzles', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          password,
          puzzleData: {
            title: formData.title.trim(),
            author: formData.author.trim(),
            yellowCategory: formData.yellowCategory.trim(),
            yellowWords: formData.yellowWords.map(w => w.trim().toUpperCase()),
            greenCategory: formData.greenCategory.trim(),
            greenWords: formData.greenWords.map(w => w.trim().toUpperCase()),
            blueCategory: formData.blueCategory.trim(),
            blueWords: formData.blueWords.map(w => w.trim().toUpperCase()),
            purpleCategory: formData.purpleCategory.trim(),
            purpleWords: formData.purpleWords.map(w => w.trim().toUpperCase()),
          },
        }),
      })

      if (!response.ok) {
        let errorMessage = 'Failed to submit puzzle'
        try {
          const data = await response.json()
          errorMessage = data.error || errorMessage
        } catch (e) {
          // If JSON parsing fails, use status text
          errorMessage = `Server error: ${response.status} ${response.statusText}`
        }
        throw new Error(errorMessage)
      }

      const data = await response.json()

      setSubmitSuccess(true)
      // Redirect after 3 seconds
      setTimeout(() => navigate('/puzzles'), 3000)
    } catch (error) {
      console.error('Submit error:', error)
      if (error.message.includes('Failed to fetch') || error.message.includes('NetworkError')) {
        setSubmitError('Cannot connect to server. Make sure the backend is running on port 3001.')
      } else {
        setSubmitError(error.message)
      }
    } finally {
      setSubmitting(false)
    }
  }

  // Get all words for preview
  const getPreviewWords = () => {
    const words = [
      ...formData.yellowWords,
      ...formData.greenWords,
      ...formData.blueWords,
      ...formData.purpleWords,
    ].map(w => w.trim().toUpperCase()).filter(Boolean)

    // Shuffle for preview
    return words.sort(() => Math.random() - 0.5)
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 bg-[#EFEFE6]">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white rounded-2xl p-8 max-w-md w-full shadow-lg"
        >
          <div className="text-center mb-6">
            <Lock className="mx-auto mb-4 text-gray-400" size={48} />
            <h1 className="text-2xl font-bold mb-2">Submit a Puzzle</h1>
            <p className="text-gray-600">Enter the password to continue</p>
          </div>

          <form onSubmit={handlePasswordSubmit}>
            <div className="mb-4">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-black focus:outline-none"
                required
                disabled={checkingPassword}
              />
              {passwordError && (
                <p className="text-red-600 text-sm mt-2">{passwordError}</p>
              )}
            </div>
            <div className="mb-4">
              <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer">
                <input
                  type="checkbox"
                  checked={showPassword}
                  onChange={(e) => setShowPassword(e.target.checked)}
                  disabled={checkingPassword}
                />
                Show password
              </label>
            </div>
            <button
              type="submit"
              disabled={checkingPassword}
              className="w-full bg-black text-white py-3 rounded-lg font-semibold hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {checkingPassword ? 'Checking...' : 'Continue'}
            </button>
          </form>

          <button
            onClick={() => navigate('/')}
            className="w-full mt-4 text-gray-600 hover:text-black transition-colors"
          >
            Back to Home
          </button>
        </motion.div>
      </div>
    )
  }

  if (submitSuccess) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 bg-[#EFEFE6]">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white rounded-2xl p-8 max-w-md w-full shadow-lg text-center"
        >
          <div className="text-6xl mb-4">🎉</div>
          <h1 className="text-2xl font-bold mb-2">Puzzle Submitted!</h1>
          <p className="text-gray-600 mb-6">
            Your puzzle has been published and is now available to play.
          </p>
          <button
            onClick={() => navigate('/puzzles')}
            className="bg-black text-white px-6 py-3 rounded-lg font-semibold hover:bg-gray-800 transition-colors"
          >
            View Puzzles
          </button>
        </motion.div>
      </div>
    )
  }

  const previewWords = getPreviewWords()
  const showPreview = previewWords.length === 16

  return (
    <div className="min-h-screen bg-[#EFEFE6] pb-12">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate('/puzzles')}
            className="flex items-center gap-2 text-gray-600 hover:text-black transition-colors mb-4"
          >
            <ArrowLeft size={20} />
            Back
          </button>
          <h1 className="text-4xl font-bold">Submit a Puzzle</h1>
          <p className="text-gray-600 mt-2">Create your own Connections puzzle!</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Info */}
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <h2 className="text-xl font-bold mb-4">Puzzle Details</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Puzzle Title *</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => updateFormData('title', e.target.value)}
                  placeholder="Give your puzzle a creative name"
                  className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-black focus:outline-none"
                />
                {errors.title && <p className="text-red-600 text-sm mt-1">{errors.title}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Your Name *</label>
                <input
                  type="text"
                  value={formData.author}
                  onChange={(e) => updateFormData('author', e.target.value)}
                  placeholder="Who created this puzzle?"
                  className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-black focus:outline-none"
                />
                {errors.author && <p className="text-red-600 text-sm mt-1">{errors.author}</p>}
              </div>
            </div>
          </div>

          {/* Categories */}
          <div className="space-y-4">
            <CategorySection color="yellow" label="Yellow - Easiest" bgColor="bg-connections-yellow" formData={formData} updateFormData={updateFormData} updateWord={updateWord} errors={errors} />
            <CategorySection color="green" label="Green - Medium" bgColor="bg-connections-green" formData={formData} updateFormData={updateFormData} updateWord={updateWord} errors={errors} />
            <CategorySection color="blue" label="Blue - Hard" bgColor="bg-connections-blue" formData={formData} updateFormData={updateFormData} updateWord={updateWord} errors={errors} />
            <CategorySection color="purple" label="Purple - Hardest" bgColor="bg-connections-purple" formData={formData} updateFormData={updateFormData} updateWord={updateWord} errors={errors} />
          </div>

          {/* Preview */}
          {showPreview && (
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <div className="flex items-center gap-2 mb-4">
                <Eye size={20} />
                <h2 className="text-xl font-bold">Preview</h2>
              </div>
              <p className="text-sm text-gray-600 mb-4">This is how your puzzle will look (words are shuffled):</p>
              <div className="grid grid-cols-4 gap-2">
                {previewWords.map((word, i) => (
                  <div
                    key={i}
                    className="aspect-square bg-[#E8E8E0] rounded-lg flex items-center justify-center p-2 text-center text-sm font-semibold"
                  >
                    {word}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Errors */}
          {errors.duplicates && (
            <div className="bg-red-100 border-2 border-red-400 text-red-700 px-4 py-3 rounded-lg">
              {errors.duplicates}
            </div>
          )}

          {submitError && (
            <div className="bg-red-100 border-2 border-red-400 text-red-700 px-4 py-3 rounded-lg">
              {submitError}
            </div>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-green-600 text-white py-4 rounded-lg font-bold text-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            <Send size={20} />
            {submitting ? 'Submitting...' : 'Submit Puzzle'}
          </button>
        </form>
      </div>
    </div>
  )
}

export default SubmitPuzzle
