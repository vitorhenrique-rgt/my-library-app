import axios from 'axios'
import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'

function BookDetailsPage() {
  const { googleBookId } = useParams() // Pega o ID da URL
  const [book, setBook] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchBookDetails = async () => {
      try {
        const API_KEY = import.meta.env.VITE_GOOGLE_BOOKS_API_KEY // Usaremos a chave de API diretamente aqui
        const response = await axios.get(
          `https://www.googleapis.com/books/v1/volumes/${googleBookId}?key=${API_KEY}`
        )
        setBook(response.data.volumeInfo)
        setLoading(false)
      } catch (error) {
        console.error('Erro ao buscar detalhes do livro:', error)
        setLoading(false)
      }
    }

    fetchBookDetails()
  }, [googleBookId]) // Garante que a requisição seja feita sempre que o ID mudar

  if (loading) {
    return (
      <div className="text-center mt-10 text-white">
        Carregando detalhes do livro...
      </div>
    )
  }

  if (!book) {
    return (
      <div className="text-center mt-10 text-white">Livro não encontrado.</div>
    )
  }

  return (
    <div className="bg-gray-900 text-gray-200 min-h-screen p-8 font-sans">
      <header className="flex justify-between items-center mb-12">
        <h1 className="text-4xl md:text-5xl font-extrabold text-white tracking-tight">
          Detalhes do Livro
        </h1>
        <Link
          to="/"
          className="bg-blue-600 text-white font-semibold py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
        >
          Voltar para a Busca
        </Link>
      </header>

      <div className="flex flex-col md:flex-row items-center md:items-start gap-12 bg-gray-800 p-8 rounded-lg shadow-xl">
        <div className="flex-shrink-0">
          {book.imageLinks?.thumbnail && (
            <img
              src={book.imageLinks.thumbnail}
              alt={`Capa do livro ${book.title}`}
              className="w-[200px] h-auto object-cover rounded-md shadow-lg"
            />
          )}
        </div>
        <div className="flex-grow text-left">
          <h2 className="text-3xl font-bold text-white mb-2">{book.title}</h2>
          <p className="text-lg text-gray-400 mb-4">
            Por: {book.authors?.join(', ') || 'Autor desconhecido'}
          </p>
          <div className="text-sm text-gray-500 mb-6">
            <p>
              <span className="font-semibold">Publicado em:</span>{' '}
              {book.publishedDate}
            </p>
            <p>
              <span className="font-semibold">Editora:</span> {book.publisher}
            </p>
            <p>
              <span className="font-semibold">Páginas:</span> {book.pageCount}
            </p>
          </div>
          <h3 className="text-xl font-semibold text-white mb-2">Descrição:</h3>
          <p
            className="text-gray-400 leading-relaxed"
            dangerouslySetInnerHTML={{ __html: book.description }}
          ></p>
        </div>
      </div>
    </div>
  )
}

export default BookDetailsPage
