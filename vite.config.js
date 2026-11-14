import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { fileURLToPath, URL } from 'node:url'

// Konfigurasi Vite untuk proyek Vue (JavaScript murni)
export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      // Alias "@" mengarah ke folder src agar import lebih rapi
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  server: {
    port: 5173,
    open: true,
  },
})