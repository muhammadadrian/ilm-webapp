import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
// base is set for GitHub Pages project-site deployment:
// https://muhammadadrian.github.io/ilm-webapp/
export default defineConfig({
  base: '/ilm-webapp/',
  plugins: [react()],
})
