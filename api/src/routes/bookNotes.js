const express = require('express')
const Book = require('../models/Book')
const authMiddleware = require('../middleware/authMiddleware')

const router = express.Router()

// add note to book
router.post('/:bookId/notes', authMiddleware, async (req, res) => {
  try {
    const { text } = req.body
    const book = await Book.findOne({ _id: req.params.bookId, user: req.user.id })
    if (!book) return res.status(404).json({ error: 'Livro não encontrado' })

    book.notes.push({ text })
    await book.save()
    res.status(201).json(book.notes)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// list note of the books
router.get('/:bookId/notes', authMiddleware, async (req, res) => {
  try {
    const book = await Book.findOne({ _id: req.params.bookId, user: req.user.id })
    if (!book) return res.status(404).json({ error: 'Livro não encontrado' })

    res.status(200).json(book.notes)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// delete note of the book
router.delete('/:bookId/notes/:noteId', authMiddleware, async (req, res) => {
  try {
    const book = await Book.findOne({ _id: req.params.bookId, user: req.user.id })
    if (!book) return res.status(404).json({ error: 'Livro não encontrado' })

    book.notes.id(req.params.noteId).remove()
    await book.save()
    res.status(200).json(book.notes)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

module.exports = router
