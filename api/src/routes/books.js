const express = require('express')
const Book = require('../models/Book') // Importa o Modelo Book

const router = express.Router()

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

module.exports = router
