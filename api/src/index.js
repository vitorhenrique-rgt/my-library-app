require('dotenv').config()
const express = require('express')
const proxy = require('express-http-proxy')
const cors = require('cors')
const connectDB = require('./config/database')
const booksRouter = require('./routes/books')
const authRouter = require('./routes/auth')

const app = express()
const port = process.env.PORT || 3000

app.use(express.json())
app.use(cors())

// Rota de proxy para detalhes de um livro específico
app.use(
  '/google-books/:googleBookId',
  proxy('https://www.googleapis.com', {
    proxyReqPathResolver: function (req) {
      return `/books/v1/volumes/${req.params.googleBookId}?key=${process.env.GOOGLE_BOOKS_API_KEY}`
    },
  })
)
// Rota de proxy para a busca de livros
app.use(
  '/google-books',
  proxy('https://www.googleapis.com', {
    proxyReqPathResolver: function (req) {
      return `/books/v1/volumes?q=${req.query.q}&key=${process.env.GOOGLE_BOOKS_API_KEY}`
    },
  })
)

app.use('/api/books', booksRouter)
app.use('/api/auth', authRouter)

const startServer = async () => {
  try {
    await connectDB() // Aguarda a conexão com o banco de dados
    app.listen(port, () => {
      console.log(`Servidor rodando em http://localhost:${port}`)
    })
  } catch (err) {
    console.error('Falha ao iniciar o servidor:', err)
  }
}

startServer()
