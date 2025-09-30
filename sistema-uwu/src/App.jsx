import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import HomePage from './pages/HomePage'
import Admin01 from './pages/Admin01'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/entrenar-letras" element={<Admin01 />} />
      </Routes>
    </Router>
  )
}

export default App