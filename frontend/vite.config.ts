import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite';
import { fileURLToPath } from 'url';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(),tailwindcss()],
  resolve:{
    alias: {
      '@': fileURLToPath(new URL('./src',import.meta.url))
    }
  },
  server:{
    port: 5173,
    proxy:{
      '/api':{
        target: "http://localhost:8080",
        changeOrigin: true,
        secure: false // change to true, if the backend isn't local
      }
    }
  }
})
