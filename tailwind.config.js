/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          dark: '#050505',    // Um preto profundo
          red: '#dc2626',     // Vermelho intenso (Red-600 do Tailwind)
          darkred: '#7f1d1d', // Vermelho escuro para fundos
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      }
    },
  },
  plugins: [],
}