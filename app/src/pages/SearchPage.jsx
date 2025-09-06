import { useContext, useState } from 'react'
import { Link } from 'react-router-dom'
import { AuthContext } from '../context/AuthContext'
import api from '../services/api'

function SearchPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [books, setBooks] = useState([])
  const [loading, setLoading] = useState(false)
  const { isAuthenticated, token } = useContext(AuthContext)

  const GOOGLE_BOOKS_API_KEY = import.meta.env.VITE_GOOGLE_BOOKS_API_KEY

  // A função truncateText é útil se line-clamp não estiver funcionando,
  // mas o ideal é usar o plugin do Tailwind. Vamos mantê-la como fallback.
  const truncateText = (text, maxLength) => {
    if (!text) return 'Descrição não disponível.'
    if (text.length <= maxLength) return text
    return text.substr(0, maxLength) + '...'
  }

  const handleSearch = async (e) => {
    e.preventDefault()
    if (!searchTerm) return

    setLoading(true)
    try {
       console.log('Enviando requisição para:', `/google-books/search?q=${searchTerm}`); // ---TESTE---
      // Aponte para a nova rota de proxy de busca
      const response = await api.get(`/google-books/search?q=${searchTerm}`)
      const fetchedBooks = response.data.items.map((item) => ({
        googleBookId: item.id,
        title: item.volumeInfo.title,
        authors: item.volumeInfo.authors,
        imageLink: item.volumeInfo.imageLinks?.thumbnail || '',
        description: item.volumeInfo.description,
      }))
      setBooks(fetchedBooks)
    } catch (error) {
      console.error('Erro ao buscar livros:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleAddBook = async (book, event) => {
    event.stopPropagation()
    if (!isAuthenticated) {
      alert('Por favor, faça login para adicionar livros à sua biblioteca.')
      return
    }

    try {
      const response = await api.post('http://localhost:3000/api/books', {
        googleBookId: book.googleBookId,
        status: 'want-to-read',
      })
      console.log('Livro adicionado com sucesso:', response.data)
      alert('Livro adicionado à sua biblioteca!')
    } catch (error) {
      console.error(
        'Erro ao adicionar livro:',
        error.response?.data?.error || error.message
      )
      alert('Erro ao adicionar livro. Ele já pode estar na sua biblioteca.')
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <header className="text-center mb-10">
        <h1 className="text-4xl md:text-5xl font-extrabold text-textLight dark:text-textDark tracking-tight mb-4">
          My Library App
        </h1>
        <form
          onSubmit={handleSearch}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar livros..."
            className="w-full sm:w-80 px-4 py-2 rounded-full bg-cardLight dark:bg-cardDark text-textLight dark:text-textDark border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-colors"
          />
          <button
            type="submit"
            className="w-full sm:w-auto bg-primary text-white font-semibold py-2 px-6 rounded-full hover:bg-primaryHover transition-colors duration-200"
          >
            Buscar
          </button>
        </form>
      </header>

      {loading ? (
        <div className="text-center mt-10 text-lg text-textLight dark:text-textDark">
          <p>Buscando livros...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {books.map((book) => (
            <div
              key={book.googleBookId}
              className="bg-cardLight dark:bg-cardDark rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 overflow-hidden flex flex-col"
            >
              <Link
                to={`/book/${book.googleBookId}`}
                className="p-6 flex flex-col items-center text-center flex-grow"
              >
                <div className="flex-shrink-0">
                  {book.imageLink && (
                    <img
                      src={book.imageLink}
                      alt={`Capa do livro ${book.title}`}
                      className="w-[120px] h-auto object-cover rounded-md shadow-md"
                    />
                  )}
                </div>
                {/* Contêiner de texto que cresce para empurrar o botão para baixo */}
                <div className="mt-4 flex flex-col flex-grow text-center">
                  {/* Título com truncamento forçado */}
                  <h2 className="text-lg font-bold text-textLight dark:text-textDark line-clamp-2">
                    {book.title}
                  </h2>
                  {/* Autor com truncamento */}
                  <p className="text-sm text-gray-500 mt-1 truncate">
                    {book.authors?.join(', ') || 'Autor desconhecido'}
                  </p>
                  {/* Descrição com limite de 3 linhas */}
                  <p className="text-xs text-gray-400 mt-2 line-clamp-3">
                    {book.description || 'Descrição não disponível.'}
                  </p>
                </div>
              </Link>
              {isAuthenticated && (
                <div className="p-4 flex justify-center mt-auto">
                  <button
                    onClick={(e) => handleAddBook(book, e)}
                    className="w-full sm:w-auto font-semibold py-2 px-6 rounded-full text-primary border-2 border-primary hover:bg-primary hover:text-white transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-cardLight dark:focus:ring-offset-cardDark"
                  >
                    Adicionar à Biblioteca
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default SearchPage
