const jwt = require('jsonwebtoken')

const authMiddleware = (req, res, next) => {
  // Pega o token do cabeçalho da requisição
  const token = req.header('x-auth-token')

  // Se não houver token, retorna erro de acesso negado
  if (!token) {
    return res.status(401).json({ msg: 'Nenhum token, autorização negada' })
  }

  try {
    // Verifica o token com a chave secreta
    const decoded = jwt.verify(token, process.env.JWT_SECRET)

    // Adiciona o ID do usuário à requisição
    req.user = decoded.id
    next()
  } catch (e) {
    // Se o token for inválido, retorna erro
    res.status(401).json({ msg: 'Token não é válido' })
  }
}

module.exports = authMiddleware
