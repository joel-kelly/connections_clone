import { motion, AnimatePresence } from 'framer-motion'
import { X, Share2, RotateCcw, Eye } from 'lucide-react'

function GameOverModal({ isOpen, won, puzzle, onPlayAgain, onViewSolution, onShare, onClose }) {
  if (!isOpen) return null

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          onClick={(e) => e.stopPropagation()}
          className="bg-white rounded-2xl p-6 max-w-md w-full"
        >
          <div className="flex justify-between items-start mb-4">
            <h2 className="text-2xl font-bold">
              {won ? '🎉 Congratulations!' : '😔 Game Over'}
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <X size={24} />
            </button>
          </div>

          <p className="text-gray-600 mb-6">
            {won
              ? `You solved "${puzzle.title}"!`
              : `Better luck next time with "${puzzle.title}".`}
          </p>

          <div className="space-y-3">
            {won && onShare && (
              <button
                onClick={onShare}
                className="w-full py-3 px-4 bg-green-600 text-white rounded-lg font-semibold
                         hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
              >
                <Share2 size={18} />
                Share Results
              </button>
            )}

            <button
              onClick={onPlayAgain}
              className="w-full py-3 px-4 bg-black text-white rounded-lg font-semibold
                       hover:bg-gray-800 transition-colors flex items-center justify-center gap-2"
            >
              <RotateCcw size={18} />
              Play Again
            </button>

            {!won && (
              <button
                onClick={onViewSolution}
                className="w-full py-3 px-4 border-2 border-black rounded-lg font-semibold
                         hover:bg-gray-100 transition-colors flex items-center justify-center gap-2"
              >
                <Eye size={18} />
                View Solution
              </button>
            )}

            <button
              onClick={onClose}
              className="w-full py-3 px-4 border-2 border-gray-300 rounded-lg font-semibold
                       hover:bg-gray-50 transition-colors"
            >
              Back to Puzzles
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}

export default GameOverModal
