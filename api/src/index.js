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

// Rota de proxy para a busca de livros
app.use(
  '/api/google-books/search',
  proxy('https://www.googleapis.com', {
    proxyReqPathResolver: function (req) {
      // Obtém o termo de busca da requisição do frontend
      const searchTerm = req.query.q
      // Codifica o termo de busca para garantir que os espaços e caracteres especiais sejam tratados corretamente
      const encodedSearchTerm = encodeURIComponent(searchTerm)

      // Constrói a URL final para a API do Google usando o termo codificado
      return (googleUrl = `/books/v1/volumes?q=${encodedSearchTerm}&key=${process.env.GOOGLE_BOOKS_API_KEY}`)
    },
  })
)

// Nova rota de proxy para os detalhes de um livro específico
// Observe a mudança: usamos o parâmetro na URL, :googleBookId
app.use(
  '/api/google-books/details/:googleBookId',
  proxy('https://www.googleapis.com', {
    proxyReqPathResolver: function (req) {
      // Constrói a URL final para a API do Google usando o parâmetro da URL
      return `/books/v1/volumes/${req.params.googleBookId}?key=${process.env.GOOGLE_BOOKS_API_KEY}`
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
