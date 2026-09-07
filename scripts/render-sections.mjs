import { chromium, webkit } from "@playwright/test";
import { mkdir } from "node:fs/promises";

const BASE = process.env.AUDIT_URL ?? "http://127.0.0.1:4173";
const OUT = "audit-out/sections";

const SECTIONS = ["#top", "#about", "#schedule", "#faq", "#sponsors", "#footer"];

const ENGINES = [
  { name: "webkit", launcher: webkit },
  { name: "chromium", launcher: chromium },
];

const VIEWPORT = process.env.AUDIT_W
  ? { width: Number(process.env.AUDIT_W), height: Number(process.env.AUDIT_H) }
  : { width: 1280, height: 900 };

await mkdir(OUT, { recursive: true });

for (const { name, launcher } of ENGINES) {
  const browser = await launcher.launch();
  const context = await browser.newContext({
    viewport: VIEWPORT,
    deviceScaleFactor: 1,
  });
  const page = await context.newPage();
  await page.goto(BASE, { waitUntil: "load", timeout: 60000 });
  await page
    .waitForFunction(
      () =>
        document.querySelector("#top")?.getAttribute("data-weather-renderer") ===
        "paper-webgl",
      undefined,
      { timeout: 15000 },
    )
    .catch(() => {});

  // Freeze time-based animation so the two engines are comparable.
  await page.addStyleTag({
    content: `*, *::before, *::after { animation-play-state: paused !important; }`,
  });

  for (const sel of SECTIONS) {
    const el = page.locator(sel);
    if ((await el.count()) === 0) continue;
    await el.scrollIntoViewIfNeeded();
    await page.waitForTimeout(900);
    const file = `${OUT}/${name}-${sel.replace("#", "")}-${VIEWPORT.width}.png`;
    await el.screenshot({ path: file }).catch(async () => {
      await page.screenshot({ path: file });
    });
    console.log(`captured ${file}`);
  }

  await browser.close();
}
