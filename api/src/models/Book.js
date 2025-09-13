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
    notes: [
      {
        text: { type: String, required: true },
        createdAt: { type: Date, default: Date.now }
      }
    ]
  },
  { timestamps: true }
)

module.exports = mongoose.model('Book', bookSchema)
