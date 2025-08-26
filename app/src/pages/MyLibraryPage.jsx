import axios from 'axios';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

function MyLibraryPage() {
  const [myBooks, setMyBooks] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchMyBooks = async () => {
    try {
      const response = await axios.get('http://localhost:3000/api/books');
      setMyBooks(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Erro ao buscar a sua biblioteca:', error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyBooks();
  }, []);

  const handleUpdateStatus = async (bookId, newStatus) => {
    try {
      await axios.put(`http://localhost:3000/api/books/${bookId}`, { status: newStatus });
      // Atualiza a lista localmente para refletir a mudança
      setMyBooks(prevBooks =>
        prevBooks.map(book =>
          book._id === bookId ? { ...book, status: newStatus } : book
        )
      );
    } catch (error) {
      console.error('Erro ao atualizar o status:', error);
    }
  };

  const handleDeleteBook = async (bookId) => {
    if (window.confirm('Tem certeza que deseja remover este livro?')) {
      try {
        await axios.delete(`http://localhost:3000/api/books/${bookId}`);
        // Remove o livro da lista localmente
        setMyBooks(prevBooks => prevBooks.filter(book => book._id !== bookId));
      } catch (error) {
      console.error('Erro ao remover o livro:', error);
      }
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'want-to-read':
        return 'Quero Ler';
      case 'reading':
        return 'Lendo';
      case 'read':
        return 'Lido';
      default:
        return status;
    }
  };

  if (loading) {
    return <div className="text-center mt-10 text-white">Carregando sua biblioteca...</div>;
  }

  return (
    <div className="bg-gray-900 text-gray-200 min-h-screen p-8 font-sans">
      <header className="flex justify-between items-center mb-12">
        <h1 className="text-4xl md:text-5xl font-extrabold text-white tracking-tight">Minha Biblioteca</h1>
        <Link to="/" className="bg-blue-600 text-white font-semibold py-2 px-4 rounded-md hover:bg-blue-700 transition-colors">
          Voltar para a Busca
        </Link>
      </header>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {myBooks.length === 0 ? (
          <p className="text-lg text-gray-400 col-span-full text-center">
            Você ainda não adicionou nenhum livro à sua biblioteca.
          </p>
        ) : (
          myBooks.map((book) => (
            <div key={book._id} className="bg-gray-800 rounded-lg shadow-xl overflow-hidden flex flex-col transition-transform transform hover:scale-105">
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
                  <Link to={`/book/${book.googleBookId}`} className="hover:underline">
  <h2 className="text-lg font-bold text-blue-400">{book.title}</h2>
</Link>
                  <p className="text-sm text-gray-400 mt-2">
                    <span className="font-semibold">Status:</span> {getStatusText(book.status)}
                  </p>
                </div>
              </div>
              <div className="p-4 bg-gray-700 flex flex-col gap-2">
                <button
                  onClick={() => handleUpdateStatus(book._id, 'reading')}
                  className="w-full bg-yellow-600 text-white font-semibold py-2 rounded-md hover:bg-yellow-700 transition-colors"
                >
                  Marcar como Lendo
                </button>
                <button
                  onClick={() => handleUpdateStatus(book._id, 'read')}
                  className="w-full bg-green-600 text-white font-semibold py-2 rounded-md hover:bg-green-700 transition-colors"
                >
                  Marcar como Lido
                </button>
                <button
                  onClick={() => handleDeleteBook(book._id)}
                  className="w-full bg-red-600 text-white font-semibold py-2 rounded-md hover:bg-red-700 transition-colors"
                >
                  Remover
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default MyLibraryPage;
