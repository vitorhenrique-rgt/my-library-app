import axios from 'axios'
import { useContext, useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { AuthContext } from '../context/AuthContext'
import { ThemeContext } from '../context/ThemeContext'

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
        const response = await axios.get('http://localhost:3000/api/books', {
          headers: {
            'x-auth-token': token,
          },
        })
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

  const handleUpdateStatus = async (bookId, newStatus) => {
    try {
      await axios.put(
        `http://localhost:3000/api/books/${bookId}`,
        { status: newStatus },
        {
          headers: {
            'x-auth-token': token,
          },
        }
      )
      // Atualiza a lista localmente para refletir a mudança
      setMyBooks((prevBooks) =>
        prevBooks.map((book) =>
          book._id === bookId ? { ...book, status: newStatus } : book
        )
      )
    } catch (error) {
      console.error(
        'Erro ao atualizar o status:',
        error.response?.data?.error || error.message
      )
    }
  }

  const handleDeleteBook = async (bookId) => {
    if (window.confirm('Tem certeza que deseja remover este livro?')) {
      try {
        await axios.delete(`http://localhost:3000/api/books/${bookId}`, {
          headers: {
            'x-auth-token': token,
          },
        })
        // Remove o livro da lista localmente
        setMyBooks((prevBooks) =>
          prevBooks.filter((book) => book._id !== bookId)
        )
      } catch (error) {
        console.error(
          'Erro ao remover o livro:',
          error.response?.data?.error || error.message
        )
      }
    }
  }

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
            <div
              key={book._id}
              className="bg-cardLight dark:bg-cardDark rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 overflow-hidden flex flex-col"
            >
              <div className="p-6 flex flex-col items-center text-center">
                <Link
                  to={`/book/${book.googleBookId}`}
                  className="flex-shrink-0"
                >
                  {book.imageLink && (
                    <img
                      src={book.imageLink}
                      alt={`Capa do livro ${book.title}`}
                      className="w-[120px] h-auto object-cover rounded-md shadow-md transition-shadow duration-300 hover:shadow-xl"
                    />
                  )}
                </Link>
                <div className="mt-4 flex-grow">
                  <Link
                    to={`/book/${book.googleBookId}`}
                    className="hover:underline"
                  >
                    <h2 className="text-lg font-bold text-textLight dark:text-textDark truncate">
                      {book.title}
                    </h2>
                  </Link>
                  <p className="text-sm text-gray-500 mt-1">
                    <span className="font-semibold">Status:</span>{' '}
                    {getStatusText(book.status)}
                  </p>
                </div>
              </div>
              <div className="mt-auto p-4 flex flex-col gap-2">
                <button
                  onClick={() => handleUpdateStatus(book._id, 'reading')}
                  className="w-full bg-accent text-white font-semibold py-2 rounded-full hover:bg-opacity-80 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 focus:ring-offset-cardLight dark:focus:ring-offset-cardDark"
                >
                  Marcar como Lendo
                </button>
                <button
                  onClick={() => handleUpdateStatus(book._id, 'read')}
                  className="w-full bg-green-600 text-white font-semibold py-2 rounded-full hover:bg-green-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-green-600 focus:ring-offset-2 focus:ring-offset-cardLight dark:focus:ring-offset-cardDark"
                >
                  Marcar como Lido
                </button>
                <button
                  onClick={() => handleDeleteBook(book._id)}
                  className="w-full bg-danger text-white font-semibold py-2 rounded-full hover:bg-red-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-danger focus:ring-offset-2 focus:ring-offset-cardLight dark:focus:ring-offset-cardDark"
                >
                  Remover
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

export default MyLibraryPage
