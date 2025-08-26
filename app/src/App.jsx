import { Routes, Route } from 'react-router-dom';
import SearchPage from './pages/SearchPage';
import MyLibraryPage from './pages/MyLibraryPage';
import BookDetailsPage from './pages/BookDetailsPage'; // Importa a nova página

function App() {
  return (
    <Routes>
      <Route path="/" element={<SearchPage />} />
      <Route path="/my-library" element={<MyLibraryPage />} />
      <Route path="/book/:googleBookId" element={<BookDetailsPage />} /> // Nova rota para a página de detalhes
    </Routes>
  );
}

export default App;
