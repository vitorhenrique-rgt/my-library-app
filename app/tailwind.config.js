/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class', // Habilita o dark mode baseado na classe 'dark'
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        // Nova Paleta de Cores (exemplo, podemos ajustar):
        // Tons de cinza mais profundos e azul acinzentado para uma base sofisticada
        backgroundDark: '#0A0A0F', // Fundo principal escuro
        backgroundLight: '#F5F5F7', // Fundo principal claro
        cardDark: '#1A1A22', // Card escuro
        cardLight: '#FFFFFF', // Card claro
        textDark: '#E0E0E0', // Texto em tema escuro
        textLight: '#333333', // Texto em tema claro
        primary: '#4299E1', // Azul para botões e destaque
        primaryHover: '#3182CE',
        accent: '#F6AD55', // Cor de destaque (ex: amarelo-laranja)
        danger: '#EF4444', // Vermelho para ações de perigo
      },
      fontFamily: {
        // Tipografia mais clean e moderna
        sans: ['Inter', 'sans-serif'], // Uma fonte sem serifa mais elegante
        serif: ['Merriweather', 'serif'], // Uma fonte serifada para títulos (opcional)
      },
    },
  },
  plugins: [require('@tailwindcss/line-clamp')],
}
