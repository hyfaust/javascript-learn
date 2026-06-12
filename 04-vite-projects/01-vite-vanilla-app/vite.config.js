import { defineConfig } from 'vite'

export default defineConfig({
  // Development server options
  server: {
    port: 5173,
    open: true, // Auto-open browser on start
  },

  // Build options
  build: {
    outDir: 'dist',
    minify: 'esbuild', // Use esbuild for fast minification
  },
})
