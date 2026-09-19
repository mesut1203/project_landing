import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from 'vite'
import { content } from './src/data/content.ts'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    {
      name: 'learn-forward-metadata',
      transformIndexHtml(html) {
        const escapeHtml = (value: string) =>
          value
            .replace(/&/g, '&amp;')
            .replace(/"/g, '&quot;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
        return html
          .replace('%SITE_TITLE%', escapeHtml(content.meta.title))
          .replace('%SITE_DESCRIPTION%', escapeHtml(content.meta.description))
      },
    },
  ],
})
