import { motion } from 'framer-motion'

const difficultyColors = {
  0: 'bg-connections-yellow',
  1: 'bg-connections-green',
  2: 'bg-connections-blue',
  3: 'bg-connections-purple',
}

function CategoryDisplay({ category }) {
  const colorClass = difficultyColors[category.difficulty] || 'bg-gray-400'

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`${colorClass} rounded-lg p-2.5 md:p-4 text-center`}
    >
      <div className="font-bold text-xs md:text-base mb-0.5 md:mb-1 uppercase tracking-wide">
        {category.name}
      </div>
      <div className="text-xs md:text-sm">
        {category.words.join(', ').toUpperCase()}
      </div>
    </motion.div>
  )
}

export default CategoryDisplay
