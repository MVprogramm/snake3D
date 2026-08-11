import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (!id.includes('node_modules')) return

          if (id.includes('/react/') || id.includes('/react-dom/') || id.includes('/scheduler/')) {
            return 'react-vendor'
          }

          if (id.includes('/three/examples/')) {
            return 'three-addons'
          }

          if (id.includes('/three/')) {
            return 'three-vendor'
          }

          if (id.includes('/@react-three/fiber/')) {
            return 'r3f-vendor'
          }

          if (id.includes('/@react-three/drei/') || id.includes('/three-stdlib/')) {
            return 'drei-vendor'
          }

          if (id.includes('/leva/') || id.includes('/r3f-perf/')) {
            return 'debug-vendor'
          }
        },
      },
    },
  },
})
