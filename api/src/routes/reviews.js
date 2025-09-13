const express = require('express')
const Review = require('../models/Review')
const authMiddleware = require('../middleware/authMiddleware')

const router = express.Router()

// Adicionar avaliação
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { googleBookId, rating, comment } = req.body
    const review = new Review({
      googleBookId,
      user: req.user.id,
      rating,
      comment
    })
    await review.save()
    res.status(201).json(review)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// Listar avaliações de um livro
router.get('/:googleBookId', async (req, res) => {
  try {
    const reviews = await Review.find({ googleBookId: req.params.googleBookId }).populate('user', 'username')
    res.status(200).json(reviews)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

module.exports = router
