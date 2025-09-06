import { useContext, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { AuthContext } from '../context/AuthContext'
import api from '../services/api'

function MyLibraryPage() {
  const [books, setBooks] = useState([])
  const [loading, setLoading] = useState(true)
  const { isAuthenticated, token } = useContext(AuthContext)

  useEffect(() => {
    const fetchBooks = async () => {
      if (!isAuthenticated) return
      try {
        const response = await api.get('/books')
        // A resposta agora é apenas os livros da biblioteca do usuário
        console.log('Resposta da API para /books:', response.data);
        const userBooks = response.data
        setBooks(userBooks)
      } catch (error) {
        console.error('Erro ao buscar livros:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchBooks()
  }, [isAuthenticated, token])

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
        {books.length > 0 ? (
          books.map((book) => (
            <Link
              key={book._id}
              to={`/book/${book.googleBookId}`}
              className="group relative"
            >
              <div className="bg-cardLight dark:bg-cardDark rounded-xl p-4 shadow-lg transition-transform transform hover:scale-105 duration-200 cursor-pointer">
                {book.imageLink && (
                  <img
                    src={book.imageLink}
                    alt={`Capa do livro ${book.title}`}
                    className="w-full h-auto object-cover rounded-md mb-4"
                  />
                )}
                <h3 className="text-lg font-bold truncate">{book.title}</h3>
                <p className="text-gray-500 text-sm truncate">
                  {book.authors?.join(', ')}
                </p>
                <p className="text-primary mt-2 font-semibold">
                  Status: {book.status}
                </p>
              </div>
            </Link>
          ))
        ) : (
          <p className="col-span-full text-center text-textLight dark:text-textDark">
            Você ainda não adicionou nenhum livro à sua biblioteca.
          </p>
        )}
      </div>
    </div>
  )
}

export default MyLibraryPage
