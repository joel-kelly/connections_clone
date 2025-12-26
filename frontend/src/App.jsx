import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import WelcomeScreen from './components/WelcomeScreen'
import PuzzleList from './components/PuzzleList'
import Game from './components/Game'
import SubmitPuzzle from './components/SubmitPuzzle'
import Stats from './components/Stats'

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-[#EFEFE6]">
        <Routes>
          <Route path="/" element={<WelcomeScreen />} />
          <Route path="/puzzles" element={<PuzzleList />} />
          <Route path="/play/:puzzleId" element={<Game />} />
          <Route path="/submit" element={<SubmitPuzzle />} />
          <Route path="/stats" element={<Stats />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </Router>
  )
}

export default App
