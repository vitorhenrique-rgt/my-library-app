import { useContext, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { AuthContext } from '../context/AuthContext'
import { ThemeContext } from '../context/ThemeContext'

function Header() {
  const { isAuthenticated, logout } = useContext(AuthContext)
  const { theme, toggleTheme } = useContext(ThemeContext)
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    setIsMenuOpen(false)
    navigate('/')
  }

  const renderAuthSection = () => {
    if (isAuthenticated) {
      return (
        <div className="relative">
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="flex items-center gap-2 p-2 rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary hover:bg-cardLight hover:dark:bg-cardDark"
          >
            {/* Placeholder para Avatar */}
            <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-sm font-bold text-white">
              {/* Você pode colocar as iniciais do usuário aqui */}U
            </div>
            <span className="text-sm font-semibold text-textLight dark:text-textDark">
              Meu Perfil
            </span>
          </button>
          {isMenuOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-cardLight dark:bg-cardDark rounded-md shadow-lg py-1 z-50">
              <Link
                to="/my-library"
                onClick={() => setIsMenuOpen(false)}
                className="block px-4 py-2 text-sm text-textLight dark:text-textDark hover:bg-gray-200 dark:hover:bg-gray-700"
              >
                Minha Biblioteca
              </Link>
              <button
                onClick={handleLogout}
                className="w-full text-left block px-4 py-2 text-sm text-red-500 hover:bg-gray-200 dark:hover:bg-gray-700"
              >
                Sair
              </button>
            </div>
          )}
        </div>
      )
    } else {
      return (
        <Link
          to="/auth"
          className="bg-primary text-white font-semibold py-2 px-4 rounded-md hover:bg-primaryHover transition-colors duration-200"
        >
          Entrar
        </Link>
      )
    }
  }

  return (
    <header className="bg-cardLight dark:bg-cardDark shadow-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        {/* Logo */}
        <Link
          to="/"
          className="text-2xl font-bold text-textLight dark:text-textDark tracking-tight"
        >
          MyLibrary
        </Link>

        <div className="flex items-center gap-4">
          {/* Botão de alternar tema */}
          <button
            onClick={toggleTheme}
            className="text-textLight dark:text-textDark p-2 rounded-full transition-colors duration-200 hover:bg-gray-200 dark:hover:bg-gray-700"
          >
            {theme === 'dark' ? '☀️' : '🌙'}
          </button>

          {renderAuthSection()}
        </div>
      </div>
    </header>
  )
}

export default Header
