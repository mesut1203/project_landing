import { test, expect } from '@playwright/test'
import { mkdir } from 'node:fs/promises'
import type { Page } from '@playwright/test'

const screenshotDir = '.tmp/screenshots'
const settle = async (page: Page) => {
  await page.evaluate(() => document.fonts.ready)
  await expect(page.locator('.sequence-canvas')).toHaveAttribute('data-frame', /\d+/)
}
const moveStory = async (page: Page, progress: number) => {
  await page.evaluate((p) => {
    const track = document.querySelector('.story-track')!
    const stage = document.querySelector('.story-stage')!
    window.scrollTo(0, track.getBoundingClientRect().top + window.scrollY + (track.clientHeight - stage.clientHeight) * p)
  }, progress)
  await expect.poll(async () => Number(await page.locator('canvas').getAttribute('data-frame'))).toBeGreaterThanOrEqual(Math.round(progress * 169) - 2)
  await expect.poll(async () => Number(await page.locator('canvas').getAttribute('data-frame'))).toBeLessThanOrEqual(Math.round(progress * 169) + 4)
}

test.beforeAll(async () => { await mkdir(screenshotDir, { recursive: true }) })

test('desktop story follows native scrolling in both directions and preserves scene handoffs', async ({ page }) => {
  const errors: string[] = []
  page.on('pageerror', (error) => errors.push(error.message))
  await page.goto('/')
  await settle(page)
  await expect(page.getByRole('heading', { name: 'Arrive slowly.' })).toBeVisible()
  await page.screenshot({ path: `${screenshotDir}/desktop-hero.png` })
  for (const p of [0.22, 0.24, 0.52, 0.54, 0.8, 0.82, 1]) {
    await moveStory(page, p)
    await page.screenshot({ path: `${screenshotDir}/story-${p}.png` })
  }
  await expect(page.getByRole('link', { name: 'Reserve your stay', exact: true })).toBeVisible()
  await moveStory(page, 0.35)
  await expect(page.getByRole('heading', { name: 'Step into stillness.' })).toBeVisible()
  await moveStory(page, 0)
  await expect.poll(async () => Number(await page.locator('canvas').getAttribute('data-cache-size'))).toBeLessThanOrEqual(30)
  await page.getByRole('link', { name: 'Skip experience' }).click()
  await expect(page).toHaveURL(/#rooms$/)
  await expect(page.locator('#rooms')).toBeFocused()
  for (const id of ['rooms', 'dining', 'experiences', 'booking']) {
    await page.locator(`#${id}`).scrollIntoViewIfNeeded()
    await page.locator(`#${id} img`).evaluateAll(async (imgs) => { await Promise.all(imgs.filter((img) => (img as HTMLElement).offsetParent !== null).map((img) => (img as HTMLImageElement).decode().catch(() => {}))) })
    await page.waitForTimeout(1000)
    await page.locator(`#${id}`).screenshot({ path: `${screenshotDir}/desktop-${id}.png` })
  }
  await expect.poll(() => page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth)).toBeLessThanOrEqual(0)
  expect(errors).toEqual([])
})

test('booking demo validates dates and submits locally without sending data', async ({ page }) => {
  await page.goto('/#booking')
  await page.getByRole('button', { name: 'Check availability' }).click()
  await expect(page.locator('#booking-message')).toContainText('Please choose')
  await expect(page.locator('#check-in')).toBeFocused()
  await page.locator('#check-in').fill('2020-01-01')
  await page.locator('#check-out').fill('2020-01-02')
  await page.getByRole('button', { name: 'Check availability' }).click()
  await expect(page.locator('#booking-message')).toContainText('today or later')
  await page.locator('#check-in').fill('2099-06-20')
  await page.locator('#check-out').fill('2099-06-19')
  await page.getByRole('button', { name: 'Check availability' }).click()
  await expect(page.locator('#booking-message')).toContainText('after check-in')
  await page.locator('#check-out').fill('2099-06-23')
  await page.locator('#guests').selectOption('3')
  const submissions: string[] = []
  page.on('request', (request) => { if (request.method() === 'POST') submissions.push(request.url()) })
  await page.getByRole('button', { name: 'Check availability' }).click()
  await expect(page.locator('#booking-message')).toContainText('no booking has been made')
  await expect(page.locator('#booking-note')).toHaveText('Demo form. Connect a booking service to receive submissions.')
  expect(submissions).toEqual([])
})

test('experience tabs support keyboard navigation', async ({ page }) => {
  await page.goto('/#experiences')
  const tabs = page.getByRole('tab')
  await tabs.nth(0).focus()
  await page.keyboard.press('ArrowDown')
  await expect(tabs.nth(1)).toBeFocused()
  await expect(tabs.nth(1)).toHaveAttribute('aria-selected', 'true')
  await expect(page.locator('#panel-restore')).toBeVisible()
  await expect(page.locator('#panel-restore img')).toHaveJSProperty('naturalWidth', 1200)
  await page.keyboard.press('End')
  await expect(tabs.nth(2)).toBeFocused()
  await expect(page.locator('#panel-rooftop')).toBeVisible()
  await page.keyboard.press('Home')
  await expect(tabs.nth(0)).toBeFocused()
})

test('mobile keeps the full sequence frame, fits the screen, and supports menu and fast scroll', async ({ page, context }) => {
  await page.setViewportSize({ width: 390, height: 844 })
  await page.goto('/')
  await settle(page)
  await page.screenshot({ path: `${screenshotDir}/mobile-hero.png` })
  const media = await page.locator('.sequence-media').boundingBox()
  expect(media!.width / media!.height).toBeCloseTo(16 / 9, 1)
  await page.getByRole('button', { name: 'Open menu' }).click()
  await expect(page.getByRole('navigation', { name: 'Mobile navigation' })).toBeVisible()
  await page.keyboard.press('Escape')
  await expect(page.getByRole('button', { name: 'Open menu' })).toBeFocused()
  const session = await context.newCDPSession(page)
  await session.send('Emulation.setCPUThrottlingRate', { rate: 4 })
  await moveStory(page, 0.96)
  await moveStory(page, 0.13)
  await session.send('Emulation.setCPUThrottlingRate', { rate: 1 })
  await expect.poll(async () => Number(await page.locator('canvas').getAttribute('data-cache-size'))).toBeLessThanOrEqual(18)
  for (const id of ['rooms', 'experiences', 'booking']) {
    await page.locator(`#${id}`).scrollIntoViewIfNeeded()
    await page.waitForTimeout(1000)
    await page.locator(`#${id}`).screenshot({ path: `${screenshotDir}/mobile-${id}.png` })
  }
  for (const viewport of [{ width: 320, height: 568 }, { width: 844, height: 390 }]) {
    await page.setViewportSize(viewport)
    await page.goto('/')
    await settle(page)
    await expect.poll(() => page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth)).toBeLessThanOrEqual(0)
    const skip = await page.getByRole('link', { name: 'Skip experience' }).boundingBox()
    expect(skip!.y + skip!.height).toBeLessThanOrEqual(viewport.height)
    await moveStory(page, 0.65)
    const copy = await page.locator('.scene-copy-2').boundingBox()
    const chapters = await page.locator('.story-bottom').boundingBox()
    expect(copy!.y + copy!.height).toBeLessThan(chapters!.y)
    await moveStory(page, 0)
    await page.screenshot({ path: `${screenshotDir}/mobile-${viewport.width}.png` })
  }
})

test('reduced motion shows the final still and all copy in normal flow, without loading the sequence', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' })
  const frames: string[] = []
  page.on('request', (request) => { if (request.url().includes('/media/story/')) frames.push(request.url()) })
  await page.goto('/')
  await expect(page.locator('canvas')).toHaveCount(0)
  await expect(page.locator('.story-track')).toHaveCount(0)
  for (const heading of ['Arrive slowly.', 'Step into stillness.', 'Make room for ease.', 'Stay for the view.']) await expect(page.getByRole('heading', { name: heading })).toBeVisible()
  await expect(page.locator('.static-story-image img')).toHaveAttribute('src', /frame-170/)
  expect(frames.every((url) => url.includes('frame-170'))).toBeTruthy()
  await page.locator('.static-story').screenshot({ path: `${screenshotDir}/reduced-motion.png` })
  await page.emulateMedia({ reducedMotion: 'no-preference' })
  await settle(page)
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await expect(page.locator('canvas')).toHaveCount(0)
})

test('failed sequence and photos keep the content and booking usable', async ({ page }) => {
  await page.route('**/media/**', (route) => route.abort())
  await page.goto('/')
  await expect(page.getByText('Enjoy a still moment. The moving experience is unavailable.')).toBeVisible()
  await expect(page.getByRole('heading', { name: 'Arrive slowly.' })).toBeVisible()
  await page.getByRole('link', { name: 'Skip experience' }).click()
  await expect(page.locator('.room-1 .media-error')).toBeVisible()
  await page.locator('#booking').scrollIntoViewIfNeeded()
  await expect(page.getByRole('button', { name: 'Check availability' })).toBeVisible()
})
