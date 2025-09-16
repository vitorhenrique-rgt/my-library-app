const express = require('express')
const axios = require('axios')
const Book = require('../models/Book')
const authMiddleware = require('../middleware/authMiddleware')

const router = express.Router()
// GET /api/books
router.get('/', authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id
    const books = await Book.find({ user: userId })
    res.status(200).json(books)
  } catch (err) {
    console.error(err.message)
    res.status(500).send('Erro no servidor')
  }
})

// POST /api/books
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { googleBookId, status } = req.body
    const book = new Book({ googleBookId, status, user: req.user.id })
    await book.save()
    res.status(201).json(book)
  } catch (err) {
    console.error(err.message)
    res.status(500).json({ error: err.message })
  }
})

// GET /api/books/:googleBookId
router.get('/:googleBookId', authMiddleware, async (req, res) => {
  try {
    const { googleBookId } = req.params
    const book = await Book.findOne({ user: req.user.id, googleBookId })

    if (!book) {
      return res
        .status(404)
        .json({ message: 'Livro não encontrado na sua biblioteca.' })
    }

    res.status(200).json(book)
  } catch (err) {
    console.error(err.message)
    res.status(500).send('Erro no servidor')
  }
})

// PUT /api/books/:id
router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params
    const { status } = req.body

    const updatedBook = await Book.findByIdAndUpdate(
      id,
      { status },
      { new: true, runValidators: true }
    )

    if (!updatedBook) {
      return res.status(404).json({ message: 'Livro não encontrado.' })
    }

    res.status(200).json(updatedBook)
  } catch (err) {
    console.error(err.message)
    res.status(400).json({ error: err.message })
  }
})

// DELETE /api/books/:id
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params
    const deletedBook = await Book.findByIdAndDelete(id)

    if (!deletedBook) {
      return res.status(404).json({ message: 'Livro não encontrado.' })
    }

    res.status(200).json({ message: 'Livro removido com sucesso.' })
  } catch (err) {
    console.error(err.message)
    res.status(400).json({ error: err.message })
  }
})

module.exports = router
