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
        manualChunks: {
          'react-vendor':  ['react', 'react-dom'],
          'motion-vendor': ['framer-motion'],
          'three-vendor':  ['three', '@react-three/fiber', '@react-three/drei'],
          'globe-vendor':  ['three-globe'],
        },
      },
    },
    // Default is 500 kB. Lowering it means a future regression — e.g.
    // someone adding another heavy dep that lands in globe-vendor —
    // shows up as a build warning instead of shipping silently.
    chunkSizeWarningLimit: 400,
  },
})