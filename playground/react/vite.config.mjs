// @ts-check
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

export default defineConfig({
  base: '/playground-react/',
  plugins: [react()],
})
