require('dotenv').config()

const express = require('express')
const connectDB = require('./config/database')
const booksRouter = require('./routes/books')

const app = express()
const port = process.env.PORT || 3000

connectDB()

app.use(express.json)

app.use('/api/books', booksRouter)

app.get('/', (req, res) => {
  res.send('API do App de Livros. Olá!')
})

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`)
})
