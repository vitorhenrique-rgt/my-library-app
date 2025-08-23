const express = require('express')
const axios = require('axios')
const Book = require('../models/Book')

const router = express.Router()

// Search book on Google Book API
router.get('/search', async (req, res) => {
  try {
    // Captura o termo de busca da query da URL, ex: /search?q=clean+code
    const { q } = req.query

    if (!q) {
      return res
        .status(400)
        .json({ error: 'Termo de busca (q) é obrigatório.' })
    }

    const API_KEY = process.env.GOOGLE_BOOKS_API_KEY
    const GOOGLE_BOOKS_URL = `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(
      q
    )}&key=${API_KEY}`

    const response = await axios.get(GOOGLE_BOOKS_URL)
    const books = response.data.items.map((item) => ({
      googleBookId: item.id,
      title: item.volumeInfo.title,
      authors: item.volumeInfo.authors,
      description: item.volumeInfo.description,
      imageLink: item.volumeInfo.imageLinks?.thumbnail,
    }))

    res.status(200).json(books)
  } catch (err) {
    console.error('Erro ao buscar na API do Google Books:', err)
    res.status(500).json({ error: 'Erro ao buscar livros.' })
  }
})

//List books
router.get('/', async (req, res) => {
  try {
    const books = await Book.find({}) // Encontra todos os documentos na coleção 'books'
    res.status(200).json(books) // Retorna a lista de livros com status 200 OK
  } catch (err) {
    res.status(500).json({ error: 'Erro ao buscar os livros.' }) // Erro do servidor
  }
})

//Search book for ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params
    const book = await Book.findById(id)

    if (!book) {
      return res.status(404).json({ message: 'Livro não encontrado.' })
    }

    res.status(200).json(book)
  } catch (err) {
    res.status(400).json({ error: err.message })
  }
})

// Add book
router.post('/', async (req, res) => {
  try {
    const { googleBookId, status } = req.body

    const newBook = new Book({
      googleBookId,
      status,
    })

    const savedBook = await newBook.save()

    res.status(201).json(savedBook)
  } catch (err) {
    res.status(400).json({ error: err.message })
  }
})

// Update book
router.put('/:id', async (req, res) => {
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
router.delete('/:id', async (req, res) => {
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
