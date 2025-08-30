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

app.use(
  '/api/google-books/search',
  proxy('https://www.googleapis.com', {
    proxyReqPathResolver: function (req) {
      // Constrói a URL final para a API do Google
      return `/books/v1/volumes?q=${req.query.q}&key=${process.env.GOOGLE_BOOKS_API_KEY}`
    },
  })
)

// Nova rota de proxy para os detalhes de um livro específico
app.use(
  '/api/google-books/details',
  proxy('https://www.googleapis.com', {
    proxyReqPathResolver: function (req) {
      // Constrói a URL final para a API do Google usando o ID do livro
      return `/books/v1/volumes/${req.query.id}?key=${process.env.GOOGLE_BOOKS_API_KEY}`
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
