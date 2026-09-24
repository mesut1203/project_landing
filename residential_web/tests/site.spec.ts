import { expect, test } from '@playwright/test'
import type { Page } from '@playwright/test'
import AxeBuilder from '@axe-core/playwright'

async function enter(page: Page) {
  await page.goto('/', { waitUntil: 'domcontentloaded' })
  await expect(page.locator('#hero-title')).toBeVisible()
  await expect(page.locator('#top')).not.toHaveAttribute('inert')
}

test('desktop opens immediately and scrolls through still images without video', async ({ page }) => {
  const media: string[] = []
  const errors: string[] = []
  page.on('request', request => { if (/\/(images|videos)\//.test(request.url())) media.push(request.url()) })
  page.on('pageerror', error => errors.push(error.message))
  await enter(page)
  await expect(page.locator('video, canvas')).toHaveCount(0)
  await expect(page.locator('.story-section')).toHaveCount(4)
  const image = page.locator('.story-image').first()
  await expect.poll(() => image.evaluate((img: HTMLImageElement) => img.naturalWidth)).toBeGreaterThan(0)
  const before = (await image.boundingBox())!
  await page.evaluate(() => window.scrollTo({ top: 250, behavior: 'instant' }))
  await expect.poll(async () => before.y - (await image.boundingBox())!.y).toBeCloseTo(250, 0)
  for (const title of ['Space, considered.', 'Designed for everyday light.', 'Live with a wider view.']) {
    const heading = page.getByRole('heading', { name: title, exact: true })
    await heading.scrollIntoViewIfNeeded()
    await expect(heading).toBeInViewport()
  }
  expect(media.some(url => /\/mobile\/|\.mp4/.test(url))).toBe(false)
  expect(errors).toEqual([])
  await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' }))
  await page.getByRole('link', { name: 'Explore residences', exact: true }).click()
  await expect(page.locator('#residences')).toBeFocused()
})

test('reduced motion exposes every section without animations', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' })
  const videos: string[] = []
  page.on('request', request => { if (request.url().includes('.mp4')) videos.push(request.url()) })
  await page.goto('/')
  await expect(page.locator('video')).toHaveCount(0)
  await expect(page.locator('.story-section')).toHaveCount(4)
  await expect(page.getByRole('heading', { name: 'Live with a wider view.' })).toBeVisible()
  await page.getByRole('heading', { name: 'Live with a wider view.' }).scrollIntoViewIfNeeded()
  expect(await page.evaluate(() => document.getAnimations().length)).toBe(0)
  expect(videos).toEqual([])
  const audit = await new AxeBuilder({ page }).analyze()
  expect(audit.violations).toEqual([])
})

test('changing reduced motion keeps content and links accessible', async ({ page }) => {
  await enter(page)
  await page.locator('#lobby-title').scrollIntoViewIfNeeded()
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await expect.poll(() => page.evaluate(() => document.getAnimations().length)).toBe(0)
  await expect(page.locator('.story-section')).toHaveCount(4)
  await expect(page.locator('#lobby-title')).toBeVisible()
  expect(await page.evaluate(() => document.body.style.overflow)).not.toBe('hidden')
  await page.emulateMedia({ reducedMotion: 'no-preference' })
  await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' }))
  await page.locator('.story-actions').getByRole('link', { name: 'Book a private viewing' }).click()
  await expect(page).toHaveURL(/#visit$/)
})

test('form validates and confirms only a local demo', async ({ page }) => {
  const outgoing: string[] = []
  page.on('request', request => { if (request.method() === 'POST') outgoing.push(request.url()) })
  await page.goto('/#visit')
  await page.getByLabel('Name', { exact: true }).fill('Luma Visitor')
  await page.getByLabel('Email', { exact: true }).fill('visitor@example.com')
  await page.getByLabel('Preferred viewing date').fill('2099-12-01')
  await page.getByRole('button', { name: 'Book a private viewing', exact: true }).click()
  await expect(page.locator('#visit').getByRole('status')).toContainText('no viewing has been booked')
  await expect(page.getByText('Demo form. Connect a CRM or booking service to receive submissions.')).toBeVisible()
  expect(outgoing).toEqual([])
  await expect(page.getByLabel('Name', { exact: true })).toHaveValue('')
  const audit = await new AxeBuilder({ page }).include('#visit').analyze()
  expect(audit.violations).toEqual([])
})

test.describe('mobile', () => {
  test.use({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true, deviceScaleFactor: 3 })

  test('portrait assets only, accessible menu and native navigation', async ({ page }) => {
    const media: string[] = []
    page.on('request', request => { if (/\/(images|videos)\//.test(request.url())) media.push(request.url()) })
    await enter(page)
    await expect(page.locator('video')).toHaveCount(0)
    await expect.poll(() => page.locator('.story-image').first().evaluate((img: HTMLImageElement) => img.naturalWidth > 0 && img.naturalWidth < img.naturalHeight)).toBe(true)
    const trigger = page.getByRole('button', { name: 'Open menu' })
    await trigger.click()
    const dialog = page.getByRole('dialog')
    await expect(dialog.getByRole('link', { name: 'Residences', exact: true })).toBeFocused()
    await page.keyboard.press('ArrowDown')
    await expect(dialog.getByRole('link', { name: 'Architecture', exact: true })).toBeFocused()
    await page.keyboard.press('Escape')
    await expect(dialog).not.toBeVisible()
    await expect(trigger).toBeFocused()
    await trigger.click()
    for (let i = 0; i < 10; i++) {
      await page.keyboard.press('Tab')
      expect(await page.evaluate(() => document.getElementById('mobile-menu')!.contains(document.activeElement))).toBe(true)
    }
    const audit = await new AxeBuilder({ page }).analyze()
    expect(audit.violations).toEqual([])
    await page.keyboard.press('Escape')
    await page.locator('#residence-title').scrollIntoViewIfNeeded()
    await expect(page.locator('#residence-title')).toBeInViewport()
    await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' }))
    await page.screenshot({ path: 'tmp/mobile-hero.png' })
    await page.getByRole('link', { name: 'Explore residences', exact: true }).click()
    await expect(page.locator('#residences')).toBeFocused()
    await page.locator('footer').scrollIntoViewIfNeeded()
    expect(media.some(url => /\/desktop\/|\.mp4/.test(url))).toBe(false)
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true)
  })
})

for (const width of [320, 375, 390, 768, 1024, 1440, 1920]) {
  test(`responsive layout ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 })
    await page.goto('/#top')
    for (const image of await page.locator('.story-image').all()) {
      const bounds = await image.boundingBox()
      expect(bounds?.width).toBeGreaterThan(200)
      expect(bounds?.height).toBeGreaterThan(120)
    }
    for (const id of ['top', 'residences', 'architecture', 'amenities', 'visit']) {
      await page.locator(`#${id}`).scrollIntoViewIfNeeded()
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true)
    }
  })
}
