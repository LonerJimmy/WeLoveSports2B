import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    strictPort: false,
    host: '0.0.0.0',
    port: 3000,
    proxy: {
      '/user': {
        target: 'http://localhost:8081',
        changeOrigin: true,
      },
      '/coach': {
        target: 'http://localhost:8081',
        changeOrigin: true,
      },
      '/book': {
        target: 'http://localhost:8081',
        changeOrigin: true,
      },
      '/order': {
        target: 'http://localhost:8081',
        changeOrigin: true,
      },
    },
  },
})
