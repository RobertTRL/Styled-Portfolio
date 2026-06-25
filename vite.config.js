import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('/node_modules/three-globe/')) return 'globe-vendor'
          if (
            id.includes('/node_modules/three/') ||
            id.includes('/node_modules/@react-three/')
          ) return 'three-vendor'
          if (id.includes('/node_modules/framer-motion/')) return 'motion-vendor'
          if (
            id.includes('/node_modules/react/') ||
            id.includes('/node_modules/react-dom/')
          ) return 'react-vendor'
        },
      },
    },
    chunkSizeWarningLimit: 400,
  },
})