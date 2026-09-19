import { chromium } from '@playwright/test'
import fs from 'node:fs/promises'
import sharp from 'sharp'

const browser = await chromium.launch({ channel: 'chrome', headless: true })
const results = []
for (const [name, viewport, touch] of [
  ['desktop', { width: 1440, height: 900 }, false],
  ['laptop', { width: 1366, height: 768 }, false],
  ['mobile', { width: 390, height: 844 }, true],
  ['mobile-landscape', { width: 844, height: 390 }, true],
]) {
  const context = await browser.newContext({ viewport, isMobile: touch, hasTouch: touch, deviceScaleFactor: 1 })
  const page = await context.newPage()
  const errors = []
  page.on('pageerror', e => errors.push(e.message))
  await page.goto('http://127.0.0.1:4173/#top')
  await page.evaluate(() => document.fonts.ready)
  await page.waitForTimeout(800)
  if (touch) {
    const cdp = await context.newCDPSession(page)
    await cdp.send('Emulation.setCPUThrottlingRate', { rate: 4 })
  }
  const mediaBounds = await page.locator('.story-media').boundingBox()
  const ctaBounds = await page.locator('.story-cta').boundingBox()
  results.push({ viewport: name, errors, mediaAndCtaSeparate: touch && viewport.width > viewport.height ? ctaBounds.x + ctaBounds.width <= mediaBounds.x : touch ? ctaBounds.y >= mediaBounds.y + mediaBounds.height : ctaBounds.x + ctaBounds.width <= mediaBounds.x })
  await page.screenshot({ path: `tmp/qa-${name}-hero.png` })
  for (const progress of [0.9, 0.12, 0.65, 0.02]) {
    await page.evaluate(value => {
      const el = document.querySelector('.scroll-story')
      window.scrollTo({ top: el.offsetTop + (el.offsetHeight - window.innerHeight) * value, behavior: 'instant' })
    }, progress)
    await page.waitForTimeout(450)
  }
  if (name === 'desktop') {
    for (const seam of [0.32, 0.5, 0.75]) {
      for (const side of [-1, 1]) {
        await page.evaluate(value => {
          const el = document.querySelector('.scroll-story')
          window.scrollTo({ top: el.offsetTop + (el.offsetHeight - window.innerHeight) * value, behavior: 'instant' })
        }, seam + side * 0.002)
        await page.waitForTimeout(650)
        await page.screenshot({ path: `tmp/seam-${seam}-${side}.png` })
      }
    }
  }
  if (name === 'desktop' || name === 'mobile') {
    for (const id of ['residences', 'architecture', 'amenities', 'visit']) {
      await page.evaluate(id => {
        window.scrollTo({ top: document.getElementById(id).offsetTop - 80, behavior: 'instant' })
      }, id)
      await page.waitForTimeout(900)
      await page.screenshot({ path: `tmp/qa-${name}-${id}.png` })
      const broken = await page.locator(`#${id} img`).evaluateAll(images => images.filter(img => img.complete && !img.naturalWidth).map(img => img.src))
      results.push({ viewport: name, section: id, broken, overflow: await page.evaluate(() => document.documentElement.scrollWidth > innerWidth) })
    }
  }
  await context.close()
}
await browser.close()
await fs.writeFile('tmp/visual-qa.json', JSON.stringify(results, null, 2))
const thumbs = await Promise.all([0.32, 0.5, 0.75].flatMap(seam => [-1, 1].map(async side => ({
  input: await sharp(`tmp/seam-${seam}-${side}.png`).resize(480, 300).toBuffer(),
  left: side === -1 ? 0 : 480, top: [0.32, 0.5, 0.75].indexOf(seam) * 300,
}))))
await sharp({ create: { width: 960, height: 900, channels: 3, background: '#202421' } }).composite(thumbs).png().toFile('tmp/seam-review.png')
console.log(JSON.stringify(results, null, 2))
