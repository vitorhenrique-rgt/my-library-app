import { Route, Routes } from 'react-router-dom'
import MyLibraryPage from './pages/MyLibraryPage'
import SearchPage from './pages/SearchPage'

function App() {
  return (
    <Routes>
      <Route path="/" element={<SearchPage />} />
      <Route path="/my-library" element={<MyLibraryPage />} />
    </Routes>
  )
}

export default App
