import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from 'vite'
import { content } from './src/data/content.ts'

const escapeHtml = (value) => value.replaceAll('&', '&amp;').replaceAll('"', '&quot;').replaceAll('<', '&lt;').replaceAll('>', '&gt;')

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss(), {
    name: 'aurelia-content',
    transformIndexHtml(html) {
      return {
        html: html.replace('__PAGE_TITLE__', escapeHtml(content.seo.title))
          .replace('__META_DESCRIPTION__', escapeHtml(content.seo.description))
          .replace('__FAVICON__', escapeHtml(content.seo.favicon)),
        tags: [
          { tag: 'link', attrs: { rel: 'preload', as: 'image', href: content.story.scenes[0].poster.src, fetchpriority: 'high' } },
        ],
      }
    },
  }],
})
