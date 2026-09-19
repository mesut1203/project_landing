import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { content } from './src/data/content.ts'

export default defineConfig({ plugins: [react(), tailwindcss(), {
  name: 'luma-document',
  transformIndexHtml(html) {
    return {
      html: html.replace('<title>Luma Residences</title>', `<title>${content.meta.title}</title>`)
        .replace('name="description" content="Luma Residences"', `name="description" content="${content.meta.description}"`),
      tags: [
        { tag: 'link', attrs: { rel: 'icon', type: 'image/svg+xml', href: content.meta.icon }, injectTo: 'head' },
        { tag: 'link', attrs: { rel: 'preload', as: 'image', href: content.story.scenes[0].image.mobile, media: '(max-width: 767px), (pointer: coarse)', fetchpriority: 'high' }, injectTo: 'head' },
        { tag: 'link', attrs: { rel: 'preload', as: 'image', href: content.story.scenes[0].image.desktop, media: '(min-width: 768px) and (pointer: fine), (min-width: 768px) and (pointer: none)', fetchpriority: 'high' }, injectTo: 'head' },
      ],
    }
  },
}] })
