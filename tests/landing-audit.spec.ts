import AxeBuilder from '@axe-core/playwright'
import { expect, test } from '@playwright/test'

const viewports = [
  { width: 320, height: 740 },
  { width: 375, height: 812 },
  { width: 430, height: 932 },
  { width: 768, height: 1024 },
  { width: 1024, height: 768 },
  { width: 1280, height: 800 },
  { width: 1440, height: 900 },
  { width: 1920, height: 1080 },
]

for (const viewport of viewports) {
  test(`audit ${viewport.width}px`, async ({ page }) => {
    await page.setViewportSize(viewport)
    await page.emulateMedia({ reducedMotion: 'reduce' })
    const errors: string[] = []
    page.on('console', message => {
      if (message.type() === 'error') errors.push(message.text())
    })
    page.on('pageerror', error => errors.push(error.message))
    await page.goto('/')
    await page.locator('#footer').scrollIntoViewIfNeeded()

    const geometry = await page.evaluate(() => ({
      overflow: document.documentElement.scrollWidth - innerWidth,
      offenders: [...document.querySelectorAll<HTMLElement>('body *')]
        .filter(element => {
          const bounds = element.getBoundingClientRect()
          return bounds.width > 0 && (bounds.left < -1 || bounds.right > innerWidth + 1)
        })
        .slice(0, 10)
        .map(element => ({ className: element.className, bounds: element.getBoundingClientRect().toJSON() })),
    }))
    const axe = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa']).analyze()
    console.log(JSON.stringify({ viewport, geometry, violations: axe.violations.map(({ id, impact, nodes }) => ({ id, impact, nodes: nodes.length })), errors }))
    expect(geometry.overflow).toBeLessThanOrEqual(0)
    expect(axe.violations.filter(violation => violation.impact === 'critical' || violation.impact === 'serious')).toEqual([])
    expect(errors).toEqual([])
  })
}
