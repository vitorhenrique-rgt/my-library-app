const express = require('express')
const axios = require('axios')
const Book = require('../models/Book')
const authMiddleware = require('../middleware/authMiddleware')

const router = express.Router()

// Rota para listar os livros do usuário logado
router.get('/', authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id
    console.log('Buscando livros para o usuário:', userId)
    const books = await Book.find({ user: userId })
    console.log('Livros encontrados no banco de dados:', books)
    res.status(200).json(books)
  } catch (err) {
    console.error(err.message)
    res.status(500).send('Erro no servidor')
  }
})

// Rota para buscar livros por googleBookId (dentro da biblioteca do usuário)
router.get('/details', authMiddleware, async (req, res) => {
  try {
    const { googleBookId } = req.query
    const book = await Book.findOne({ user: req.user.id, googleBookId })
    if (!book) {
      return res
        .status(404)
        .json({ message: 'Livro não encontrado na sua biblioteca.' })
    }
    res.json(book)
  } catch (err) {
    console.error(err.message)
    res.status(500).send('Erro no servidor')
  }
})

// Add book
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { googleBookId, status } = req.body
    const book = new Book({ googleBookId, status, user: req.user })
    await book.save()
    res.status(201).json(book)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// Update book
router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params // Captura o ID da URL
    const { status } = req.body // Captura o novo status do corpo da requisição

    // Busca o livro pelo ID e o atualiza
    const updatedBook = await Book.findByIdAndUpdate(
      id,
      { status },
      { new: true, runValidators: true } // Opções de retorno e validação
    )

    // Se o livro não for encontrado, retorna um erro 404
    if (!updatedBook) {
      return res.status(404).json({ message: 'Livro não encontrado.' })
    }

    // Responde com o livro atualizado e o status 200 OK
    res.status(200).json(updatedBook)
  } catch (err) {
    // Em caso de erro, responde com status 400 (Bad Request)
    res.status(400).json({ error: err.message })
  }
})

// Delete book
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params

    const deletedBook = await Book.findByIdAndDelete(id)

    if (!deletedBook) {
      return res.status(404).json({ message: 'Livro não encontrado.' })
    }

    res.status(200).json({ message: 'Livro removido com sucesso.' })
  } catch (err) {
    res.status(400).json({ error: err.message })
  }
})

module.exports = router
