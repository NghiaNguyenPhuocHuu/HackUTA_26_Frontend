import { webkit } from "@playwright/test";
import { mkdir } from "node:fs/promises";

const BASE = process.env.AUDIT_URL ?? "http://127.0.0.1:4173";
const OUT = "audit-out/fallback";
await mkdir(OUT, { recursive: true });

const browser = await webkit.launch();

for (const mode of ["webgl-on", "webgl-off"]) {
  const context = await browser.newContext({
    viewport: { width: 1280, height: 900 },
    deviceScaleFactor: 1,
  });

  if (mode === "webgl-off") {
    // Simulate Safari with WebGL blocked (lockdown mode, low power, old GPU).
    await context.addInitScript(() => {
      const real = HTMLCanvasElement.prototype.getContext;
      HTMLCanvasElement.prototype.getContext = function (type, ...rest) {
        if (String(type).includes("webgl")) return null;
        return real.call(this, type, ...rest);
      };
    });
  }

  const page = await context.newPage();
  const errors = [];
  page.on("pageerror", (e) => errors.push(e.message.slice(0, 200)));
  await page.goto(BASE, { waitUntil: "load", timeout: 60000 });
  await page.waitForTimeout(3500);

  const state = await page.evaluate(() => {
    const hero = document.querySelector("#top");
    const stage = document.querySelector(".od-hero-stage");
    const before = getComputedStyle(stage, "::before");
    const shader = document.querySelector(".od-weather-shader");
    return {
      weatherRenderer: hero.getAttribute("data-weather-renderer"),
      waterRenderer: hero.getAttribute("data-water-renderer"),
      skyHaze: getComputedStyle(hero).getPropertyValue("--sky-haze").trim(),
      hazeOpacity: before.opacity,
      shaderOpacity: shader ? getComputedStyle(shader).opacity : null,
      canvases: document.querySelectorAll("canvas").length,
      fallbackWaves: getComputedStyle(
        document.querySelector(".od-departure-water"),
      ).opacity,
    };
  });

  console.log(`\n=== ${mode} ===`);
  console.log(JSON.stringify(state, null, 1));
  console.log(`pageerrors: ${errors.length}${errors.length ? " -> " + errors[0] : ""}`);

  await page.locator("#top").screenshot({ path: `${OUT}/webkit-${mode}.png` });
  await context.close();
}

await browser.close();
