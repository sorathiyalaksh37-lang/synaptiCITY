/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'neural-weak': '#ef4444',
        'neural-medium': '#f59e0b',
        'neural-strong': '#10b981',
      },
    },
  },
  plugins: [],
}
