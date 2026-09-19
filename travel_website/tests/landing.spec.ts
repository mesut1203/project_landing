import { expect, test } from '@playwright/test'

for (const width of [1440, 375]) {
  test(`scroll film tracks forwards and backwards at ${width}px`, async ({
    page,
  }) => {
    await page.setViewportSize({ width, height: 900 })
    const errors: string[] = []
    page.on('pageerror', (error) => errors.push(error.message))
    await page.goto('/')
    const video = page.locator('.hero-video')
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible()
    await expect
      .poll(() =>
        video.evaluate(
          (el: HTMLVideoElement) => el.seekable.length && el.seekable.end(0),
        ),
      )
      .toBeGreaterThan(0)
    expect(await video.getAttribute('src')).toMatch(/^blob:/)
    const scroll = async (progress: number) => {
      await page.evaluate((progress) => {
        const track = document.querySelector('.world-track') as HTMLElement
        const stage = document.querySelector('.world-stage') as HTMLElement
        window.scrollTo(
          0,
          track.offsetTop +
            (track.offsetHeight - stage.offsetHeight) * progress,
        )
      }, progress)
      await expect
        .poll(() => video.evaluate((el: HTMLVideoElement) => el.currentTime))
        .toBeCloseTo(15.9 * progress, 1)
    }
    await scroll(0.25)
    await expect(video).toHaveAttribute('data-painted', 'true')
    await page.screenshot({ path: `.tmp/scroll-quarter-${width}.png` })
    await scroll(0.5)
    await expect(page.getByRole('heading', { level: 1 })).toContainText(
      'Lạc một chút.',
    )
    await page.screenshot({ path: `.tmp/scroll-middle-${width}.png` })
    await scroll(0.95)
    await expect(page.getByRole('heading', { level: 1 })).toContainText(
      'Ngày dài hơn.',
    )
    await page.screenshot({ path: `.tmp/scroll-end-${width}.png` })
    await scroll(0.1)
    await expect(page.getByRole('heading', { level: 1 })).toContainText(
      'Đi xa hơn.',
    )
    await page.getByRole('button', { name: 'Tạm dừng chuyển động' }).click()
    const held = await video.evaluate((el: HTMLVideoElement) => el.currentTime)
    await page.evaluate(() => window.scrollBy(0, 500))
    await page.waitForTimeout(400)
    expect(await video.evaluate((el: HTMLVideoElement) => el.currentTime)).toBe(
      held,
    )
    await page
      .getByRole('button', { name: 'Bật chuyển động theo cuộn' })
      .click()
    await expect
      .poll(() => video.evaluate((el: HTMLVideoElement) => el.currentTime))
      .toBeGreaterThan(held)
    await page.getByRole('button', { name: '03 Tận hưởng' }).click()
    await expect(page.getByRole('heading', { level: 1 })).toContainText(
      'Ngày dài hơn.',
    )
    expect(errors).toEqual([])
  })
}

test('reduced motion uses an immediate poster without downloading video', async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: 'reduce' })
  const mediaRequests: string[] = []
  page.on('request', (request) => {
    if (request.url().includes('travel-scroll.mp4'))
      mediaRequests.push(request.url())
  })
  await page.goto('/')
  await expect(page.locator('.world-poster')).toBeVisible()
  await expect(page.locator('.world-track')).toHaveAttribute(
    'data-reduced',
    'true',
  )
  expect(await page.locator('.hero-video').getAttribute('src')).toBeNull()
  expect(mediaRequests).toEqual([])
  await page.emulateMedia({ reducedMotion: 'no-preference' })
  await expect
    .poll(() =>
      page
        .locator('.hero-video')
        .evaluate((el: HTMLVideoElement) => el.readyState),
    )
    .toBeGreaterThanOrEqual(2)
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await expect(page.locator('.world-track')).toHaveAttribute(
    'data-reduced',
    'true',
  )
  expect(await page.locator('.hero-video').getAttribute('src')).toBeNull()
})

test('failed media retains the poster and working destination navigation', async ({
  page,
}) => {
  await page.route('**/videos/travel-scroll.mp4', (route) => route.abort())
  await page.goto('/')
  await expect(page.locator('.world-media-status')).toBeVisible()
  await expect(page.locator('.world-poster')).toBeVisible()
  await page
    .getByRole('link', { name: 'Tìm hành trình của bạn', exact: true })
    .click()
  await expect(page).toHaveURL(/#destinations$/)
})

test('destination filters and demo form validate and create a local summary', async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await page.goto('/')
  await page.getByRole('button', { name: 'Miền biển', exact: true }).click()
  await expect(page.locator('.destination-card')).toHaveCount(1)
  await page.getByRole('link', { name: 'Chọn hành trình', exact: true }).click()
  await expect(page.getByLabel('Khoảng trời bạn chọn')).toHaveValue('coast')
  await page.getByRole('button', { name: 'Tạo ý tưởng chuyến đi' }).click()
  await expect(page.getByLabel('Tên của bạn')).toBeFocused()
  await expect(page.locator('#name-error')).toBeVisible()
  await page.getByLabel('Tên của bạn').fill('Minh Anh')
  await page.getByLabel('Tháng dự kiến').fill('2020-01')
  await page.getByRole('button', { name: 'Tạo ý tưởng chuyến đi' }).click()
  await expect(page.locator('#month-error')).toBeVisible()
  await page.getByLabel('Tháng dự kiến').fill('')
  const requests: string[] = []
  page.on('request', (request) => {
    if (request.method() === 'POST') requests.push(request.url())
  })
  await page.getByRole('button', { name: 'Tạo ý tưởng chuyến đi' }).click()
  await expect(page.locator('.trip-summary')).toContainText('Minh Anh')
  await expect(page.locator('.trip-summary')).toContainText('Về phía biển xanh')
  await expect(page.locator('.trip-summary')).toContainText(
    'chưa kết nối dịch vụ booking',
  )
  expect(requests).toEqual([])
})

for (const size of [
  { width: 375, height: 812 },
  { width: 812, height: 375 },
  { width: 768, height: 1024 },
  { width: 1440, height: 900 },
]) {
  test(`responsive layout ${size.width}x${size.height}`, async ({ page }) => {
    await page.setViewportSize(size)
    await page.emulateMedia({ reducedMotion: 'reduce' })
    await page.goto('/')
    for (const section of [
      '#our-story',
      '#destinations',
      '#plan-trip',
      '.footer',
    ])
      await page.locator(section).scrollIntoViewIfNeeded()
    await expect
      .poll(() =>
        page
          .locator('img')
          .evaluateAll((elements) =>
            elements.every(
              (element) =>
                (element as HTMLImageElement).complete &&
                (element as HTMLImageElement).naturalWidth > 0,
            ),
          ),
      )
      .toBe(true)
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= window.innerWidth,
      ),
    ).toBe(true)
    await page.evaluate(() => window.scrollTo(0, 0))
    if (size.width === 375) {
      await page.getByRole('button', { name: 'Mở menu' }).click()
      await expect(page.locator('#mobile-menu')).toBeVisible()
      await page.keyboard.press('Escape')
      await expect(page.getByRole('button', { name: 'Mở menu' })).toBeFocused()
      await expect(page.locator('#mobile-menu')).toHaveCount(0)
    }
    await page.screenshot({
      path: `.tmp/landing-${size.width}.png`,
      fullPage: true,
    })
  })
}
