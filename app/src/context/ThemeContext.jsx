// src/context/ThemeContext.jsx
import { createContext, useEffect, useState } from 'react'

export const ThemeContext = createContext()

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(() => {
    // Tenta carregar o tema do localStorage ou usa 'dark' como padrão
    const savedTheme = localStorage.getItem('theme')
    return savedTheme ? savedTheme : 'dark'
  })

  useEffect(() => {
    const root = window.document.documentElement // O elemento <html>
    root.classList.remove('light', 'dark') // Remove ambas as classes
    root.classList.add(theme) // Adiciona a classe do tema atual
    localStorage.setItem('theme', theme) // Salva o tema no localStorage
  }, [theme]) // Roda sempre que o tema mudar

  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === 'dark' ? 'light' : 'dark'))
  }

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}
