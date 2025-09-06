// src/App.jsx
import { Route, Routes, useLocation } from 'react-router-dom'
import Header from './components/Header'
import AuthPage from './pages/AuthPage'
import BookDetailsPage from './pages/BookDetailsPage'
import MyLibraryPage from './pages/MyLibraryPage'
import SearchPage from './pages/SearchPage'

function App() {
  const location = useLocation()
  const showHeader = location.pathname !== '/auth'

  return (
    <div className="min-h-screen bg-backgroundLight dark:bg-backgroundDark text-textLight dark:text-textDark font-sans">
      {showHeader && <Header />}
      <Routes>
        <Route path="/auth" element={<AuthPage />} />
        <Route path="/" element={<SearchPage />} />
        <Route path="/my-library" element={<MyLibraryPage />} />
        <Route path="/book/:id" element={<BookDetailsPage />} />
      </Routes>
    </div>
  )
}

export default App
