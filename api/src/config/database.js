const mongoose = require('mongoose')

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.DB_CONNECTION_STRING)
    console.log('Conectado ao MongoDB Atlas!')
  } catch (err) {
    console.error('Erro ao conectar ao MongoDB:', err)
    process.exit(1) // Sai da aplicação em caso de erro.
  }
}

module.exports = connectDB
