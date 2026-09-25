import AxeBuilder from '@axe-core/playwright'
import { expect, test, type Page } from '@playwright/test'

async function openLanding(page: Page) {
  await page.goto('/')
  await expect(page.getByRole('heading', { level: 1, name: 'The good kind of late.' })).toBeVisible()
  await page.evaluate(() => document.fonts.ready)
}

async function loadPageImages(page: Page) {
  await page.evaluate(async () => {
    const step = Math.max(300, Math.floor(innerHeight * 0.8))
    for (let y = 0; y < document.documentElement.scrollHeight; y += step) {
      window.scrollTo({ top: y, behavior: 'instant' })
      await new Promise(resolve => setTimeout(resolve, 80))
    }
  })
  await expect.poll(
    () => page.locator('img').evaluateAll(images => images.filter(image => image.getClientRects().length > 0).every(image => image.complete && image.naturalWidth > 0)),
    { timeout: 20_000, message: 'Every displayed photograph should load successfully' },
  ).toBe(true)
}

async function assertNoHorizontalOverflow(page: Page) {
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - innerWidth)
  expect(overflow, 'The page should not scroll horizontally').toBeLessThanOrEqual(1)
}

test('the menu, navigation, and keyboard focus provide working paths', async ({ page }) => {
  const errors: string[] = []
  page.on('pageerror', error => errors.push(error.message))
  await openLanding(page)

  const menu = page.locator('#menu')
  await expect(menu.getByRole('heading', { level: 3 })).toHaveCount(3)
  await expect(menu.getByRole('heading', { name: 'Tonight, eat well.' })).toBeVisible()
  for (const name of ['The Red One', 'Hot Honey', 'Green Market']) {
    await expect(menu.getByText(name, { exact: true })).toBeVisible()
  }
  for (const text of [
    'Tomato, fior di latte, basil, olive oil.',
    'Spicy soppressata, mozzarella, hot honey, oregano.',
    'Broccolini, taleggio, lemon, chili, sesame.',
    '$18', '$22', '$21',
  ]) {
    await expect(menu.getByText(text, { exact: true })).toBeVisible()
  }
  expect(await page.locator('body').innerText()).not.toContain(String.fromCharCode(8212))

  await page.keyboard.press('Tab')
  const firstFocus = await page.evaluate(() => {
    const element = document.activeElement as HTMLElement | null
    if (!element) return null
    const style = getComputedStyle(element)
    return { tag: element.tagName, outline: style.outlineStyle, width: style.outlineWidth }
  })
  expect(firstFocus?.tag).toBe('A')
  expect(firstFocus?.outline).not.toBe('none')
  expect(firstFocus?.width).not.toBe('0px')

  for (const [name, section, heading] of [
    ['Menu', '#menu', 'Tonight, eat well.'],
    ['Visit', '#visit', 'Pull up a chair.'],
  ]) {
    await page.locator('header').getByRole('link', { name, exact: true }).click()
    await expect(page).toHaveURL(new RegExp(`${section}$`))
    const target = page.locator(section).getByRole('heading', { name: heading, exact: true })
    await expect.poll(async () => {
      const [targetBox, headerBox] = await Promise.all([
        target.boundingBox(), page.locator('header').boundingBox(),
      ])
      return targetBox && headerBox ? targetBox.y >= headerBox.y + headerBox.height - 1 : false
    }, { message: `${name} heading should sit below the fixed header` }).toBe(true)
    await expect.poll(async () => (await target.boundingBox())?.y ?? Infinity).toBeLessThan(900)
  }

  const styleTile = page.locator('footer').getByRole('link', { name: /style tile/i })
  await expect(styleTile).toHaveAttribute('href', /style-tile\.html/)
  expect(errors).toEqual([])
})

for (const viewport of [
  { width: 1440, height: 900 },
  { width: 1280, height: 720 },
  { width: 390, height: 844 },
  { width: 375, height: 812 },
  { width: 768, height: 1024 },
  { width: 1024, height: 768 },
  { width: 320, height: 700 },
]) {
  test(`layout and photography work at ${viewport.width}x${viewport.height}`, async ({ page }, testInfo) => {
    await page.setViewportSize(viewport)
    await openLanding(page)
    await assertNoHorizontalOverflow(page)
    const heroHeading = page.getByRole('heading', { level: 1, name: 'The good kind of late.' })
    const titleBox = await heroHeading.boundingBox()
    expect(titleBox).not.toBeNull()
    expect(titleBox!.x).toBeGreaterThanOrEqual(0)
    expect(titleBox!.x + titleBox!.width).toBeLessThanOrEqual(viewport.width + 1)

    const heroCta = page.locator('#home').getByRole('link', { name: /book a table/i })
    const ctaBox = await heroCta.boundingBox()
    expect(ctaBox, 'The primary action should be visible in the opening scene').not.toBeNull()
    expect(ctaBox!.y).toBeGreaterThanOrEqual(0)
    expect(ctaBox!.y + ctaBox!.height).toBeLessThanOrEqual(viewport.height + 1)
    if (process.env.CAPTURE_SCREENSHOTS === '1' && (viewport.width === 1440 || viewport.width === 390)) {
      const device = viewport.width === 1440 ? 'desktop' : 'mobile'
      await page.screenshot({ path: `.local/landing-${device}-viewport.png` })
    }

    await loadPageImages(page)
    await assertNoHorizontalOverflow(page)
    await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' }))
    await expect.poll(() => page.locator('.hero-media img').evaluate(image => image.complete && image.naturalWidth > 0)).toBe(true)
    if (process.env.CAPTURE_SCREENSHOTS === '1') {
      await page.screenshot({ path: testInfo.outputPath(`landing-${viewport.width}.png`), fullPage: true })
    }
    if (process.env.CAPTURE_SCREENSHOTS === '1' && (viewport.width === 1440 || viewport.width === 390)) {
      const device = viewport.width === 1440 ? 'desktop' : 'mobile'
      await page.screenshot({ path: `.local/landing-${device}-full.png`, fullPage: true })
    }
  })
}

for (const viewport of [{ width: 1440, height: 900 }, { width: 375, height: 812 }]) {
  test(`the hero stays still and scrolls naturally at ${viewport.width}px`, async ({ page }) => {
    await page.setViewportSize(viewport)
    const sequences: string[] = []
    page.on('request', request => { if (/\/sequence\/|\.zip(?:$|\?)/.test(request.url())) sequences.push(request.url()) })
    await openLanding(page)
    const image = page.locator('.hero-media img')
    const source = await image.evaluate(image => image.currentSrc)
    const mediaTransform = await page.locator('.hero-media').evaluate(element => getComputedStyle(element).transform)
    await expect(page.locator('.hero-stage')).toHaveCSS('position', 'relative')
    const before = await page.locator('.hero-stage').boundingBox()
    expect(before!.height).toBeLessThanOrEqual(viewport.height * 1.2)
    await expect(page.locator('#home button')).toHaveCount(0)
    await page.evaluate(() => window.scrollTo({ top: 400, behavior: 'instant' }))
    const after = await page.locator('.hero-stage').boundingBox()
    expect(before!.y - after!.y).toBeCloseTo(400, 0)
    await loadPageImages(page)
    expect(await image.evaluate(image => image.currentSrc)).toBe(source)
    await expect(page.locator('.hero-media')).toHaveCSS('transform', mediaTransform)
    expect(sequences).toEqual([])
  })
}

test('reduced motion disables entrances and responds to preference changes', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await openLanding(page)
  await expect(page.locator('html')).toHaveAttribute('data-motion', 'paused')
  await loadPageImages(page)
  expect(await page.evaluate(() => document.getAnimations().length)).toBe(0)
  await expect(page.locator('.hero-copy')).toHaveCSS('opacity', '1')
  await page.emulateMedia({ reducedMotion: 'no-preference' })
  await expect(page.locator('html')).toHaveAttribute('data-motion', 'enabled')
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await expect(page.locator('html')).toHaveAttribute('data-motion', 'paused')
  expect(await page.evaluate(() => document.getAnimations().length)).toBe(0)
})

test('the landing page passes automated accessibility checks', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await openLanding(page)
  await loadPageImages(page)
  const result = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa']).analyze()
  expect(result.violations).toEqual([])
})

test('the style tile is accessible and its motion study is controllable', async ({ page }) => {
  await page.goto('/style-tile.html')
  await page.evaluate(() => document.fonts.ready)
  await page.getByRole('button', { name: 'Replay motion', exact: true }).click()
  await page.getByRole('button', { name: 'Pause motion', exact: true }).click()
  await expect(page.getByRole('button', { name: 'Resume motion' })).toHaveAttribute('aria-pressed', 'true')
  await page.getByRole('button', { name: 'Resume motion' }).click()
  await expect(page.getByRole('status')).toHaveText('Study complete. Replay whenever you like.')
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await page.getByRole('button', { name: 'Replay motion', exact: true }).click()
  expect(await page.locator('#motion-art').evaluate(element => element.getAnimations().length)).toBe(0)
  const result = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa']).analyze()
  expect(result.violations).toEqual([])
})

test('mobile navigation works by touch and keyboard, and closes after navigation', async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 812 })
  await openLanding(page)
  const toggle = page.getByRole('button', { name: /navigation/ })
  const navigation = page.getByRole('navigation', { name: 'Mobile navigation' })
  await toggle.click()
  await expect(navigation).toBeVisible()
  await expect(toggle).toHaveAttribute('aria-expanded', 'true')
  await page.keyboard.press('Tab')
  await expect(navigation.getByRole('link', { name: /Our story/ })).toBeFocused()
  await page.keyboard.press('Escape')
  await expect(navigation).toBeHidden()
  await expect(toggle).toBeFocused()
  await toggle.click()
  await navigation.getByRole('link', { name: /Menu/ }).click()
  await expect(page).toHaveURL(/#menu$/)
  await expect(navigation).toBeHidden()
  await page.getByRole('button', { name: 'Open navigation' }).click()
  await page.getByRole('button', { name: 'Close navigation' }).click()
  await expect(navigation).toBeHidden()
  await page.getByRole('button', { name: 'Open navigation' }).click()
  await page.setViewportSize({ width: 1024, height: 768 })
  await expect(navigation).toBeHidden()
  await expect(page.getByRole('navigation', { name: 'Main navigation', exact: true })).toBeVisible()
})

for (const viewport of [{ width: 844, height: 390 }, { width: 667, height: 375 }]) {
  test(`landscape remains readable and scrollable at ${viewport.width}x${viewport.height}`, async ({ page }) => {
    await page.setViewportSize(viewport)
    await openLanding(page)
    await expect(page.locator('.hero-stage')).toHaveCSS('position', 'relative')
    await assertNoHorizontalOverflow(page)
    const cta = page.locator('#home').getByRole('link', { name: /book a table/i })
    await cta.scrollIntoViewIfNeeded()
    await expect(cta).toBeInViewport()
    await loadPageImages(page)
    await assertNoHorizontalOverflow(page)
  })
}

test('large mobile text reflows and touch controls remain comfortably sized', async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 812 })
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await openLanding(page)
  const smallTargets = await page.locator('a, button').evaluateAll(elements => elements.filter(element => {
    const box = element.getBoundingClientRect()
    return box.width > 0 && box.height > 0 && (box.width < 44 || box.height < 44)
  }).map(element => element.textContent))
  expect(smallTargets).toEqual([])
  await page.evaluate(() => { document.documentElement.style.fontSize = '200%' })
  await assertNoHorizontalOverflow(page)
  for (const control of await page.locator('header a:visible, header button:visible').all()) {
    const bounds = await control.boundingBox()
    expect(bounds!.x).toBeGreaterThanOrEqual(0)
    expect(bounds!.x + bounds!.width).toBeLessThanOrEqual(375)
  }
  await page.getByRole('button', { name: 'Open navigation' }).click()
  await assertNoHorizontalOverflow(page)
  await expect(page.getByRole('navigation', { name: 'Mobile navigation' }).getByRole('link', { name: /Visit/ })).toBeVisible()
  const result = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa']).analyze()
  expect(result.violations).toEqual([])
})

for (const mode of ['save-data', 'slow-network']) {
  test(`${mode} disables decorative motion`, async ({ page }) => {
    await page.addInitScript(mode => {
      const connection = Object.assign(new EventTarget(), { saveData: mode === 'save-data', effectiveType: mode === 'slow-network' ? '2g' : '4g' })
      Object.defineProperty(navigator, 'connection', { value: connection, configurable: true })
    }, mode)
    await openLanding(page)
    await expect(page.locator('html')).toHaveAttribute('data-motion', 'paused')
    await expect(page.locator('.hero-stage')).toHaveCSS('position', 'relative')
    await loadPageImages(page)
    expect(await page.evaluate(() => document.getAnimations().length)).toBe(0)
  })
}
