import { chromium } from 'playwright-core'
import assert from 'node:assert/strict'
import { mkdir, writeFile } from 'node:fs/promises'

const directory = 'artifacts/scroll-world'
await mkdir(directory, { recursive: true })
const browser = await chromium.launch({ channel: 'chrome', headless: true })
const report = { viewports: [], errors: [] }
const baseURL = process.env.QA_URL || 'http://127.0.0.1:5173'
try {
  for (const viewport of [
    { width: 1440, height: 900 },
    { width: 1366, height: 768 },
    { width: 390, height: 844 },
    { width: 375, height: 667 },
  ]) {
    const mobile = viewport.width < 768
    const context = await browser.newContext({
      viewport,
      isMobile: mobile,
      hasTouch: mobile,
      deviceScaleFactor: 1,
    })
    const page = await context.newPage()
    page.on('pageerror', (error) => report.errors.push(error.message))
    const requests = []
    page.on('request', (request) => requests.push(request.url()))
    if (mobile) {
      const session = await context.newCDPSession(page)
      await session.send('Emulation.setCPUThrottlingRate', { rate: 4 })
    }
    await page.goto(baseURL)
    await page.evaluate(() => document.fonts.ready)
    assert.equal(await page.locator('.video-intro').count(), 0)
    assert.equal(await page.locator('video').count(), 1)
    const samples = []
    for (const progress of [0, 0.35, 0.37, 0.69, 0.72, 1, 0.5, 0]) {
      await page.evaluate((progress) => {
        const track = document.querySelector('.world-track')
        const stage = document.querySelector('.world-stage')
        const top = parseFloat(getComputedStyle(stage).top)
        window.scrollTo({
          top:
            track.getBoundingClientRect().top +
            scrollY -
            top +
            progress * (track.offsetHeight - stage.offsetHeight),
          behavior: 'instant',
        })
      }, progress)
      if (mobile && progress === 0) await page.locator('.world-media').tap()
      try {
        await page.waitForFunction(
          (progress) => {
            const video = document.querySelector('.world-video')
            const stage = document.querySelector('.world-stage')
            const active = document.querySelector('.world-step.is-active')
            return (
              video &&
              video.classList.contains('is-painted') &&
              !video.seeking &&
              Math.abs(video.currentTime - progress * 4.9) < 0.04 &&
              Math.abs(Number(stage.style.getPropertyValue('--world-progress')) - progress) <
                0.001 &&
              getComputedStyle(active).opacity === '1'
            )
          },
          progress,
          { timeout: 12000 },
        )
      } catch (error) {
        await page.screenshot({ path: `${directory}/failure-${viewport.width}-${progress}.png` })
        console.log(
          await page
            .locator('.world-track')
            .evaluate((el) => ({ html: el.outerHTML.slice(0, 3000), height: el.offsetHeight })),
        )
        throw error
      }
      const sample = await page.locator('.world-video').evaluate((video) => ({
        currentTime: video.currentTime,
        paused: video.paused,
        seekable: video.seekable.length ? video.seekable.end(0) : 0,
        source: video.src,
        width: video.videoWidth,
        height: video.videoHeight,
        chapter: document.querySelector('.world-chapter[aria-current="step"]').textContent.trim(),
        overflow: document.documentElement.scrollWidth > innerWidth,
        stageBottom: document.querySelector('.world-stage').getBoundingClientRect().bottom,
        viewportHeight: innerHeight,
      }))
      assert.equal(sample.paused, true)
      assert.equal(sample.width, 1280)
      assert.equal(sample.height, 720)
      assert.ok(sample.source.startsWith('blob:'))
      assert.ok(sample.seekable > 0)
      assert.equal(sample.overflow, false)
      assert.ok(
        sample.chapter.endsWith(progress >= 0.7 ? 'Grow' : progress >= 0.36 ? 'Practice' : 'Learn'),
      )
      assert.ok(
        sample.stageBottom <= sample.viewportHeight + 2,
        'Pinned stage must fit the viewport',
      )
      samples.push({ progress, ...sample })
      if ([0, 0.37, 0.72, 1].includes(progress))
        await page.screenshot({ path: `${directory}/${viewport.width}-${progress}.png` })
    }
    await page.getByRole('button', { name: 'Go to chapter 3: Grow' }).click()
    await page.waitForFunction(
      () => document.querySelector('.world-chapter-2').getAttribute('aria-current') === 'step',
    )
    assert.ok(requests.some((url) => url.endsWith('/videos/learning-world-zip.mp4')))
    assert.ok(
      !requests.some(
        (url) => url.includes('education-intro') || url.endsWith('/videos/learning-world.mp4'),
      ),
    )
    report.viewports.push({
      viewport,
      samples,
      chapterNavigation: 'passed',
      correctVideoRequested: true,
    })
    await context.close()
  }
  const context = await browser.newContext({
    viewport: { width: 390, height: 844 },
    reducedMotion: 'reduce',
  })
  const page = await context.newPage()
  const mediaRequests = []
  page.on('request', (request) => {
    if (request.url().endsWith('.mp4')) mediaRequests.push(request.url())
  })
  await page.goto(baseURL)
  await page.locator('#how-it-works').scrollIntoViewIfNeeded()
  assert.equal(await page.locator('.world-static').count(), 1)
  assert.equal(await page.locator('video').count(), 0)
  assert.equal(await page.locator('.world-step').count(), 3)
  assert.equal(mediaRequests.length, 0)
  await page.screenshot({ path: `${directory}/reduced-motion.png` })
  report.reducedMotion = 'passed; all copy visible, no video requests'
  await context.close()
  assert.deepEqual(report.errors, [])
  await writeFile(`${directory}/qa-report.json`, JSON.stringify(report, null, 2))
  console.log(
    JSON.stringify({
      viewports: report.viewports.length,
      samples: report.viewports.reduce((n, entry) => n + entry.samples.length, 0),
      errors: report.errors,
      reducedMotion: report.reducedMotion,
    }),
  )
} finally {
  await browser.close()
}
