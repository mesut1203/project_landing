import { chromium } from '@playwright/test'
import fs from 'node:fs/promises'
import sharp from 'sharp'

const browser = await chromium.launch({ channel: 'chrome', headless: true })
await fs.mkdir('tmp', { recursive: true })
const results = []
for (const [name, viewport, touch] of [
  ['desktop', { width: 1440, height: 900 }, false],
  ['laptop', { width: 1366, height: 768 }, false],
  ['mobile', { width: 375, height: 812 }, true],
  ['mobile-landscape', { width: 844, height: 390 }, true],
]) {
  const context = await browser.newContext({ viewport, isMobile: touch, hasTouch: touch, deviceScaleFactor: 1 })
  const page = await context.newPage()
  const errors = []
  const videos = []
  page.on('pageerror', e => errors.push(e.message))
  page.on('request', request => { if (/\.mp4/.test(request.url())) videos.push(request.url()) })
  await page.goto('http://127.0.0.1:4173/#top')
  await page.evaluate(() => document.fonts.ready)
  await page.locator('.story-image').first().evaluate(image => image.decode())
  await page.waitForTimeout(300)
  if (touch) {
    const cdp = await context.newCDPSession(page)
    await cdp.send('Emulation.setCPUThrottlingRate', { rate: 4 })
  }
  const mediaBounds = await page.locator('.story-image').first().boundingBox()
  const ctaBounds = await page.locator('.story-actions .button').boundingBox()
  results.push({ viewport: name, mediaAndCtaSeparate: ctaBounds.x + ctaBounds.width <= mediaBounds.x || ctaBounds.y >= mediaBounds.y + mediaBounds.height })
  await page.screenshot({ path: `tmp/qa-${name}-hero.png` })
  for (const id of ['lobby-title', 'residence-title', 'balcony-title']) {
    await page.locator(`#${id}`).evaluate(heading => {
      const section = heading.closest('article')
      window.scrollTo({ top: section.getBoundingClientRect().top + scrollY - 72, behavior: 'instant' })
    })
    await page.waitForTimeout(300)
    if (name === 'desktop' || name === 'mobile') await page.screenshot({ path: `tmp/qa-${name}-${id}.png` })
  }
  if (name === 'desktop' || name === 'mobile') {
    for (const id of ['residences', 'architecture', 'amenities', 'visit']) {
      await page.evaluate(id => {
        window.scrollTo({ top: document.getElementById(id).offsetTop - 80, behavior: 'instant' })
      }, id)
      await page.locator(`#${id} img`).evaluateAll(images => Promise.all(images.map(image => image.decode().catch(() => {}))))
      await page.waitForTimeout(300)
      await page.screenshot({ path: `tmp/qa-${name}-${id}.png` })
      const broken = await page.locator(`#${id} img`).evaluateAll(images => images.filter(img => !img.naturalWidth).map(img => img.src))
      results.push({ viewport: name, section: id, broken, overflow: await page.evaluate(() => document.documentElement.scrollWidth > innerWidth) })
    }
  }
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await page.evaluate(() => { document.documentElement.style.fontSize = '200%'; window.scrollTo({ top: 0, behavior: 'instant' }) })
  results.push({ viewport: name, errors, videos, enlargedTextOverflow: await page.evaluate(() => document.documentElement.scrollWidth > innerWidth) })
  await context.close()
}
await browser.close()
await fs.writeFile('tmp/visual-qa.json', JSON.stringify(results, null, 2))
const thumbs = await Promise.all(['desktop', 'laptop', 'mobile', 'mobile-landscape'].map(async (name, index) => ({
  input: await sharp(`tmp/qa-${name}-hero.png`).resize(600, 450, { fit: 'contain', background: '#202421' }).toBuffer(),
  left: index % 2 * 600, top: Math.floor(index / 2) * 450,
})))
await sharp({ create: { width: 1200, height: 900, channels: 3, background: '#202421' } }).composite(thumbs).png().toFile('tmp/hero-review.png')
console.log(JSON.stringify(results, null, 2))
if (results.some(result => result.mediaAndCtaSeparate === false || result.broken?.length || result.overflow || result.enlargedTextOverflow || result.errors?.length || result.videos?.length)) process.exitCode = 1
