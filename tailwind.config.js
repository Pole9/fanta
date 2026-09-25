/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        role: {
          p: '#eab308', // Portiere (Yellow/Gold)
          d: '#22c55e', // Difensore (Green)
          c: '#3b82f6', // Centrocampista (Blue)
          a: '#ef4444', // Attaccante (Red)
        }
      }
    },
  },
  plugins: [],
}
