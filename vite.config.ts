import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  // O chunk do 3D (three.js) é carregado sob demanda pelo hero e passa de 500 kB.
  build: { chunkSizeWarningLimit: 1200 },
})
