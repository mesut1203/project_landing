import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from 'vite'
import { brand, hero } from './src/data/content.ts'

const escapeHtml = (value) => value.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;')

function pageMetadata() {
  return {
    name: 'apex-page-metadata',
    transformIndexHtml(html) {
      return {
        html: html.replace(/<title>.*?<\/title>/, `<title>${escapeHtml(brand.title)}</title>`).replace(/<meta name="description" content=""\s*\/>/, ''),
        tags: [
          { tag: 'meta', attrs: { name: 'description', content: brand.description }, injectTo: 'head' },
          { tag: 'link', attrs: { rel: 'icon', type: 'image/svg+xml', href: brand.favicon }, injectTo: 'head' },
          { tag: 'link', attrs: { rel: 'preload', as: 'image', href: hero.image.src, fetchpriority: 'high' }, injectTo: 'head' },
        ],
      }
    },
  }
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss(), pageMetadata()],
})
