import { test, expect } from '@playwright/test'
import AxeBuilder from '@axe-core/playwright'
import { media, story } from '../src/data/content'
import { progressToFrame, frameUrl } from '../src/lib/frameMath'

test('frame mapping is bounded, monotone, reversible and continuous at configured seams', () => {
  for (const config of Object.values(media)) {
    const indices = Array.from({ length: 1001 }, (_, index) => progressToFrame(index / 1000, story.scenes, config))
    expect(indices[0]).toBe(0)
    expect(indices.at(-1)).toBe(config.frameCount - 1)
    expect(indices).toEqual([...indices].sort((a, b) => a - b))
    for (const scene of story.scenes.slice(0, -1)) {
      const seam = scene[config.id].end
      expect(Math.abs(progressToFrame(seam - 0.00001, story.scenes, config) - progressToFrame(seam + 0.00001, story.scenes, config))).toBeLessThanOrEqual(1)
    }
    expect(frameUrl(config, -100)).toContain('0000.webp')
    expect(frameUrl(config, 1e8)).toContain(String(config.frameCount - 1).padStart(4, '0') + '.webp')
  }
})

test('desktop progressively loads one variant and scrubs forward and backward', async ({ page }) => {
  const frames = new Set<string>()
  const errors: string[] = []
  page.on('request', (request) => { if (request.url().includes('/sequence/')) frames.add(request.url()) })
  page.on('pageerror', (error) => errors.push(error.message))
  await page.goto('/')
  const canvas = page.locator('.sequence-canvas')
  await expect(canvas).toHaveAttribute('data-frame', '0')
  await expect(page.locator('.frame-sequence')).toHaveAttribute('data-status', 'ready')
  expect(frames.size).toBeLessThan(25)
  expect([...frames].every((url) => url.includes('/desktop/'))).toBeTruthy()
  await page.screenshot({ path: 'test-results/desktop-hero.png' })
  for (const progress of [0.2, 0.379, 0.381, 0.55, 0.759, 0.761, 1, 0.5, 0]) {
    await page.evaluate((value) => {
      const section = document.querySelector('#story') as HTMLElement
      window.scrollTo({ top: section.offsetTop + (section.offsetHeight - innerHeight) * value, behavior: 'instant' })
    }, progress)
    await expect(canvas).toHaveAttribute('data-frame', String(progressToFrame(progress, story.scenes, media.desktop)))
    expect(Number(await canvas.getAttribute('data-decoded'))).toBeLessThanOrEqual(media.desktop.maxDecoded)
    if (progress === 0.55 || progress === 1) await page.screenshot({ path: `test-results/desktop-story-${progress}.png` })
  }
  expect(errors).toEqual([])
})

for (const [width, height] of [[320, 568], [375, 667], [390, 844], [430, 932], [768, 1024], [844, 390]]) {
  test(`responsive layout ${width}x${height} has no overflow and keeps navigation visible`, async ({ page }) => {
    await page.setViewportSize({ width, height })
    const frameRequests: string[] = []
    page.on('request', (request) => { if (request.url().includes('/sequence/')) frameRequests.push(request.url()) })
    await page.goto('/')
    await expect(page.locator('h1')).toBeVisible()
    await page.evaluate(() => document.fonts.ready)
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBeTruthy()
    if (width < 768) {
      await expect(page.getByRole('button', { name: 'Open navigation menu' })).toBeVisible()
      expect(frameRequests).toEqual([])
      await expect(page.locator('.sequence-poster')).toHaveAttribute('src', '/media/mobile-static.webp')
      expect(await page.locator('.sequence-poster').evaluate((image: HTMLImageElement) => image.naturalWidth < 1280)).toBeTruthy()
    }
    await page.screenshot({ path: `test-results/viewport-${width}x${height}.png` })
    await page.evaluate(() => document.querySelector('#gallery')?.scrollIntoView())
    await expect(page.locator('.site-header')).toBeInViewport()
    expect(await page.locator('.site-header').evaluate((element) => Math.round(element.getBoundingClientRect().top))).toBe(0)
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBeTruthy()
  })
}

test('mobile menu traps focus, closes with Escape, restores focus and offsets anchors', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 })
  await page.goto('/')
  const trigger = page.getByRole('button', { name: 'Open navigation menu' })
  await trigger.click()
  const menu = page.getByRole('dialog', { name: 'Menu' })
  await expect(menu).toBeVisible()
  await expect(page.getByRole('button', { name: 'Close navigation menu' })).toBeFocused()
  await page.keyboard.press('Shift+Tab')
  await expect(menu.getByRole('link', { name: 'Book a drive' })).toBeFocused()
  await page.keyboard.press('Tab')
  await expect(page.getByRole('button', { name: 'Close navigation menu' })).toBeFocused()
  await page.keyboard.press('Escape')
  await expect(menu).not.toBeVisible()
  await expect(trigger).toBeFocused()
  await trigger.click()
  await menu.getByRole('link', { name: 'Models', exact: true }).click()
  await expect(menu).not.toBeVisible()
  await expect(page.locator('#model')).toBeFocused()
  await expect.poll(() => page.locator('#model').evaluate((element) => Math.round(element.getBoundingClientRect().top))).toBe(92)
  await page.screenshot({ path: 'test-results/mobile-model.png' })
})

test('reduced motion loads only the final poster in normal document flow', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' })
  const frames: string[] = []
  page.on('request', (request) => { if (request.url().includes('/sequence/')) frames.push(request.url()) })
  await page.goto('/')
  await expect(page.locator('.scroll-story')).toHaveClass(/story-static/)
  await expect(page.locator('.sequence-poster')).toHaveAttribute('src', '/media/arrival-desktop.webp')
  await expect(page.locator('canvas')).toHaveCount(0)
  expect(await page.locator('.story-stage').evaluate((element) => getComputedStyle(element).position)).toBe('relative')
  await expect(page.getByRole('heading', { name: 'See where it takes you.' })).toBeVisible()
  expect(frames).toEqual([])
})

test('changing reduced motion at runtime clears hidden story copy', async ({ page }) => {
  await page.goto('/')
  await page.evaluate(() => window.scrollTo(0, 2400))
  await expect(page.locator('.sequence-canvas')).not.toHaveAttribute('data-frame', '0')
  await page.emulateMedia({ reducedMotion: 'reduce' })
  for (const heading of ['Built for the long way.', 'Precision in every line. Confidence in every mile.', 'See where it takes you.']) {
    await expect(page.getByRole('heading', { name: heading })).toBeVisible()
  }
  await expect(page.locator('canvas')).toHaveCount(0)
})

test('touch phone stays on its own layout after landscape rotation', async ({ browser }) => {
  const context = await browser.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true })
  const page = await context.newPage()
  const frameRequests: string[] = []
  page.on('request', (request) => { if (request.url().includes('/sequence/')) frameRequests.push(request.url()) })
  await page.goto('http://127.0.0.1:5173/')
  await page.setViewportSize({ width: 844, height: 390 })
  await expect(page.getByRole('button', { name: 'Open navigation menu' })).toBeVisible()
  await expect(page.locator('.frame-sequence')).toHaveAttribute('data-variant', 'mobile')
  expect(frameRequests).toEqual([])
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBeTruthy()
  await expect(page.locator('.story-copy--ignition .action')).toBeInViewport()
  await page.screenshot({ path: 'test-results/phone-rotated.png' })
  await context.close()
})

test('failed frames retain the poster and retry can recover', async ({ page }) => {
  await page.route('**/media/sequence/**', (route) => route.fulfill({ status: 503, body: 'unavailable' }))
  await page.goto('/')
  await expect(page.getByText(story.failure)).toBeVisible()
  await expect(page.locator('.sequence-poster')).toHaveCSS('opacity', '1')
  await expect(page.locator('h1')).toBeVisible()
  await page.unroute('**/media/sequence/**')
  await page.getByRole('button', { name: story.retry }).click()
  await expect(page.locator('.sequence-canvas')).toHaveAttribute('data-frame', '0')
  await expect(page.locator('.sequence-canvas')).toHaveCSS('opacity', '1')
})

test('poster fallback survives a broken poster and broken sequence', async ({ page }) => {
  await page.route('**/media/ignition-desktop.webp', (route) => route.abort())
  await page.route('**/media/sequence/**', (route) => route.abort())
  await page.goto('/')
  await expect(page.locator('.sequence-poster')).toHaveAttribute('src', media.desktop.fallback)
  await expect(page.locator('.sequence-poster')).toHaveJSProperty('complete', true)
  await expect(page.locator('.sequence-poster')).toHaveCSS('opacity', '1')
})

test('crossing the breakpoint aborts desktop requests and does not load a portrait substitute', async ({ page }) => {
  const failed: string[] = []
  await page.route('**/media/sequence/**', async (route) => { await new Promise((resolve) => setTimeout(resolve, 1500)); await route.continue().catch(() => {}) })
  page.on('requestfailed', (request) => { if (request.url().includes('/sequence/desktop/')) failed.push(request.url()) })
  await page.goto('/')
  await page.setViewportSize({ width: 390, height: 844 })
  await expect(page.locator('.frame-sequence')).toHaveAttribute('data-variant', 'mobile')
  await expect(page.locator('canvas')).toHaveCount(0)
  await expect.poll(() => failed.length).toBeGreaterThan(0)
  await expect(page.locator('.sequence-poster')).toHaveAttribute('src', '/media/mobile-static.webp')
})

test('gallery keyboard navigation and concept booking dialog work', async ({ page }) => {
  await page.goto('/')
  const firstImage = page.getByRole('button', { name: 'View image: Out where the road opens up.' })
  await firstImage.click()
  await expect(page.getByRole('dialog', { name: 'Gallery' })).toBeVisible()
  await page.keyboard.press('ArrowRight')
  await expect(page.locator('.lightbox figcaption')).toHaveText('A lasting impression.')
  await page.keyboard.press('Escape')
  await expect(firstImage).toBeFocused()
  await page.locator('#drive').getByRole('button', { name: 'Book a drive' }).click()
  await expect(page.getByRole('dialog', { name: 'The journey starts here.' })).toBeVisible()
  await expect(page.getByText('Apex Motors is a fictional automotive concept. Test-drive bookings are not open yet.')).toBeVisible()
  await page.keyboard.press('Escape')
})

test('editorial sections render and detail selection changes the visual', async ({ page }) => {
  await page.goto('/')
  for (const id of ['model', 'experience', 'gallery', 'drive']) {
    const section = page.locator(`#${id}`)
    await section.scrollIntoViewIfNeeded()
    for (const image of await section.locator('img').all()) {
      await expect.poll(() => image.evaluate((element: HTMLImageElement) => element.complete && element.naturalWidth > 0)).toBeTruthy()
    }
    await expect.poll(() => section.locator('[data-reveal]').evaluateAll((elements) => elements.every((element) => Number(getComputedStyle(element).opacity) === 1))).toBeTruthy()
    await section.screenshot({ path: `test-results/section-${id}.png`, animations: 'disabled' })
  }
  await page.getByRole('button', { name: 'Interior', exact: true }).click()
  await expect(page.getByRole('button', { name: 'Interior', exact: true })).toHaveAttribute('aria-expanded', 'true')
  await expect(page.locator('.detail-visual.is-active img')).toHaveAttribute('src', '/media/detail-interior.webp')
})

test('page and open mobile menu pass accessibility checks', async ({ page }) => {
  await page.goto('/')
  await expect(page.locator('.sequence-canvas')).toHaveAttribute('data-frame', '0')
  const desktop = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa']).analyze()
  expect(desktop.violations).toEqual([])
  await page.setViewportSize({ width: 390, height: 844 })
  await page.getByRole('button', { name: 'Open navigation menu' }).click()
  const mobile = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa']).analyze()
  expect(mobile.violations).toEqual([])
})
