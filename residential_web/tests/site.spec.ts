import { expect, test } from '@playwright/test'
import type { Page } from '@playwright/test'
import AxeBuilder from '@axe-core/playwright'

async function enter(page: Page) {
  await page.goto('/', { waitUntil: 'domcontentloaded' })
  await page.locator('#top').waitFor({ state: 'attached' })
  const skip = page.getByRole('button', { name: 'Skip intro' })
  if (await skip.isVisible()) await skip.click()
  await expect(page.locator('.video-intro')).toHaveCount(0)
  await expect(page.locator('#top')).not.toHaveAttribute('inert')
}

async function storyProgress(page: Page, progress: number) {
  await page.evaluate(value => {
    const story = document.querySelector<HTMLElement>('.scroll-story')!
    const top = story.getBoundingClientRect().top + window.scrollY
    window.scrollTo({ top: top + (story.offsetHeight - window.innerHeight) * value, behavior: 'instant' })
  }, progress)
}

test('intro plays once, fades for 700ms and releases the page', async ({ page }) => {
  await page.goto('/')
  const video = page.locator('.intro-video')
  await expect(video).toBeVisible()
  await expect.poll(() => video.evaluate((v: HTMLVideoElement) => v.currentTime)).toBeGreaterThan(0.1)
  expect(await video.evaluate((v: HTMLVideoElement) => ({ muted: v.muted, loop: v.loop, inline: v.playsInline }))).toEqual({ muted: true, loop: false, inline: true })
  await video.evaluate((v: HTMLVideoElement) => { v.currentTime = v.duration - 0.2 })
  await expect(page.locator('.video-intro')).toHaveClass(/is-exiting/)
  expect(await page.locator('.video-intro').evaluate(el => getComputedStyle(el).transitionDuration)).toBe('0.7s')
  await expect(page.locator('.video-intro')).toHaveCount(0)
  await expect(page.locator('#top')).not.toHaveAttribute('inert')
})

test('desktop scrubs the supplied film forward and backward', async ({ page }) => {
  const media: string[] = []
  const errors: string[] = []
  page.on('request', request => { if (/\/(images|videos)\//.test(request.url())) media.push(request.url()) })
  page.on('pageerror', error => errors.push(error.message))
  await enter(page)
  const video = page.locator('.story-video')
  await expect(video).toHaveClass(/is-ready/)
  expect(await video.evaluate((v: HTMLVideoElement) => v.seekable.end(0))).toBeGreaterThan(10)
  for (const [progress, scene] of [[0.16, 'arrival'], [0.4, 'lobby'], [0.61, 'residence'], [0.9, 'balcony'], [0.38, 'lobby'], [0.03, 'arrival']] as const) {
    await storyProgress(page, progress)
    await expect(page.locator('.scroll-story')).toHaveAttribute('data-active-scene', scene)
    await expect.poll(() => video.evaluate((v: HTMLVideoElement) => v.currentTime)).toBeCloseTo(progress * 13.79, 0)
  }
  expect(media.some(url => /\/mobile\/|-portrait\.mp4/.test(url))).toBe(false)
  expect(errors).toEqual([])
  await page.screenshot({ path: 'tmp/desktop-hero.png' })
})

test('video errors fall back to posters without trapping focus', async ({ page }) => {
  await page.route('**/*.mp4', route => route.abort('failed'))
  await page.goto('/')
  await expect(page.locator('.video-intro')).toHaveCount(0)
  await expect(page.locator('#top')).not.toHaveAttribute('inert')
  await expect(page.locator('.scene-poster').first()).toBeVisible()
  await page.getByRole('link', { name: 'Skip story', exact: true }).click()
  await expect(page.locator('#residences')).toBeFocused()
})

test('slow video gives way to page after loading timeout', async ({ page }) => {
  await page.route('**/*.mp4', async route => { await new Promise(resolve => setTimeout(resolve, 6500)); await route.abort() })
  await page.goto('/')
  await expect(page.locator('.video-intro')).toBeVisible()
  await expect(page.locator('.video-intro')).toHaveCount(0, { timeout: 6000 })
  await expect(page.locator('#top')).not.toHaveAttribute('inert')
})

test('reduced motion loads no video and exposes every story scene', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' })
  const videos: string[] = []
  page.on('request', request => { if (request.url().includes('.mp4')) videos.push(request.url()) })
  await page.goto('/')
  await expect(page.locator('.video-intro')).toHaveCount(0)
  await expect(page.locator('.static-scene')).toHaveCount(4)
  await expect(page.getByRole('heading', { name: 'Live with a wider view.' })).toBeVisible()
  expect(videos).toEqual([])
  const audit = await new AxeBuilder({ page }).analyze()
  expect(audit.violations).toEqual([])
})

test('changing reduced motion during intro unlocks content', async ({ page }) => {
  await page.goto('/')
  await expect(page.locator('.video-intro')).toBeVisible()
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await expect(page.locator('.video-intro')).toHaveCount(0)
  await expect(page.locator('.static-scene')).toHaveCount(4)
  expect(await page.evaluate(() => document.body.style.overflow)).not.toBe('hidden')
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

  test('portrait assets only, accessible menu and native story navigation', async ({ page }) => {
    const media: string[] = []
    page.on('request', request => { if (/\/(images|videos)\//.test(request.url())) media.push(request.url()) })
    await enter(page)
    await expect(page.locator('.story-video')).toHaveCount(0)
    expect(await page.locator('.scene-poster').first().evaluate((img: HTMLImageElement) => img.naturalWidth < img.naturalHeight)).toBe(true)
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
    await storyProgress(page, 0.62)
    await expect(page.locator('.scroll-story')).toHaveAttribute('data-active-scene', 'residence')
    await storyProgress(page, 0)
    await expect(page.locator('.scroll-story')).toHaveAttribute('data-active-scene', 'arrival')
    await page.screenshot({ path: 'tmp/mobile-hero.png' })
    await page.getByRole('link', { name: 'Skip story', exact: true }).click()
    await expect(page.locator('#residences')).toBeFocused()
    await page.locator('footer').scrollIntoViewIfNeeded()
    expect(media.some(url => /\/desktop\/|\/real-estate-intro\.mp4/.test(url))).toBe(false)
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true)
  })
})

for (const width of [320, 390, 768, 1024, 1440, 1920]) {
  test(`responsive layout ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 })
    await page.goto('/#top')
    for (const id of ['top', 'residences', 'architecture', 'amenities', 'visit']) {
      await page.locator(`#${id}`).scrollIntoViewIfNeeded()
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true)
    }
  })
}
