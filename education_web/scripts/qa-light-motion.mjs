import { chromium } from 'playwright-core'
import assert from 'node:assert/strict'
import { mkdir, writeFile } from 'node:fs/promises'

const directory = 'artifacts/light-motion'
await mkdir(directory, { recursive: true })
const browser = await chromium.launch({ headless: true })
const report = { viewports: [], motionChecks: [], errors: [] }
const baseURL = process.env.QA_URL || 'http://127.0.0.1:5173'
try {
  for (const viewport of [
    { width: 1440, height: 900 },
    { width: 1366, height: 768 },
    { width: 768, height: 1024 },
    { width: 390, height: 844 },
    { width: 375, height: 667 },
    { width: 844, height: 390 },
  ]) {
    const context = await browser.newContext({ viewport, hasTouch: viewport.width < 900 })
    const page = await context.newPage()
    const requests = []
    page.on('request', (request) => requests.push(request.url()))
    page.on('pageerror', (error) => report.errors.push(error.message))
    page.on('response', (response) => {
      if (response.status() >= 400) report.errors.push(response.status() + ' ' + response.url())
    })
    await page.goto(baseURL)
    await page.evaluate(() => document.fonts.ready)
    assert.equal(await page.locator('video, canvas, .world-track').count(), 0)
    await page.waitForFunction(() => document.getAnimations().filter(a => a.effect?.target?.closest?.('#home')).every(a => a.playState !== 'running'))
    await page.screenshot({
      path: directory + '/hero-' + viewport.width + 'x' + viewport.height + '.png',
    })
    await page.locator('#how-it-works').scrollIntoViewIfNeeded()
    await page.locator('.journey-image img').evaluate(async (img) => {
      if (!img.complete)
        await new Promise((resolve, reject) => {
          img.onload = resolve
          img.onerror = reject
        })
      assertImage(img)
      function assertImage(image) {
        if (!image.naturalWidth) throw new Error('Missing journey image')
      }
    })
    for (const item of await page.locator('.journey-steps li').all()) {
      assert.ok(await item.isVisible())
      assert.equal(await item.evaluate((el) => getComputedStyle(el).opacity), '1')
    }
    assert.equal(
      await page.locator('#how-it-works').evaluate((el) => getComputedStyle(el).position),
      'static',
    )
    const before = await page
      .locator('.hero-photo')
      .evaluate((el) => getComputedStyle(el).transform)
    await page.locator('#community').scrollIntoViewIfNeeded()
    assert.equal(
      await page.locator('.hero-photo').evaluate((el) => getComputedStyle(el).transform),
      before,
    )
    await page
      .locator('#how-it-works')
      .screenshot({
        path: directory + '/journey-' + viewport.width + 'x' + viewport.height + '.png',
      })
    assert.equal(
      await page.evaluate(() => document.documentElement.scrollWidth > innerWidth),
      false,
    )
    assert.equal(
      requests.some((url) => /\.(mp4|zip)(\?|$)/.test(url)),
      false,
    )
    await page.getByRole('link', { name: 'Continue to community' }).click()
    await page.waitForFunction(() => location.hash === '#community')
    await page.emulateMedia({ reducedMotion: 'reduce' })
    await page.locator('#learning-paths').scrollIntoViewIfNeeded()
    assert.equal(
      await page.evaluate(
        () => document.getAnimations().filter((a) => a.playState === 'running').length,
      ),
      0,
    )
    await page.addStyleTag({
      content:
        '#how-it-works { font-size: 200%; } #how-it-works p, #how-it-works a { font-size: inherit !important; }',
    })
    assert.equal(
      await page.evaluate(() => document.documentElement.scrollWidth > innerWidth),
      false,
    )
    report.viewports.push({
      ...viewport,
      mediaRequests: 0,
      reducedMotion: 'passed',
      journeyEnlargedText: 'passed',
    })
    await context.close()
  }
  for (const width of [1440, 390]) {
    const context = await browser.newContext({ viewport: { width, height: 900 }, reducedMotion: 'no-preference' })
    const page = await context.newPage()
    await page.goto(baseURL)
    await page.waitForFunction(() => document.querySelector('.hero-title-line')?.getAnimations().some(a => a.playState === 'running'))
    await page.emulateMedia({ reducedMotion: 'reduce' })
    await page.waitForFunction(() => document.getAnimations().every(a => a.playState !== 'running'))
    assert.equal(await page.locator('.hero-title-line').first().evaluate(el => getComputedStyle(el).transform), 'none')
    await page.emulateMedia({ reducedMotion: 'no-preference' })
    assert.equal(await page.locator('.hero-title-line').first().evaluate(el => el.getAnimations().length), 0)
    await page.getByRole('link', { name: 'Explore courses', exact: true }).click()
    await page.waitForFunction(() => location.hash === '#courses')
    await page.emulateMedia({ reducedMotion: 'reduce' })
    await page.locator('img').evaluateAll(images => images.forEach(image => { image.loading = 'eager' }))
    await page.waitForFunction(() => Array.from(document.images).every(image => image.complete && image.naturalWidth > 0))
    const sources = await page.locator('img').evaluateAll(images => images.map(image => image.currentSrc))
    assert.equal(new Set(sources).size, sources.length, 'Every image placement must have its own photograph')
    report.motionChecks.push({ width, liveReducedMotion: 'passed', courseNavigation: 'passed', uniqueImages: sources.length })
    await context.close()
  }
  assert.deepEqual(report.errors, [])
  await writeFile(directory + '/report.json', JSON.stringify(report, null, 2))
  console.log(JSON.stringify(report, null, 2))
} finally {
  await browser.close()
}
