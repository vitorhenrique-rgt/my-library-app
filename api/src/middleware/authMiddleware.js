const jwt = require('jsonwebtoken')

function authMiddleware(req, res, next) {
  const token = req.header('x-auth-token')

  if (!token) {
    return res.status(401).json({ msg: 'Token não encontrado. Acesso negado.' })
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    req.user = decoded //adiciona os dados do usuário na requisição
    next()
  } catch (e) {
    res.status(401).json({ msg: 'Token não é válido.' })
  }
}

module.exports = authMiddleware
