import { motion } from 'framer-motion'

function WordGrid({ words, selectedWords, onWordClick, disabled }) {
  const isSelected = (word) => selectedWords.find(w => w.id === word.id)

  return (
    <div className="grid grid-cols-4 gap-1.5 md:gap-3">
      {words.map((word, index) => (
        <motion.button
          key={word.id}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          transition={{ delay: index * 0.02 }}
          onClick={() => onWordClick(word)}
          disabled={disabled}
          className={`
            aspect-square rounded-lg font-semibold text-xs md:text-base
            transition-all duration-200 flex items-center justify-center
            p-1.5 md:p-2 text-center leading-tight
            ${
              isSelected(word)
                ? 'bg-gray-700 text-white scale-95'
                : 'bg-[#E8E8E0] text-black hover:bg-gray-300'
            }
            ${disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}
            active:scale-90
          `}
        >
          {word.text.toUpperCase()}
        </motion.button>
      ))}
    </div>
  )
}

export default WordGrid
