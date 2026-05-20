import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'https://anonymous-backend-cyy6.onrender.com',
        changeOrigin: true,
      }
    }
  }
})
