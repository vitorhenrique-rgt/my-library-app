import { useContext, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { AuthContext } from '../context/AuthContext'
import api from '../services/api'

function MyLibraryPage() {
  const [books, setBooks] = useState([])
  const [loading, setLoading] = useState(true)
  const { isAuthenticated } = useContext(AuthContext)

  useEffect(() => {
    const fetchMyBooks = async () => {
      if (!isAuthenticated) return

      try {
        const response = await api.get('/books')
        const myBooks = response.data

        // Mapeia os livros da sua biblioteca para buscar os detalhes da API do Google
        const booksWithDetails = await Promise.all(
          myBooks.map(async (book) => {
            try {
              // Busca os detalhes do livro na API do Google usando o proxy
              const googleResponse = await api.get(
                `/google-books/details/${book.googleBookId}`
              )
              const googleBook = googleResponse.data

              return {
                ...book,
                title: googleBook.volumeInfo.title,
                authors: googleBook.volumeInfo.authors,
                imageLink: googleBook.volumeInfo.imageLinks?.thumbnail || '',
              }
            } catch (googleError) {
              console.error(
                `Erro ao buscar detalhes do livro ${book.googleBookId}:`,
                googleError
              )
              return {
                ...book,
                title: 'Título não disponível',
                authors: ['Autor(es) não disponível'],
                imageLink: '',
              }
            }
          })
        )

        setBooks(booksWithDetails)
      } catch (error) {
        console.error('Erro ao buscar livros da sua biblioteca:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchMyBooks()
  }, [isAuthenticated])

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-xl text-textLight dark:text-textDark">
          Carregando...
        </p>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-3xl font-bold text-center mb-8 text-textLight dark:text-textDark">
        Minha Biblioteca
      </h2>
      {books.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {books.map((book) => (
            <Link
              key={book._id}
              to={`/book/${book._id}`}
              className="group relative block"
            >
              <div className="bg-cardLight dark:bg-cardDark rounded-xl p-4 shadow-lg transition-transform transform hover:scale-105 duration-200 cursor-pointer">
                {book.imageLink && (
                  <img
                    src={book.imageLink}
                    alt={`Capa do livro ${book.title}`}
                    className="w-full h-auto object-cover rounded-md mb-4"
                  />
                )}
                <h3 className="text-lg font-bold truncate text-textLight dark:text-textDark">
                  {book.title}
                </h3>
                <p className="text-gray-500 text-sm truncate">
                  {book.authors?.join(', ')}
                </p>
                <p
                  className="mt-2 font-semibold"
                  style={{
                    color: book.status === 'read' ? '#10B981' : '#F59E0B',
                  }}
                >
                  Status: {book.status === 'read' ? 'Lido' : 'Lendo'}
                </p>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="text-center mt-20">
          <p className="text-xl text-textLight dark:text-textDark">
            Você ainda não adicionou nenhum livro à sua biblioteca.
          </p>
        </div>
      )}
    </div>
  )
}

export default MyLibraryPage
