import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Play } from 'lucide-react'

function WelcomeScreen() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center"
      >
        <h1 className="text-5xl md:text-6xl font-bold mb-4 tracking-tight">
          Connections
        </h1>
        <p className="text-gray-600 text-lg md:text-xl mb-8 max-w-md mx-auto">
          Group words that share a common thread.
        </p>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate('/puzzles')}
          className="bg-black text-white px-8 py-4 rounded-full text-lg font-semibold
                     hover:bg-gray-800 transition-colors flex items-center gap-2 mx-auto"
        >
          <Play size={20} />
          Play
        </motion.button>

        <div className="mt-12 text-sm text-gray-500">
          <p>Find groups of four items that share something in common.</p>
        </div>

        <div className="mt-8 flex gap-2 justify-center">
          <div className="w-4 h-4 rounded-full bg-connections-yellow"></div>
          <div className="w-4 h-4 rounded-full bg-connections-green"></div>
          <div className="w-4 h-4 rounded-full bg-connections-blue"></div>
          <div className="w-4 h-4 rounded-full bg-connections-purple"></div>
        </div>
      </motion.div>
    </div>
  )
}

export default WelcomeScreen
