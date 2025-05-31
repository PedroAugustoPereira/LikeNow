/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
      "./app/**/*.{js,ts,jsx,tsx,mdx}",
      "./components/**/*.{js,ts,jsx,tsx,mdx}",
      // Adicione outros caminhos se necessário
    ],
    theme: {
      extend: {},
    },
    plugins: [],
    darkMode: 'class', // Isso é essencial para o toggle dark/light mode
  }