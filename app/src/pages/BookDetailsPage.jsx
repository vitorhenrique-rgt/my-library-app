import axios from 'axios'
import { useContext, useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { AuthContext } from '../context/AuthContext'

function BookDetailsPage() {
  const { googleBookId } = useParams()
  const [book, setBook] = useState(null)
  const [userBook, setUserBook] = useState(null)
  const [loading, setLoading] = useState(true)

  const { isAuthenticated, token } = useContext(AuthContext)
  const navigate = useNavigate()

  const GOOGLE_BOOKS_API_KEY = import.meta.env.VITE_GOOGLE_BOOKS_API_KEY

  useEffect(() => {
    const fetchBookDetails = async () => {
      try {
        const googleResponse = await axios.get(
          `https://www.googleapis.com/books/v1/volumes/${googleBookId}?key=${GOOGLE_BOOKS_API_KEY}`
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

        if (isAuthenticated) {
          const myLibraryResponse = await axios.get(
            `http://localhost:3000/api/books/search?googleBookId=${googleBookId}`,
            {
              headers: { 'x-auth-token': token },
            }
          )
          if (myLibraryResponse.data.length > 0) {
            setUserBook(myLibraryResponse.data[0])
          }
        }
      } catch (error) {
        console.error('Erro ao buscar detalhes do livro:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchBookDetails()
  }, [googleBookId, isAuthenticated, token])

  const handleUpdateStatus = async (newStatus) => {
    try {
      if (!userBook) {
        const response = await axios.post(
          'http://localhost:3000/api/books',
          {
            googleBookId: book.googleBookId,
            status: newStatus,
          },
          {
            headers: { 'x-auth-token': token },
          }
        )
        setUserBook(response.data)
      } else {
        await axios.put(
          `http://localhost:3000/api/books/${userBook._id}`,
          { status: newStatus },
          {
            headers: { 'x-auth-token': token },
          }
        )
        setUserBook((prevUserBook) => ({ ...prevUserBook, status: newStatus }))
      }
    } catch (error) {
      console.error('Erro ao atualizar o status:', error)
    }
  }

  const handleDeleteBook = async () => {
    if (!userBook) return
    if (
      window.confirm(
        'Tem certeza que deseja remover este livro da sua biblioteca?'
      )
    ) {
      try {
        await axios.delete(`http://localhost:3000/api/books/${userBook._id}`, {
          headers: { 'x-auth-token': token },
        })
        setUserBook(null)
        alert('Livro removido com sucesso!')
      } catch (error) {
        console.error('Erro ao remover o livro:', error)
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

          {isAuthenticated && (
            <div className="mt-8 flex flex-col sm:flex-row gap-3">
              <button
                onClick={() => handleUpdateStatus('reading')}
                className={`flex-grow font-semibold py-3 rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 ${userBook?.status === 'reading' ? 'bg-primary text-white focus:ring-primary focus:ring-offset-cardLight dark:focus:ring-offset-cardDark' : 'bg-transparent text-primary border-2 border-primary hover:bg-primary hover:text-white focus:ring-primary focus:ring-offset-cardLight dark:focus:ring-offset-cardDark'}`}
              >
                Marcar como Lendo
              </button>
              <button
                onClick={() => handleUpdateStatus('read')}
                className={`flex-grow font-semibold py-3 rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 ${userBook?.status === 'read' ? 'bg-green-600 text-white focus:ring-green-600 focus:ring-offset-cardLight dark:focus:ring-offset-cardDark' : 'bg-transparent text-green-600 border-2 border-green-600 hover:bg-green-600 hover:text-white focus:ring-green-600 focus:ring-offset-cardLight dark:focus:ring-offset-cardDark'}`}
              >
                Marcar como Lido
              </button>
              {userBook && (
                <button
                  onClick={handleDeleteBook}
                  className="flex-grow bg-transparent text-danger border-2 border-danger font-semibold py-3 rounded-full hover:bg-danger hover:text-white transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-danger focus:ring-offset-2 focus:ring-offset-cardLight dark:focus:ring-offset-cardDark"
                >
                  Remover
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
