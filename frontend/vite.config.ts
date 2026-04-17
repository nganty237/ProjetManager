import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },

  server: {
    host: true,
    strictPort: true,
    allowedHosts: true,
    // DÉSACTIVATION TEMPORAIRE POUR DÉBOGAGE
    // On désactive le HMR pour voir si c'est lui qui cause le rafraîchissement infini via Ngrok
    hmr: false,
  }
})