/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      colors: {
        primary: '#2D7E4A',
        primaryHover: '#23633a',
        secondary: '#7AC2A0',
        bgMain: '#F2F5F4',
        surface: '#FFFFFF',
        border: '#E3E7E5',
        textMain: '#333333',
        textSec: '#666666',
        surfaceHighlight: '#ECF7F1',
        statusApproved: '#2D7E4A',
        statusPending: '#FFB347',
        statusRejected: '#C44545',
        statusDraft: '#9A9A9A',
      }
    },
  },
  plugins: [],
}