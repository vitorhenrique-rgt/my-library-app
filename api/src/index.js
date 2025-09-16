require('dotenv').config()
const express = require('express')
const cors = require('cors')
const connectDB = require('./config/database')
const booksRouter = require('./routes/books')
const authRouter = require('./routes/auth')
const bookNotesRouter = require('./routes/bookNotes')
const reviewsRouter = require('./routes/reviews')

const app = express()
const port = process.env.PORT || 3000

app.use(express.json())
app.use(cors())

app.use('/api/books', booksRouter)
app.use('/api/auth', authRouter)
app.use('/api/book-notes', bookNotesRouter)
app.use('/api/reviews', reviewsRouter)

const startServer = async () => {
  try {
    await connectDB()
    app.listen(port, () => {
      console.log(`Servidor rodando em http://localhost:${port}`)
    })
  } catch (err) {
    console.error('Falha ao iniciar o servidor:', err)
  }
}

startServer()
