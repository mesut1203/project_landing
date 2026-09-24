import { expect, test } from '@playwright/test'

for (const width of [1440, 375]) {
  test(`content reveals once while sections stay stable at ${width}px`, async ({
    page,
  }) => {
    await page.setViewportSize({ width, height: 900 })
    await page.goto('/')
    const section = page.locator('#our-story')
    const reveal = page.locator('.story-copy')
    await section.scrollIntoViewIfNeeded()
    await reveal.scrollIntoViewIfNeeded()
    await expect(reveal).toHaveCSS('opacity', '1')
    await expect(section).toHaveCSS('transform', 'none')
    await expect(section).toHaveCSS('clip-path', 'none')
    await page.evaluate(() => window.scrollTo(0, 0))
    await expect(reveal).toHaveCSS('opacity', '1')
    await expect(section).toHaveCSS('transform', 'none')
  })
}

test('reduced motion disables animations and reveals all content, including after preference changes', async ({
  page,
}) => {
  await page.goto('/')
  await page.emulateMedia({ reducedMotion: 'reduce' })
  for (const reveal of await page.locator('.reveal').all()) {
    await expect(reveal).toHaveCSS('opacity', '1')
    await expect(reveal).toHaveCSS('transform', 'none')
    await expect(reveal).toHaveCSS('transition-duration', '0s')
  }
  await expect(page.locator('.hero-copy')).toHaveCSS('animation-name', 'none')
  await expect(page.locator('.hero-landscape')).toHaveCSS('transform', 'none')
  await expect(page.locator('.hero-image')).toHaveCSS('animation-name', 'none')
  await expect(page.locator('.scroll-word').first()).toHaveCSS('opacity', '1')
  await expect(page.locator('.scroll-word').last()).toHaveCSS('opacity', '1')
  await expect(page.locator('.hero-eyebrow [aria-hidden]')).toHaveCount(0)
  await page.emulateMedia({ reducedMotion: 'no-preference' })
  await expect(page.locator('.story-copy')).toHaveCSS('opacity', '1')
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await page.reload()
  await expect(page.locator('.hero-copy')).toHaveCSS('animation-name', 'none')
  await expect(page.locator('video')).toHaveCount(0)
})

test('hero action remains visible when focused during its entrance', async ({
  page,
}) => {
  await page.goto('/', { waitUntil: 'domcontentloaded' })
  await page
    .getByRole('link', { name: 'Tìm hành trình của bạn', exact: true })
    .focus()
  await expect(page.locator('.hero-bottom')).toHaveCSS('opacity', '1')
  await expect(page.locator('.hero-bottom')).toHaveCSS('animation-name', 'none')
})

test('travel quotation reveals while scrolling and stays readable when motion is disabled', async ({
  page,
}) => {
  await page.goto('/')
  const quote = page.locator('.scroll-reveal')
  const lastWord = quote.locator('.scroll-word').last()
  await expect(lastWord).toHaveCSS('opacity', '0.2')
  await quote.scrollIntoViewIfNeeded()
  await page.evaluate(() => window.scrollBy(0, 180))
  await expect(lastWord).toHaveCSS('opacity', '1')
  await page.evaluate(() => window.scrollTo(0, 0))
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await expect(lastWord).toHaveCSS('opacity', '1')
  await expect(quote).toHaveCSS('transform', 'none')
  await expect(page.locator('.hero-eyebrow [aria-hidden]')).toHaveCount(0)
  await expect(page.locator('.hero-eyebrow')).toContainText(
    'VIETNAM, AT YOUR OWN PACE',
  )
})

test('anchor navigation lands on a fully readable section', async ({
  page,
}) => {
  await page.goto('/#destinations')
  const section = page.locator('#destinations')
  await expect(section).toBeFocused()
  await expect(section).toHaveCSS('opacity', '1')
  await expect(page.locator('#destinations-heading')).toBeInViewport()
})
