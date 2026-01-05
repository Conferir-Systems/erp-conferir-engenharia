import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig(({}) => {
  return {
    server: {
      port: 5173,
      host: true,
    },
    plugins: [react()],
    envDir: '../',
    watch: {
      usePolling: true,
    },
    build: {
      outDir: 'dist',
      sourcemap: false,
    },
  }
})
