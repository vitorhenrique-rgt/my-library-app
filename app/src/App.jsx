import { Route, Routes } from 'react-router-dom'
import AuthPage from './pages/AuthPage'
import BookDetailsPage from './pages/BookDetailsPage'
import MyLibraryPage from './pages/MyLibraryPage'
import SearchPage from './pages/SearchPage'

function App() {
  return (
    <Routes>
      <Route path="/auth" element={<AuthPage />} />
      <Route path="/" element={<SearchPage />} />
      <Route path="/my-library" element={<MyLibraryPage />} />
      <Route path="/book/:googleBookId" element={<BookDetailsPage />} />
    </Routes>
  )
}

export default App
