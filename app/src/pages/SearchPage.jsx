// src/pages/SearchPage.jsx

import axios from 'axios';
import { useState } from 'react';

function SearchPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [books, setBooks] = useState([]);

  const truncateText = (text, maxLength) => {
    if (!text) return '';
    if (text.length <= maxLength) {
      return text;
    }
    return `${text.substring(0, maxLength)}...`;
  };

  const handleSearch = async () => {
    try {
      const response = await axios.get(`http://localhost:3000/api/books/search?q=${searchTerm}`);
      setBooks(response.data);
    } catch (error) {
      console.error('Erro ao buscar livros:', error);
    }
  };

  const handleAddBook = async (book) => {
    try {
      const response = await axios.post('http://localhost:3000/api/books', {
        googleBookId: book.googleBookId,
        status: 'want-to-read',
      });
      console.log('Livro adicionado com sucesso:', response.data);
      alert('Livro adicionado à sua biblioteca!');
    } catch (error) {
      console.error('Erro ao adicionar livro:', error.response.data);
      alert('Erro ao adicionar livro. Ele já pode estar na sua biblioteca.');
    }
  };

  return (
    <div className="bg-gray-900 text-gray-200 min-h-screen p-8 font-sans">
      <h1 className="text-4xl md:text-5xl font-extrabold text-white text-center tracking-tight mb-8">My Library App</h1>

      <div className="flex justify-center items-center gap-4 mb-12">
        <input
          type="text"
          placeholder="Buscar livros..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full max-w-lg p-3 border border-gray-700 bg-gray-800 text-gray-100 placeholder-gray-400 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
        />
        <button
          onClick={handleSearch}
          className="bg-blue-600 text-white font-semibold py-3 px-6 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
        >
          Buscar
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {books.map((book) => (
          <div key={book.googleBookId} className="bg-gray-800 rounded-lg shadow-xl overflow-hidden flex flex-col transition-transform transform hover:scale-105">
            <div className="p-6 flex flex-col h-full">
              <div className="flex-shrink-0 flex justify-center items-start">
                {book.imageLink && (
                  <img
                    src={book.imageLink}
                    alt={`Capa do livro ${book.title}`}
                    className="max-w-[120px] h-[180px] object-cover rounded-md shadow-lg"
                  />
                )}
              </div>
              <div className="mt-6 flex flex-col flex-grow text-center">
                <h2 className="text-lg font-bold text-blue-400">{book.title}</h2>
                <p className="text-sm text-gray-400 mt-2">
                  <span className="font-semibold">Autor(es):</span> {book.authors?.join(', ')}
                </p>
                <p className="text-sm text-gray-500 mt-2 flex-grow">
                  {truncateText(book.description, 150)}
                </p>
              </div>
            </div>
            <div className="p-4 bg-gray-700">
              <button
                onClick={() => handleAddBook(book)}
                className="w-full bg-blue-600 text-white font-semibold py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
              >
                Adicionar à Minha Biblioteca
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default SearchPage;
