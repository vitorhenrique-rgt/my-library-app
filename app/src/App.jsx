import axios from 'axios'
import { useState } from 'react'
import './App.css'

function App() {
  // Estado para armazenar o termo de busca do usuário
  const [searchTerm, setSearchTerm] = useState('')
  // Estado para armazenar a lista de livros retornada
  const [books, setBooks] = useState([])

  // Limita a descrição para um número de caracteres
  const truncateText = (text, maxLength) => {
    if (!text) return ''
    if (text.length <= maxLength) {
      return text
    }
    return `${text.substring(0, maxLength)}...`
  }

  const handleAddBook = async (book) => {
    try {
      // A função handleAddBook receberá o objeto `book` completo
      // e fará a requisição POST para o seu backend.
      const response = await axios.post('http://localhost:3000/api/books', {
        googleBookId: book.googleBookId,
        status: 'want-to-read', // Define o status inicial como 'quero ler'
      })
      console.log('Livro adicionado com sucesso:', response.data)
      alert('Livro adicionado à sua biblioteca!')
    } catch (error) {
      console.error('Erro ao adicionar livro:', error.response.data)
      alert('Erro ao adicionar livro. Ele já pode estar na sua biblioteca.')
    }
  }

  const handleSearch = async () => {
    try {
      const response = await axios.get(
        `http://localhost:3000/api/books/search?q=${searchTerm}`
      )
      setBooks(response.data)
    } catch (error) {
      console.error('Erro ao buscar livros:', error)
    }
  }

  return (
    <div className="App">
      <h1>My Library App</h1>
      <div className="search-container">
        <input
          type="text"
          placeholder="Buscar livros..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button onClick={handleSearch}>Buscar</button>
      </div>
      <div className="books-list">
        {books.map((book) => (
          <div key={book.googleBookId} className="book-card">
            <div className="book-info">
              {book.imageLink && (
                <img src={book.imageLink} alt={`Capa do livro ${book.title}`} />
              )}
              <div className="book-details">
                <h2>{book.title}</h2>
                <p>
                  <strong>Autor(es):</strong> {book.authors?.join(', ')}
                </p>
                <p>{truncateText(book.description, 150)}</p>
              </div>
            </div>
            <button onClick={() => handleAddBook(book)}>
              Adicionar à Minha Biblioteca
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}

export default App
