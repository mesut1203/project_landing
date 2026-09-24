import { test, expect } from '@playwright/test'
import AxeBuilder from '@axe-core/playwright'
import { hero } from '../src/data/content'

test('landing opens immediately and scrolls naturally without loading an intro', async ({ page }) => {
  const introRequests: string[] = []
  const errors: string[] = []
  page.on('request', (request) => { if (/sequence|\.mp4|ScrollTrigger|gsap/i.test(request.url())) introRequests.push(request.url()) })
  page.on('pageerror', (error) => errors.push(error.message))
  await page.goto('/')
  await expect(page.getByRole('heading', { name: 'Built for the long way.', level: 1 })).toBeInViewport()
  await expect(page.locator('.hero').getByRole('link', { name: 'Explore the model' })).toBeInViewport()
  await expect(page.locator('.hero-image')).toHaveJSProperty('complete', true)
  await expect(page.locator('video, canvas, .skip-story, .sequence-status')).toHaveCount(0)
  expect(await page.locator('#model').evaluate((element) => element.getBoundingClientRect().top < innerHeight * 1.5)).toBeTruthy()
  await page.screenshot({ path: 'test-results/desktop-hero.png' })
  await page.locator('.hero').getByRole('link', { name: 'Explore the model' }).click()
  await expect(page.locator('#model')).toBeFocused()
  await expect.poll(() => page.locator('#model').evaluate((element) => Math.round(element.getBoundingClientRect().top))).toBe(100)
  await expect(page.locator('.hero-heading')).not.toBeInViewport()
  await page.locator('#drive').scrollIntoViewIfNeeded()
  await page.getByRole('link', { name: 'Back to top' }).click()
  await expect(page.locator('#top')).toBeFocused()
  await expect(page.locator('.hero-heading')).toBeInViewport()
  expect(introRequests).toEqual([])
  expect(errors).toEqual([])
})

for (const [width, height] of [[320, 568], [375, 667], [390, 844], [430, 932], [768, 1024], [844, 390]]) {
  test('responsive layout ' + width + 'x' + height + ' has no overflow and keeps navigation visible', async ({ page }) => {
    await page.setViewportSize({ width, height })
    const introRequests: string[] = []
    page.on('request', (request) => { if (/sequence|\.mp4/i.test(request.url())) introRequests.push(request.url()) })
    await page.goto('/')
    await expect(page.locator('h1')).toBeVisible()
    await expect(page.locator('.hero-image')).toHaveJSProperty('complete', true)
    await page.evaluate(() => document.fonts.ready)
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBeTruthy()
    if (width < 768) {
      await expect(page.getByRole('button', { name: 'Open navigation menu' })).toBeVisible()
      await expect(page.locator('.hero .action')).toBeInViewport()
    }
    await expect(page.locator('video, canvas')).toHaveCount(0)
    expect(introRequests).toEqual([])
    await page.screenshot({ path: 'test-results/viewport-' + width + 'x' + height + '.png' })
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

test('reduced motion keeps the same static landing on load and when toggled', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await page.goto('/')
  await expect(page.locator('.hero-image')).toHaveAttribute('src', hero.image.src)
  await expect(page.locator('h1')).toBeInViewport()
  const heroHeight = await page.locator('.hero').evaluate((element) => element.getBoundingClientRect().height)
  await page.locator('.hero .action').click()
  await expect(page.locator('#model')).toBeFocused()
  await page.emulateMedia({ reducedMotion: 'no-preference' })
  expect(await page.locator('.hero').evaluate((element) => element.getBoundingClientRect().height)).toBe(heroHeight)
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await expect(page.locator('.action').first()).toHaveCSS('transition-duration', '0s')
  await expect(page.locator('video, canvas')).toHaveCount(0)
})

test('touch phone keeps a usable landing after landscape rotation', async ({ browser }) => {
  const context = await browser.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true })
  const page = await context.newPage()
  await page.goto('http://127.0.0.1:5173/')
  await page.setViewportSize({ width: 844, height: 390 })
  await expect(page.getByRole('button', { name: 'Open navigation menu' })).toBeVisible()
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBeTruthy()
  await expect(page.locator('.hero .action')).toBeInViewport()
  await expect(page.locator('.hero-image')).toBeInViewport()
  await page.screenshot({ path: 'test-results/phone-rotated.png' })
  await context.close()
})

test('unavailable hero image leaves the headline and CTA usable', async ({ page }) => {
  await page.route('**/media/ignition-desktop.webp', (route) => route.abort())
  await page.goto('/')
  await expect(page.locator('.hero .image-unavailable')).toBeVisible()
  await expect(page.locator('h1')).toBeInViewport()
  await page.locator('.hero .action').click()
  await expect(page.locator('#model')).toBeFocused()
})

test('skip link reaches main content and enlarged text remains readable on mobile', async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 667 })
  await page.goto('/')
  await page.keyboard.press('Tab')
  await expect(page.getByRole('link', { name: 'Skip to content' })).toBeFocused()
  await page.keyboard.press('Enter')
  await expect(page.locator('main')).toBeFocused()
  await page.addStyleTag({ content: 'html { font-size: 200%; }' })
  await expect(page.locator('h1')).toBeVisible()
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBeTruthy()
  expect(await page.locator('.hero-copy').evaluate((element) => element.scrollHeight <= element.clientHeight)).toBeTruthy()
  await page.locator('.hero .action').click()
  await expect(page.locator('#model')).toBeFocused()
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
    await section.screenshot({ path: `test-results/section-${id}.png`, animations: 'disabled' })
  }
  await page.getByRole('button', { name: 'Interior', exact: true }).click()
  await expect(page.getByRole('button', { name: 'Interior', exact: true })).toHaveAttribute('aria-expanded', 'true')
  await expect(page.locator('.detail-visual.is-active img')).toHaveAttribute('src', '/media/detail-interior.webp')
})

test('page and open mobile menu pass accessibility checks', async ({ page }) => {
  await page.goto('/')
  await expect(page.locator('.hero-image')).toBeVisible()
  const desktop = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa']).analyze()
  expect(desktop.violations).toEqual([])
  await page.setViewportSize({ width: 390, height: 844 })
  await page.getByRole('button', { name: 'Open navigation menu' }).click()
  const mobile = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa']).analyze()
  expect(mobile.violations).toEqual([])
})
