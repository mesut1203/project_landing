import { expect, test } from '@playwright/test'

for (const width of [1440, 375]) {
  test(`static hero scrolls naturally without video at ${width}px`, async ({
    page,
  }) => {
    await page.setViewportSize({ width, height: 900 })
    const errors: string[] = []
    const mediaRequests: string[] = []
    page.on('pageerror', (error) => errors.push(error.message))
    page.on('request', (request) => {
      if (/\.(mp4|zip)(?:$|\?)/.test(request.url()))
        mediaRequests.push(request.url())
    })
    await page.goto('/')
    await expect(page.getByRole('heading', { level: 1 })).toContainText(
      'Đi xa hơn.',
    )
    await expect(page.locator('.hero-image')).toBeVisible()
    await expect(page.locator('video')).toHaveCount(0)
    const hero = page.locator('#top')
    const initial = await hero.boundingBox()
    expect(initial!.height).toBeLessThanOrEqual(1000)
    await page.evaluate(() => window.scrollBy(0, 400))
    await expect
      .poll(() => hero.evaluate((el) => el.getBoundingClientRect().top))
      .toBe(-400)
    await page.evaluate(() => window.scrollTo(0, 0))
    await page
      .getByRole('link', { name: 'Tìm hành trình của bạn', exact: true })
      .click()
    await expect(page).toHaveURL(/#destinations$/)
    await expect(page.locator('#destinations-heading')).toBeInViewport()
    expect(mediaRequests).toEqual([])
    expect(errors).toEqual([])
  })
}

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
