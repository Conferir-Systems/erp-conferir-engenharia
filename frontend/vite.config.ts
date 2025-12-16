import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig(({ mode }) => {
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
  }
})
