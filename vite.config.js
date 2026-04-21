import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: [
      {
        find: /^slideforge$/,
        replacement: fileURLToPath(new URL('./src/index.js', import.meta.url)),
      },
    ],
  },
})
