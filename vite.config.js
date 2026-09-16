import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { slideforgePdfExportPlugin } from './src/export/pdfExportPlugin.js'

export default defineConfig({
  plugins: [react(), slideforgePdfExportPlugin()],
  resolve: {
    alias: [
      {
        find: /^slideforge$/,
        replacement: fileURLToPath(new URL('./src/index.js', import.meta.url)),
      },
    ],
  },
})
