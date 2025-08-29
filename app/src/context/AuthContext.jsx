import { createContext, useEffect, useState } from 'react'

export const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [userId, setUserId] = useState(null)
  const [token, setToken] = useState(null)

  useEffect(() => {
    const storedToken = localStorage.getItem('token')
    const storedUserId = localStorage.getItem('userId')

    if (storedToken && storedUserId) {
      setIsAuthenticated(true)
      setUserId(storedUserId)
      setToken(storedToken)
    }
  }, [])

  const login = (token, id) => {
    localStorage.setItem('token', token)
    localStorage.setItem('userId', id)
    setIsAuthenticated(true)
    setUserId(id)
    setToken(token)
  }

  const logout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('userId')
    setIsAuthenticated(false)
    setUserId(null)
    setToken(null)
  }

  return (
    <AuthContext.Provider
      value={{ isAuthenticated, userId, token, login, logout }}
    >
      {children}
    </AuthContext.Provider>
  )
}
