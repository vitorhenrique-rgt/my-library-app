const mongoose = require('mongoose');
const bookSchema = new mongoose.Schema({
  googleBookId: {
    type: String,
    required: true,
    unique: true, // Garante que não haja livros duplicados por ID do Google
  },
  status: {
    type: String,
    enum: ['read', 'reading', 'want-to-read'], // Restringe o valor do campo a estas opções
    required: true,
  },
  // Futuramente, adicionaremos o ID do usuário aqui
  // user: {
  //   type: mongoose.Schema.Types.ObjectId,
  //   ref: 'User',
  //   required: true,
  // },
}, { timestamps: true }); // Adiciona campos `createdAt` e `updatedAt` automaticamente

const Book = mongoose.model('Book', bookSchema);

module.exports = Book;
