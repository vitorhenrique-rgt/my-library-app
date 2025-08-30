import { useContext, useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { AuthContext } from '../context/AuthContext'
import { ThemeContext } from '../context/ThemeContext'
import api from '../services/api'

function MyLibraryPage() {
  const [myBooks, setMyBooks] = useState([])
  const [loading, setLoading] = useState(true)
  const { isAuthenticated, token } = useContext(AuthContext)
  const { theme } = useContext(ThemeContext)
  const navigate = useNavigate()

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/auth')
      return
    }

    const fetchMyBooks = async () => {
      try {
        const response = await api.get('http://localhost:3000/api/books')
        setMyBooks(response.data)
        setLoading(false)
      } catch (error) {
        console.error(
          'Erro ao buscar a sua biblioteca:',
          error.response?.data?.error || error.message
        )
        setLoading(false)
      }
    }

    fetchMyBooks()
  }, [isAuthenticated, navigate, token])

  const getStatusText = (status) => {
    switch (status) {
      case 'want-to-read':
        return 'Quero Ler'
      case 'reading':
        return 'Lendo'
      case 'read':
        return 'Lido'
      default:
        return status
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'want-to-read':
        return 'bg-gray-500'
      case 'reading':
        return 'bg-primary'
      case 'read':
        return 'bg-green-600'
      default:
        return 'bg-gray-500'
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen text-lg text-textLight dark:text-textDark">
        <p>Carregando sua biblioteca...</p>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl md:text-5xl font-extrabold text-textLight dark:text-textDark tracking-tight text-center mb-10">
        Minha Biblioteca
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {myBooks.length === 0 ? (
          <p className="text-lg text-gray-500 col-span-full text-center">
            Você ainda não adicionou nenhum livro à sua biblioteca.
          </p>
        ) : (
          myBooks.map((book) => (
            <Link
              key={book._id}
              to={`/book/${book.googleBookId}`}
              className="bg-cardLight dark:bg-cardDark rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 overflow-hidden flex flex-col"
            >
              <div className="p-6 flex flex-col items-center text-center">
                <div className="flex-shrink-0">
                  {book.imageLink && (
                    <img
                      src={book.imageLink}
                      alt={`Capa do livro ${book.title}`}
                      className="w-[120px] h-auto object-cover rounded-md shadow-md"
                    />
                  )}
                </div>
                <div className="mt-4 flex-grow">
                  <h2 className="text-lg font-bold text-textLight dark:text-textDark truncate">
                    {book.title}
                  </h2>
                  <p className="text-sm text-gray-500 mt-1">
                    {getStatusText(book.status)}
                  </p>
                </div>
              </div>
              <div className="mt-auto p-2">
                <span
                  className={`inline-block px-4 py-1 text-sm font-semibold rounded-full text-white ${getStatusColor(
                    book.status
                  )}`}
                >
                  {getStatusText(book.status)}
                </span>
              </div>
            </Link>
          ))
        )}
      </div>
    </div>
  )
}

export default MyLibraryPage
