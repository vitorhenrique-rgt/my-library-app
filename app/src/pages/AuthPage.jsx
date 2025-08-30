import { useContext, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { AuthContext } from '../context/AuthContext'
import api from '../services/api'

function AuthPage() {
  const { login } = useContext(AuthContext)
  const [isLogin, setIsLogin] = useState(true)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const handleAuth = async (e) => {
    e.preventDefault()
    setError('')

    const endpoint = isLogin ? 'login' : 'register'
    const url = `http://localhost:3000/api/auth/${endpoint}`

    try {
      const response = await api.post(url, { username, password })

      if (isLogin) {
        login(response.data.token, response.data.userId)
        navigate('/')
      } else {
        alert('Usuário registrado com sucesso! Agora faça o login.')
        setIsLogin(true)
      }
    } catch (err) {
      setError(err.response?.data.error || 'Erro de autenticação')
    }
  }

  return (
    <div className="bg-gray-900 text-gray-200 min-h-screen flex items-center justify-center font-sans">
      <div className="bg-gray-800 p-8 rounded-lg shadow-xl w-full max-w-sm">
        <h2 className="text-3xl font-bold text-center text-white mb-6">
          {isLogin ? 'Login' : 'Registro'}
        </h2>
        {error && <p className="text-red-500 text-center mb-4">{error}</p>}

        <form onSubmit={handleAuth}>
          <div className="mb-4">
            <input
              type="text"
              placeholder="Nome de usuário"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full p-3 bg-gray-700 border border-gray-600 rounded-md text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="mb-6">
            <input
              type="password"
              placeholder="Senha"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 bg-gray-700 border border-gray-600 rounded-md text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 text-white font-semibold py-3 rounded-md hover:bg-blue-700 transition-colors"
          >
            {isLogin ? 'Entrar' : 'Registrar'}
          </button>
        </form>

        <p className="text-center mt-6 text-sm">
          {isLogin ? 'Não tem uma conta?' : 'Já tem uma conta?'}
          <button
            onClick={() => setIsLogin(!isLogin)}
            className="text-blue-400 font-semibold hover:underline ml-1"
          >
            {isLogin ? 'Registre-se' : 'Faça login'}
          </button>
        </p>
      </div>
    </div>
  )
}

export default AuthPage
