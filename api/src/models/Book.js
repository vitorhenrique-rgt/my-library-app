const mongoose = require('mongoose')
const bookSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  author: {
    type: String,
    required: true,
  },
  publisher: {
    type: String,
  },
  description: {
    type: String,
  },
})

const Book = mongoose.model('Book', bookSchema)

module.exports = Book
