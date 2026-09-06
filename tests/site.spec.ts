import { test, expect } from '@playwright/test'

test('event content and navigation are honest and complete', async ({ page }) => {
  await page.goto('/')
  await expect(page).toHaveTitle(/HackUTA 2026/)
  await expect(page.getByRole('heading', { level: 1 })).toContainText('HackUTA 2026: The Odyssey')
  await expect(page.locator('.weekend-row')).toHaveCount(4)
  await expect(page.locator('.weekend-time')).toHaveText(['Time TBA', 'Time TBA', 'Time TBA', 'Time TBA'])
  await expect(page.locator('.crew-facts > div')).toHaveCount(3)
  await expect(page.locator('.oracle-item')).toHaveCount(6)
  const beginnerQuestion = page.getByText('Is HackUTA beginner-friendly?', { exact: true })
  await beginnerQuestion.click()
  await expect(page.getByText('You do not need hackathon experience or a polished idea.')).toBeVisible()
  expect(await page.locator('a[href="#"]').count()).toBe(0)
  await page.getByRole('link', { name: 'Set sail', exact: true }).click()
  await expect(page).toHaveURL(/#about$/)
})

test('animation follows the system preference and ignores the retired stored toggle', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 960 })
  await page.emulateMedia({ reducedMotion: 'no-preference' })
  await page.addInitScript(() => localStorage.setItem('hackuta-motion', 'off'))
  await page.goto('/')
  await expect(page.getByRole('button', { name: /motion|animation/i })).toHaveCount(0)
  await expect(page.locator('#top')).toHaveAttribute('data-animated', 'true')
  await expect(page.locator('#voyage')).toHaveAttribute('data-animated', 'true')
  await page.locator('.od-chapter-control').nth(2).click()
  await expect(page.locator('#voyage-chapter-3')).toHaveAttribute('data-active', 'true')
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await expect(page.locator('#top')).toHaveAttribute('data-animated', 'false')
  await expect(page.locator('#voyage')).toHaveAttribute('data-animated', 'false')
  await expect(page.locator('.od-chapter[aria-hidden="true"]')).toHaveCount(0)
  await expect.poll(async () => page.evaluate(() => document.getAnimations().filter(animation => animation.playState === 'running').length)).toBe(0)
  await page.emulateMedia({ reducedMotion: 'no-preference' })
  await expect(page.locator('#voyage')).toHaveAttribute('data-animated', 'true')
})

test('the opening ship drifts across the center of the viewport', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 960 })
  await page.emulateMedia({ reducedMotion: 'no-preference' })
  await page.goto('/')
  const hero = page.locator('#top')
  const ship = hero.locator('.od-hero-boat')
  await expect(hero).toHaveAttribute('data-weather-renderer', 'paper-webgl')
  await expect(hero).toHaveAttribute('data-water-renderer', 'webgl2')
  await expect(hero.locator('.od-weather-shader canvas')).toHaveCount(1)
  await expect(hero.locator('.od-webgl-water canvas')).toHaveCount(1)
  await expect(hero.locator('.od-rain i')).toHaveCount(52)
  await expect(hero.locator('.od-lightning')).toHaveCount(2)
  await expect(hero.locator('.od-wave-surface')).toHaveCount(1)

  const centerAtStart = await ship.evaluate(element => {
    const box = element.getBoundingClientRect()
    return box.left + box.width / 2
  })
  expect(centerAtStart).toBeGreaterThan(1440 * 0.36)
  expect(centerAtStart).toBeLessThan(1440 * 0.44)

  await page.waitForTimeout(14500)

  const centerAfterDrift = await ship.evaluate(element => {
    const box = element.getBoundingClientRect()
    return box.left + box.width / 2
  })
  expect(centerAfterDrift).toBeGreaterThan(1440 * 0.56)
  expect(centerAfterDrift).toBeLessThan(1440 * 0.64)
})

test('mobile menu remains in the viewport and navigates', async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 740 })
  await page.goto('/')
  const menu = page.getByRole('button', { name: 'Open navigation', exact: true })
  await expect(menu).toBeInViewport()
  await menu.click()
  await expect(page.locator('#mobile-navigation')).toBeVisible()
  await page.keyboard.press('Escape')
  await expect(menu).toBeFocused()
  await menu.click()
  await page.locator('#mobile-navigation').getByRole('link', { name: 'Schedule' }).click()
  await expect(page).toHaveURL(/#schedule$/)
  await expect(page.locator('#mobile-navigation')).toBeHidden()
})

for (const viewport of [{ width: 320, height: 740 }, { width: 844, height: 390 }, { width: 1024, height: 650 }]) {
  test(`compact ${viewport.width}×${viewport.height} layout stays readable`, async ({ page }) => {
    await page.setViewportSize(viewport)
    await page.goto('/')
    await expect(page.locator('#voyage')).toHaveAttribute('data-animated', 'false')
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true)
    for (const chapter of await page.locator('.od-chapter').all()) {
      await chapter.scrollIntoViewIfNeeded()
      await expect(chapter).not.toHaveAttribute('aria-hidden', 'true')
      const heading = chapter.locator('h3')
      expect(await heading.evaluate(el => el.getBoundingClientRect().right <= innerWidth)).toBe(true)
    }
  })
}

for (const width of [1440, 1920]) {
  test(`desktop ${width}px landmarks are separate, sharp assets beside readable copy`, async ({ page }) => {
    await page.setViewportSize({ width, height: width === 1440 ? 960 : 1080 })
    await page.goto('/')
    await expect(page.locator('#voyage')).toHaveAttribute('data-animated', 'true')
    for (let index = 0; index < 4; index++) {
      await page.locator('.od-chapter-control').nth(index).click()
      await expect(page.locator(`#voyage-chapter-${index + 1}`)).toHaveAttribute('data-active', 'true')
      await page.waitForTimeout(900)
      const artwork = await page.locator('#voyage').evaluate(section => {
        const visible = (element: Element) => {
          const rect = element.getBoundingClientRect()
          if (rect.width <= 0 || rect.right <= 0 || rect.left >= innerWidth) return false
          for (let parent: Element | null = element; parent; parent = parent.parentElement) {
            const style = getComputedStyle(parent)
            if (style.display === 'none' || style.visibility === 'hidden' || Number(style.opacity) < .05) return false
          }
          return true
        }
        const copy = section.querySelector('.od-chapter[data-active="true"] .od-chapter-copy')!.getBoundingClientRect()
        return [...section.querySelectorAll<HTMLImageElement>('.od-island-panel[data-active="true"] img')].filter(visible).map(image => {
          const bounds = image.getBoundingClientRect()
          const fit = getComputedStyle(image).objectFit
          const scales = [bounds.width / image.naturalWidth, bounds.height / image.naturalHeight]
          const scale = fit === 'contain' ? Math.min(...scales) : Math.max(...scales)
          return {
            src: image.currentSrc,
            loaded: image.complete && image.naturalWidth > 0,
            density: 1 / (scale * devicePixelRatio),
            overlap: Math.max(0, Math.min(bounds.right, copy.right) - Math.max(bounds.left, copy.left)) * Math.max(0, Math.min(bounds.bottom, copy.bottom) - Math.max(bounds.top, copy.top)),
          }
        })
      })
      expect(artwork.length).toBeGreaterThan(0)
      for (const image of artwork) {
        expect(image.loaded).toBe(true)
        expect(image.src).toMatch(/island-(departure|encounter|discovery|return)-v7\.webp/)
        expect(image.density).toBeGreaterThanOrEqual(.98)
        expect(image.overlap).toBeLessThanOrEqual(4)
      }
    }
  })
}

test.describe('mobile image density', () => {
  test.use({ viewport: { width: 375, height: 812 }, deviceScaleFactor: 2 })
  test('individual island illustrations have enough pixels for a DPR2 display', async ({ page }) => {
    await page.goto('/')
    expect(await page.evaluate(() => devicePixelRatio)).toBe(2)
    for (const chapter of await page.locator('.od-chapter').all()) {
      await chapter.scrollIntoViewIfNeeded()
      const image = chapter.locator('.od-chapter-art img')
      await expect.poll(async () => image.evaluate(element => (element as HTMLImageElement).naturalWidth)).toBeGreaterThan(0)
      const density = await image.evaluate(element => {
        const image = element as HTMLImageElement
        const bounds = image.getBoundingClientRect()
        const fit = getComputedStyle(image).objectFit
        const scales = [bounds.width / image.naturalWidth, bounds.height / image.naturalHeight]
        return 1 / ((fit === 'contain' ? Math.min(...scales) : Math.max(...scales)) * devicePixelRatio)
      })
      expect(density).toBeGreaterThanOrEqual(.98)
    }
  })
})
