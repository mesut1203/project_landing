import { expect, test } from '@playwright/test'

for (const width of [1440, 375]) {
  test(`section transitions follow scrolling in both directions at ${width}px`, async ({
    page,
  }) => {
    await page.setViewportSize({ width, height: 900 })
    await page.goto('/')
    const section = page.locator('#our-story')
    const track = section.locator('..')
    await expect(track).toHaveAttribute('data-motion', 'true')
    const top = await track.evaluate(
      (element) => element.getBoundingClientRect().top + window.scrollY,
    )
    const scrollTo = async (fraction: number) => {
      await page.evaluate(
        ({ top, fraction }) =>
          window.scrollTo(0, top - window.innerHeight * fraction),
        { top, fraction },
      )
    }
    const scale = () =>
      section.evaluate(
        (element) => new DOMMatrix(getComputedStyle(element).transform).a,
      )
    await scrollTo(0.85)
    await expect.poll(scale).toBeGreaterThan(0.95)
    await expect.poll(scale).toBeLessThan(0.97)
    const entryScale = await scale()
    await page.screenshot({ path: `.tmp/section-entry-${width}.png` })
    await scrollTo(0.25)
    await expect.poll(scale).toBe(1)
    await page.screenshot({ path: `.tmp/section-settled-${width}.png` })
    await scrollTo(0.85)
    await expect.poll(scale).toBeCloseTo(entryScale, 3)
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= window.innerWidth,
      ),
    ).toBe(true)

    await page.emulateMedia({ reducedMotion: 'reduce' })
    await expect(track).not.toHaveAttribute('data-motion')
    await expect(section).toHaveCSS('transform', 'none')
    await expect(section).toHaveCSS('opacity', '1')
    await page.emulateMedia({ reducedMotion: 'no-preference' })
    await scrollTo(0.85)
    await expect.poll(scale).toBeCloseTo(entryScale, 3)
  })
}

test('anchor navigation lands on a fully readable section', async ({
  page,
}) => {
  await page.goto('/#destinations')
  const section = page.locator('#destinations')
  await expect(section).toBeFocused()
  await expect(section).toHaveCSS('opacity', '1')
  await expect(
    page.getByRole('heading', { name: /Bạn muốn thức dậy/ }),
  ).toBeVisible()
})
