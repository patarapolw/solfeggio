import path from 'path'

import mpa from '@patarapolw/vite-plugin-mpa'
import vue from '@vitejs/plugin-vue'
import { defineConfig } from 'vite'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    mpa(),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    rollupOptions: {
      external: /^\/vendor\//,
    },
    emptyOutDir: true
  },
  server: {
    proxy: (() => {
      const { SERVER_PORT } = process.env

      return SERVER_PORT ? {
        '/api': `http://localhost:${SERVER_PORT}`
      } : {}
    })(),
  },
})
