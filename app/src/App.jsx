import { useState } from 'react'
import axios from 'axios'
import './App.css'

function App() {
  // Estado para armazenar o termo de busca do usuário
  const [searchTerm, setSearchTerm] = useState('')
  // Estado para armazenar a lista de livros retornada
  const [books, setBooks] = useState([])
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
            <h2>{book.title}</h2>
            <p>
              <strong>Autor(es):</strong> {book.authors?.join(', ')}
            </p>
            <p>{book.description}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

export default App
