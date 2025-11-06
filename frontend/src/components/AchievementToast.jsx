import { motion, AnimatePresence } from 'framer-motion'

const achievementData = {
  'mindreader': {
    emoji: '🧠',
    title: 'Mindreader!',
    description: 'Solved in perfect order with no mistakes',
  },
  'reverse-rainbow': {
    emoji: '🌈',
    title: 'Reverse Rainbow!',
    description: 'Solved in reverse order with no mistakes',
  },
  'perfect': {
    emoji: '⭐',
    title: 'Perfect Score!',
    description: 'No mistakes made',
  },
  'phew': {
    emoji: '😅',
    title: 'Phew!',
    description: 'Made it with one mistake remaining',
  },
}

function AchievementToast({ achievement, isVisible }) {
  if (!achievement || !achievementData[achievement]) return null

  const { emoji, title, description } = achievementData[achievement]

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -100, opacity: 0 }}
          transition={{ type: 'spring', damping: 20 }}
          className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50"
        >
          <div className="bg-white rounded-2xl shadow-2xl px-6 py-4 flex items-center gap-3 border-2 border-yellow-400">
            <div className="text-4xl">{emoji}</div>
            <div>
              <div className="font-bold text-lg">{title}</div>
              <div className="text-sm text-gray-600">{description}</div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default AchievementToast
