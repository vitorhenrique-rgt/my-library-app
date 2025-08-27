// src/models/Book.js
const mongoose = require('mongoose')

const bookSchema = new mongoose.Schema(
  {
    googleBookId: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ['want-to-read', 'reading', 'read'],
      default: 'want-to-read',
    },
    user: {
      // Adiciona a referência ao usuário
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  { timestamps: true }
)

module.exports = mongoose.model('Book', bookSchema)
