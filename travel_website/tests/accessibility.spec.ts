import { test, expect } from '@playwright/test'
import AxeBuilder from '@axe-core/playwright'

test('page has no automatically detectable WCAG AA violations', async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await page.goto('/')
  const result = await new AxeBuilder({ page })
    .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
    .analyze()
  expect(result.violations).toEqual([])
})

test('mobile menu is accessible and interactive targets are large enough', async ({
  page,
}) => {
  await page.setViewportSize({ width: 375, height: 812 })
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await page.goto('/')
  await page.getByRole('button', { name: 'Mở menu' }).click()
  const result = await new AxeBuilder({ page })
    .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
    .analyze()
  expect(result.violations).toEqual([])
  const tooSmall = await page
    .locator('button, input, select, a')
    .evaluateAll((elements) =>
      elements
        .filter((element) => {
          const rect = element.getBoundingClientRect()
          return (
            rect.width > 0 &&
            rect.height > 0 &&
            (rect.width < 44 || rect.height < 44)
          )
        })
        .map(
          (element) =>
            element.textContent || element.getAttribute('aria-label'),
        ),
    )
  expect(tooSmall).toEqual([])
})

test('200 percent zoom remains readable without horizontal overflow', async ({
  page,
}) => {
  await page.setViewportSize({ width: 1280, height: 900 })
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await page.goto('/')
  await page.addStyleTag({ content: 'html { zoom: 2; }' })
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= window.innerWidth,
    ),
  ).toBe(true)
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible()
  await page
    .getByRole('button', { name: 'Tạo ý tưởng chuyến đi' })
    .scrollIntoViewIfNeeded()
  await expect(
    page.getByRole('button', { name: 'Tạo ý tưởng chuyến đi' }),
  ).toBeVisible()
  await page.screenshot({ path: '.tmp/landing-zoom.png', fullPage: true })
})
