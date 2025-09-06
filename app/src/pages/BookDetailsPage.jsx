import { useContext, useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { AuthContext } from '../context/AuthContext'
import api from '../services/api'

function BookDetailsPage() {
  const { googleBookId } = useParams()
  const [book, setBook] = useState(null)
  const [userBook, setUserBook] = useState(null)
  const [loading, setLoading] = useState(true)

  const { isAuthenticated, token } = useContext(AuthContext)
  const navigate = useNavigate()

  useEffect(() => {
    const fetchBookDetails = async () => {
      try {
        setLoading(true)

        // 1. Busca os detalhes do livro na API do Google (via proxy)
        const googleResponse = await api.get(
          `/google-books/details/${googleBookId}`
        )
        const bookData = googleResponse.data
        const fetchedBook = {
          googleBookId: bookData.id,
          title: bookData.volumeInfo.title,
          authors: bookData.volumeInfo.authors,
          description: bookData.volumeInfo.description,
          imageLink: bookData.volumeInfo.imageLinks?.thumbnail || '',
        }
        setBook(fetchedBook)

        // 2. Se o usuário está autenticado, busca o livro na sua biblioteca
        if (isAuthenticated) {
          const myLibraryResponse = await api.get(
            `/books?googleBookId=${googleBookId}`
          )

          if (myLibraryResponse.data.length > 0) {
            // Encontrou o livro na sua biblioteca
            setUserBook(myLibraryResponse.data[0])
          } else {
            // Não encontrou, o livro não está na biblioteca
            setUserBook(null)
          }
        }
      } catch (error) {
        console.error(
          'Erro ao buscar detalhes do livro ou da biblioteca:',
          error
        )
      } finally {
        setLoading(false)
      }
    }

    fetchBookDetails()
  }, [googleBookId, isAuthenticated, token])

  const handleUpdateStatus = async (newStatus) => {
    // Verifica se o livro já foi adicionado antes de tentar atualizar
    if (!userBook) {
      alert('Este livro ainda não foi adicionado à sua biblioteca.')
      return
    }
    try {
      await api.put(`/books/${userBook._id}`, { status: newStatus })
      setUserBook((prev) => ({ ...prev, status: newStatus }))
      alert('Status do livro atualizado com sucesso!')
    } catch (error) {
      console.error('Erro ao atualizar status:', error)
      alert('Erro ao atualizar o status do livro.')
    }
  }

  const handleDeleteBook = async () => {
    // Verifica se o livro existe para ser removido
    if (!userBook) {
      alert('Este livro não está na sua biblioteca.')
      return
    }
    try {
      await api.delete(`/books/${userBook._id}`)
      setUserBook(null) // Define o estado do livro do usuário para null
      alert('Livro removido da sua biblioteca.')
    } catch (error) {
      console.error('Erro ao remover livro:', error)
      alert('Erro ao remover o livro da sua biblioteca.')
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
        return ''
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen text-lg text-textLight dark:text-textDark">
        <p>Carregando detalhes do livro...</p>
      </div>
    )
  }

  if (!book) {
    return (
      <div className="flex items-center justify-center min-h-screen text-lg text-red-500">
        <p>Livro não encontrado.</p>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-cardLight dark:bg-cardDark rounded-xl shadow-lg p-8 flex flex-col md:flex-row items-start gap-8">
        <div className="flex-shrink-0 flex justify-center w-full md:w-auto">
          {book.imageLink && (
            <img
              src={book.imageLink}
              alt={`Capa do livro ${book.title}`}
              className="w-48 h-auto object-cover rounded-md border-2 border-gray-200 dark:border-gray-700 shadow-xl"
            />
          )}
        </div>
        <div className="flex flex-col flex-grow">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">{book.title}</h1>
          <p className="text-lg text-gray-500 font-semibold mb-4">
            {book.authors?.join(', ') || 'Autor desconhecido'}
          </p>
          {isAuthenticated && (
            <div className="mb-6">
              {userBook ? (
                <span className="text-lg text-primary font-bold">
                  Status: {getStatusText(userBook.status)}
                </span>
              ) : (
                <span className="text-lg text-gray-500 dark:text-gray-400 font-bold">
                  Este livro ainda não está na sua biblioteca.
                </span>
              )}
            </div>
          )}
          <div className="prose dark:prose-invert max-w-none text-textLight dark:text-textDark">
            <h3 className="text-xl font-bold mb-2">Descrição</h3>
            <div
              dangerouslySetInnerHTML={{
                __html: book.description || 'Descrição não disponível.',
              }}
            />
          </div>

          {isAuthenticated && book && (
            <div className="mt-8 flex flex-col sm:flex-row gap-3">
              {userBook ? (
                <>
                  <button
                    onClick={() => handleUpdateStatus('reading')}
                    className={`flex-grow font-semibold py-3 rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 ${userBook.status === 'reading' ? 'bg-primary text-white focus:ring-primary focus:ring-offset-cardLight dark:focus:ring-offset-cardDark' : 'bg-transparent text-primary border-2 border-primary hover:bg-primary hover:text-white focus:ring-primary focus:ring-offset-cardLight dark:focus:ring-offset-cardDark'}`}
                  >
                    Marcar como Lendo
                  </button>
                  <button
                    onClick={() => handleUpdateStatus('read')}
                    className={`flex-grow font-semibold py-3 rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 ${userBook.status === 'read' ? 'bg-green-600 text-white focus:ring-green-600 focus:ring-offset-cardLight dark:focus:ring-offset-cardDark' : 'bg-transparent text-green-600 border-2 border-green-600 hover:bg-green-600 hover:text-white focus:ring-green-600 focus:ring-offset-cardLight dark:focus:ring-offset-cardDark'}`}
                  >
                    Marcar como Lido
                  </button>
                  <button
                    onClick={handleDeleteBook}
                    className="flex-grow bg-transparent text-danger border-2 border-danger font-semibold py-3 rounded-full hover:bg-danger hover:text-white transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-danger focus:ring-offset-2 focus:ring-offset-cardLight dark:focus:ring-offset-cardDark"
                  >
                    Remover
                  </button>
                </>
              ) : (
                <button
                  onClick={() => handleAddBook(book)}
                  className="w-full sm:w-auto font-semibold py-2 px-6 rounded-full text-primary border-2 border-primary hover:bg-primary hover:text-white transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-cardLight dark:focus:ring-offset-cardDark"
                >
                  Adicionar à Biblioteca
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default BookDetailsPage
