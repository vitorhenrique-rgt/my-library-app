// middleware/authMiddleware.js

const jwt = require('jsonwebtoken')

function authMiddleware(req, res, next) {
  // Pega o token do cabeçalho da requisição
  const token = req.header('x-auth-token')

  // Se o token não existir, nega o acesso
  if (!token) {
    return res.status(401).json({ msg: 'Token não encontrado. Acesso negado.' })
  }

  // Verifica o token
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    // Adiciona o usuário do payload do token à requisição
    req.user = decoded.user
    next()
  } catch (e) {
    res.status(401).json({ msg: 'Token não é válido.' })
  }
}

module.exports = authMiddleware
