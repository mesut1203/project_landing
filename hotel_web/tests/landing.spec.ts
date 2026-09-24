import { test, expect } from '@playwright/test'
import { mkdir } from 'node:fs/promises'

const screenshotDir = '.tmp/screenshots'
test.beforeAll(async () => { await mkdir(screenshotDir, { recursive: true }) })

test('static arrival scrolls naturally without sequence requests and keeps all content', async ({ page }) => {
  const frames: string[] = []
  const errors: string[] = []
  page.on('request', (request) => { if (request.url().includes('/media/story/')) frames.push(request.url()) })
  page.on('pageerror', (error) => errors.push(error.message))
  await page.goto('/')
  await page.evaluate(() => document.fonts.ready)
  await expect.poll(() => page.locator('.hero-image img').evaluate((image: HTMLImageElement) => image.naturalWidth)).toBeGreaterThan(0)
  await expect(page.locator('canvas, .story-track, .story-stage')).toHaveCount(0)
  await page.screenshot({ path: screenshotDir + '/desktop-hero.png' })
  const before = await page.locator('.hero').boundingBox()
  await page.evaluate(() => window.scrollTo(0, 300))
  const after = await page.locator('.hero').boundingBox()
  expect(before!.y - after!.y).toBeCloseTo(300, 0)
  for (const heading of ['Arrive slowly.', 'Step into stillness.', 'Make room for ease.', 'Stay for the view.']) {
    await expect(page.getByRole('heading', { name: heading })).toBeVisible()
  }
  await page.getByRole('link', { name: 'Explore the rooms' }).click()
  await expect(page).toHaveURL(/#rooms$/)
  await expect(page.locator('#rooms')).toBeFocused()
  for (const id of ['rooms', 'dining', 'experiences', 'booking']) {
    await page.locator('#' + id).scrollIntoViewIfNeeded()
    await expect(page.getByRole('heading').filter({ hasText: id === 'rooms' ? 'A room to exhale.' : id === 'dining' ? 'Dinner, unhurried.' : id === 'experiences' ? 'The coast, at your pace.' : 'Your stay begins here.' })).toBeVisible()
  }
  expect(frames).toEqual([])
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

test('date errors identify only the affected fields and clear after correction', async ({ page }) => {
  await page.goto('/#booking')
  const arrival = page.locator('#check-in')
  const departure = page.locator('#check-out')
  const submit = page.getByRole('button', { name: 'Check availability' })
  for (const [checkIn, checkOut, invalidIn, invalidOut] of [
    ['', '', true, true],
    ['', '2099-06-23', true, false],
    ['2099-06-20', '', false, true],
    ['2020-01-01', '2099-06-23', true, false],
    ['2099-06-20', '2099-06-20', false, true],
    ['2099-06-20', '2099-06-19', false, true],
  ] as const) {
    await arrival.fill(checkIn)
    await departure.fill(checkOut)
    await submit.click()
    for (const [field, invalid] of [[arrival, invalidIn], [departure, invalidOut]] as const) {
      if (invalid) {
        await expect(field).toHaveAttribute('aria-invalid', 'true')
        await expect(field).toHaveAttribute('aria-describedby', 'booking-message')
      } else {
        await expect(field).not.toHaveAttribute('aria-invalid', 'true')
        await expect(field).not.toHaveAttribute('aria-describedby', 'booking-message')
      }
    }
    await expect(invalidIn ? arrival : departure).toBeFocused()
  }
  await departure.fill('2099-06-23')
  await expect(page.locator('[aria-invalid="true"]')).toHaveCount(0)
  await expect(page.locator('#booking-message')).toBeEmpty()
  await submit.click()
  await expect(page.locator('#booking-message')).toContainText('no booking has been made')
  await expect(page.locator('[aria-invalid="true"]')).toHaveCount(0)
})

test('experience tabs support keyboard navigation', async ({ page }) => {
  await page.goto('/#experiences')
  const tabs = page.getByRole('tab')
  await tabs.nth(0).focus()
  await page.keyboard.press('ArrowDown')
  await expect(tabs.nth(1)).toBeFocused()
  await expect(tabs.nth(1)).toHaveAttribute('aria-selected', 'true')
  await expect(page.locator('#panel-restore')).toBeVisible()
  await expect.poll(() => page.locator('#panel-restore img').evaluate((image: HTMLImageElement) => image.naturalWidth)).toBeGreaterThan(0)
  await page.keyboard.press('End')
  await expect(tabs.nth(2)).toBeFocused()
  await expect(page.locator('#panel-rooftop')).toBeVisible()
  await page.keyboard.press('Home')
  await expect(tabs.nth(0)).toBeFocused()
})


test('mobile and landscape fit the screen and support menu navigation', async ({ page }) => {
  for (const viewport of [{ width: 375, height: 812 }, { width: 320, height: 568 }, { width: 844, height: 390 }, { width: 768, height: 1024 }]) {
    await page.setViewportSize(viewport)
    await page.goto('/')
    await page.evaluate(() => document.fonts.ready)
    await expect.poll(() => page.locator('.hero-image img').evaluate((image: HTMLImageElement) => image.naturalWidth)).toBeGreaterThan(0)
    await expect.poll(() => page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth)).toBeLessThanOrEqual(0)
    await page.screenshot({ path: screenshotDir + '/viewport-' + viewport.width + '.png' })
    if (viewport.width < 768) {
      await expect(page.locator('.media-depth, .media-curtain')).toHaveCount(0)
      await expect(page.locator('.arrival-word')).toHaveCount(2)
      await page.getByRole('button', { name: 'Open menu' }).click()
      await expect(page.getByRole('navigation', { name: 'Mobile navigation' })).toBeVisible()
      await page.keyboard.press('Escape')
      await expect(page.getByRole('button', { name: 'Open menu' })).toBeFocused()
    }
    await page.getByRole('link', { name: 'Explore the rooms' }).click()
    await expect(page.locator('#rooms')).toBeFocused()
  }
})

test('reduced motion keeps the same content and disables motion, including preference changes', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await page.goto('/')
  for (const preference of ['reduce', 'no-preference', 'reduce'] as const) {
    const roomLink = page.locator('.room-photo-link').first()
    await roomLink.focus()
    await page.emulateMedia({ reducedMotion: preference })
    await expect(roomLink).toBeFocused()
    await page.locator('#rooms').scrollIntoViewIfNeeded()
    await expect(page.getByRole('heading', { name: 'Arrive slowly.' })).toBeVisible()
    await expect(page.locator('canvas, .story-track')).toHaveCount(0)
    if (preference === 'reduce') {
      await expect.poll(() => page.locator('.rooms-intro').evaluate((element) => getComputedStyle(element).transform)).toBe('none')
      await expect(page.locator('.room-photo-link img').first()).toHaveCSS('transition-duration', '0s')
      await expect(page.locator('.media-depth, .media-curtain, .arrival-word')).toHaveCount(0)
    }
  }
})

test('failed photos keep the arrival content and booking usable', async ({ page }) => {
  await page.route('**/media/**', (route) => route.abort())
  await page.goto('/')
  await expect(page.locator('.hero .media-error')).toBeVisible()
  await expect(page.getByRole('heading', { name: 'Arrive slowly.' })).toBeVisible()
  await page.getByRole('link', { name: 'Explore the rooms' }).click()
  await expect(page.locator('.room-1 .media-error')).toBeVisible()
  await page.locator('#booking').scrollIntoViewIfNeeded()
  await expect(page.getByRole('button', { name: 'Check availability' })).toBeVisible()
})


test('every photographic placement has its own source image', async ({ page }) => {
  await page.goto('/')
  const sources = await page.locator('main img').evaluateAll(images => images.map(image => (image as HTMLImageElement).src))
  expect(sources).toHaveLength(11)
  expect(new Set(sources).size).toBe(sources.length)
})
