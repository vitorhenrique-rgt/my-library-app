require('dotenv').config()

const express = require('express')
const connectDB = require('./config/database')
const booksRouter = require('./routes/books')

const app = express()
const port = process.env.PORT || 3000

app.use(express.json())

app.use('/api/books', booksRouter)

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
