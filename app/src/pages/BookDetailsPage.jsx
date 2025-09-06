// src/pages/BookDetailsPa
import { useContext, useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { AuthContext } from '../context/AuthContext'
import api from '../services/api'

function BookDetailsPage() {
  const { id } = useParams() // Captura o googleBookId da URL
  const [book, setBook] = useState(null)
  const [userBook, setUserBook] = useState(null)
  const [loading, setLoading] = useState(true)

  const { isAuthenticated } = useContext(AuthContext)
  const navigate = useNavigate()

  useEffect(() => {
    const fetchBookDetails = async () => {
      if (!id) {
        setLoading(false)
        return
      }

      try {
        setLoading(true)

        // AQUI ESTÁ A CORREÇÃO: Busca o livro na sua biblioteca usando a rota existente
        const myLibraryResponse = await api.get(`/books/${id}`)
        const userBookData = myLibraryResponse.data
        setUserBook(userBookData)

        // Com o googleBookId, busca os detalhes visuais na API do Google
        const googleResponse = await api.get(
          `/google-books/details/${userBookData.googleBookId}`
        )
        const googleBookData = googleResponse.data

        const fetchedBook = {
          googleBookId: googleBookData.id,
          title: googleBookData.volumeInfo.title,
          authors: googleBookData.volumeInfo.authors,
          description: googleBookData.volumeInfo.description,
          imageLink: googleBookData.volumeInfo.imageLinks?.thumbnail || '',
        }
        setBook(fetchedBook)
      } catch (error) {
        console.error(
          'Erro ao buscar detalhes do livro ou da biblioteca:',
          error
        )
        // Trata o erro caso o livro não seja encontrado na biblioteca
        setUserBook(null)
      } finally {
        setLoading(false)
      }
    }

    fetchBookDetails()
  }, [id, isAuthenticated, navigate])

  // Funções para adicionar, atualizar e deletar livros
  const handleAddBook = async (bookData) => {
    try {
      const newBook = {
        googleBookId: bookData.googleBookId,
        status: 'reading',
      }
      const response = await api.post('/books', newBook)
      setUserBook(response.data)
      alert('Livro adicionado à sua biblioteca!')
    } catch (error) {
      console.error('Erro ao adicionar livro:', error)
      alert('Erro ao adicionar o livro à sua biblioteca.')
    }
  }

  const handleUpdateStatus = async (newStatus) => {
    if (!userBook || !userBook._id) {
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
    if (!userBook || !userBook._id) {
      alert('Este livro não está na sua biblioteca.')
      return
    }
    try {
      await api.delete(`/books/${userBook._id}`)
      setUserBook(null)
      alert('Livro removido da sua biblioteca.')
      navigate('/my-library')
    } catch (error) {
      console.error('Erro ao remover livro:', error)
      alert('Erro ao remover o livro da sua biblioteca.')
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        Carregando...
      </div>
    )
  }

  if (!book) {
    return (
      <div className="text-center text-textLight dark:text-textDark mt-20">
        Livro não encontrado.
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-cardLight dark:bg-cardDark rounded-xl p-6 md:p-10 shadow-lg">
        <div className="flex flex-col md:flex-row gap-8 items-center">
          {book.imageLink && (
            <img
              src={book.imageLink}
              alt={`Capa do livro ${book.title}`}
              className="w-48 h-auto rounded-lg shadow-lg"
            />
          )}
          <div className="md:flex-1 text-center md:text-left">
            <h1 className="text-3xl md:text-4xl font-bold mb-2 text-textLight dark:text-textDark">
              {book.title}
            </h1>
            <h2 className="text-xl md:text-2xl font-semibold text-gray-500 mb-4">
              {book.authors?.join(', ')}
            </h2>
            <p className="text-textLight dark:text-textDark whitespace-pre-wrap">
              {book.description || 'Descrição não disponível.'}
            </p>
          </div>
        </div>
        {isAuthenticated && (
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
  )
}

export default BookDetailsPage
