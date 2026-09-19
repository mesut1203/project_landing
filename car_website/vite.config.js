import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from 'vite'
import { brand, media, story } from './src/data/content.ts'

const escapeHtml = (value) => value.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;')

function pageMetadata() {
  return {
    name: 'apex-page-metadata',
    transformIndexHtml(html) {
      const posters = JSON.stringify({
        mobileQuery: story.breakpoint,
        mobile: media.mobile.enabled ? media.mobile.poster : media.mobile.finalPoster,
        mobileFinal: media.mobile.finalPoster,
        desktop: media.desktop.poster,
        desktopFinal: media.desktop.finalPoster,
      }).replaceAll('<', '\\u003c')
      return {
        html: html.replace(/<title>.*?<\/title>/, `<title>${escapeHtml(brand.title)}</title>`).replace(/<meta name="description" content=""\s*\/>/, ''),
        tags: [
          { tag: 'meta', attrs: { name: 'description', content: brand.description }, injectTo: 'head' },
          { tag: 'link', attrs: { rel: 'icon', type: 'image/svg+xml', href: brand.favicon }, injectTo: 'head' },
          // Discover just the selected poster before React loads. Never preload both variants.
          { tag: 'script', injectTo: 'head-prepend', children: `(()=>{const p=${posters};const m=matchMedia(p.mobileQuery).matches;const r=matchMedia('(prefers-reduced-motion: reduce)').matches;const l=document.createElement('link');l.rel='preload';l.as='image';l.fetchPriority='high';l.href=m?(r?p.mobileFinal:p.mobile):(r?p.desktopFinal:p.desktop);document.head.append(l)})()` },
        ],
      }
    },
  }
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss(), pageMetadata()],
})
