import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'

function Confetti() {
  const [confettiPieces] = useState(() => {
    // Create 50 random confetti pieces
    return Array.from({ length: 50 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      delay: Math.random() * 0.5,
      duration: 2 + Math.random() * 2,
      color: ['#F9DF6D', '#A0C35A', '#B0C4EF', '#BA81C5', '#FF6B6B', '#4ECDC4'][
        Math.floor(Math.random() * 6)
      ],
      rotation: Math.random() * 360,
      size: 8 + Math.random() * 8,
    }))
  })

  return (
    <div className="fixed inset-0 pointer-events-none z-50">
      {confettiPieces.map((piece) => (
        <motion.div
          key={piece.id}
          initial={{ y: -20, x: `${piece.x}vw`, opacity: 1, rotate: 0 }}
          animate={{
            y: '100vh',
            rotate: piece.rotation * 3,
            opacity: 0,
          }}
          transition={{
            duration: piece.duration,
            delay: piece.delay,
            ease: 'easeIn',
          }}
          style={{
            position: 'absolute',
            width: piece.size,
            height: piece.size,
            backgroundColor: piece.color,
            borderRadius: '2px',
          }}
        />
      ))}
    </div>
  )
}

export default Confetti
