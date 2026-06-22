import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    watch: {
      // Ignore large media assets so Vite never locks on them
      ignored: ['**/public/*.mp4', '**/public/*.mov', '**/public/frames/**'],
    },
  },
})
