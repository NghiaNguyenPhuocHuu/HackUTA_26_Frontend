import { chromium, firefox, webkit } from "@playwright/test";
import { mkdir, writeFile } from "node:fs/promises";

const BASE = process.env.AUDIT_URL ?? "http://127.0.0.1:4173";
const OUT = "audit-out";

const VIEWPORTS = [
  { name: "desktop-1440x960", width: 1440, height: 960 },
  { name: "laptop-1280x800", width: 1280, height: 800 },
  { name: "tablet-834x1112", width: 834, height: 1112 },
  { name: "iphone-390x844", width: 390, height: 844 },
  { name: "small-320x740", width: 320, height: 740 },
];

const ENGINES = [
  { name: "webkit", launcher: webkit },
  { name: "chromium", launcher: chromium },
  { name: "firefox", launcher: firefox },
];

const FEATURES = [
  ["color-mix", "color: color-mix(in srgb, red 50%, blue)"],
  ["text-wrap-balance", "text-wrap: balance"],
  ["text-wrap-pretty", "text-wrap: pretty"],
  ["svh", "height: 100svh"],
  ["transform-box-view-box", "transform-box: view-box"],
  ["mask-image", "mask-image: linear-gradient(#000, transparent)"],
  ["aspect-ratio", "aspect-ratio: 2 / 1"],
  ["has", "selector(:has(a))"],
  ["nesting", "selector(& a)"],
];

// Runs in the page: collects layout/render facts we can compare across engines.
function collectFacts() {
  const de = document.documentElement;
  const overflowing = [];
  const vw = window.innerWidth;
  for (const el of document.querySelectorAll("*")) {
    const r = el.getBoundingClientRect();
    if (r.width === 0 && r.height === 0) continue;
    const cs = getComputedStyle(el);
    if (cs.position === "fixed") continue;
    if (r.right > vw + 1 || r.left < -1) {
      overflowing.push({
        sel:
          el.tagName.toLowerCase() +
          (el.id ? `#${el.id}` : "") +
          (el.className && typeof el.className === "string"
            ? `.${el.className.trim().split(/\s+/).slice(0, 3).join(".")}`
            : ""),
        left: Math.round(r.left),
        right: Math.round(r.right),
        ariaHidden: !!el.closest('[aria-hidden="true"]'),
      });
    }
  }

  const box = (sel) => {
    const el = document.querySelector(sel);
    if (!el) return null;
    const r = el.getBoundingClientRect();
    return {
      top: Math.round(r.top),
      left: Math.round(r.left),
      w: Math.round(r.width),
      h: Math.round(r.height),
    };
  };

  const hero = document.querySelector("#top");
  return {
    scrollWidth: de.scrollWidth,
    clientWidth: de.clientWidth,
    innerWidth: vw,
    horizontalOverflow: de.scrollWidth > vw + 1,
    overflowing: overflowing.slice(0, 25),
    heroRenderer: hero?.dataset.weatherRenderer ?? null,
    heroWaterRenderer: hero?.dataset.waterRenderer ?? null,
    heroAnimated: hero?.dataset.animated ?? null,
    canvasCount: document.querySelectorAll("canvas").length,
    canvasSizes: [...document.querySelectorAll("canvas")].map((c) => ({
      w: c.width,
      h: c.height,
      parent: String(c.parentElement?.className ?? "").slice(0, 40),
    })),
    boxes: {
      header: box(".site-header"),
      heroStage: box(".od-hero-stage"),
      heroLogo: box(".od-hero-logo"),
      heroBoat: box(".od-hero-boat"),
      aboutBoatLeft: box(".odyssey-boat-track--left"),
      aboutBoatRight: box(".odyssey-boat-track--right"),
      oracleEye: box(".oracle-eye"),
      sponsorsTemple: box(".sponsors-temple"),
      sponsorScreen: box(".sponsors-temple-screen"),
      footerVessel: box(".footer-vessel"),
      footerWaterLine: box(".footer-water-line"),
      footerBottom: box(".footer-bottom"),
    },
    counts: {
      sponsorBadges: document.querySelectorAll(".sponsor-badge").length,
      oracleItems: document.querySelectorAll(".oracle-item").length,
      perks: document.querySelectorAll(".odyssey-call-perks > li").length,
    },
  };
}

function checkFeatures(features) {
  const out = {};
  for (const [name, decl] of features) {
    try {
      out[name] = decl.startsWith("selector(")
        ? CSS.supports(decl)
        : CSS.supports(decl.split(":")[0].trim(), decl.split(":").slice(1).join(":").trim());
    } catch {
      out[name] = false;
    }
  }
  return out;
}

const report = { base: BASE, generated: new Date().toISOString(), engines: {} };

await mkdir(OUT, { recursive: true });

for (const { name: engine, launcher } of ENGINES) {
  const browser = await launcher.launch();
  report.engines[engine] = { version: browser.version(), viewports: {} };
  console.log(`\n=== ${engine} (${browser.version()}) ===`);

  for (const vp of VIEWPORTS) {
    const context = await browser.newContext({
      viewport: { width: vp.width, height: vp.height },
      deviceScaleFactor: 1,
    });
    const page = await context.newPage();
    const consoleErrors = [];
    page.on("console", (m) => {
      if (m.type() === "error") consoleErrors.push(m.text().slice(0, 300));
    });
    page.on("pageerror", (e) => consoleErrors.push(`pageerror: ${e.message.slice(0, 300)}`));

    try {
      await page.goto(BASE, { waitUntil: "load", timeout: 60000 });

      // The hero shaders mount asynchronously; wait so we can tell a slow
      // mount apart from one that never happens.
      let rendererReadyMs = null;
      const t0 = Date.now();
      try {
        await page.waitForFunction(
          () =>
            document.querySelector("#top")?.getAttribute("data-weather-renderer") ===
            "paper-webgl",
          undefined,
          { timeout: 12000 },
        );
        rendererReadyMs = Date.now() - t0;
      } catch {
        rendererReadyMs = null;
      }
      await page.waitForTimeout(800);

      const features = await page.evaluate(checkFeatures, FEATURES);
      const facts = await page.evaluate(collectFacts);

      // Full-page screenshot for visual diffing between engines.
      await page.screenshot({
        path: `${OUT}/${engine}-${vp.name}-full.png`,
        fullPage: true,
      });

      report.engines[engine].viewports[vp.name] = {
        features,
        consoleErrors,
        rendererReadyMs,
        ...facts,
      };

      const flag = facts.horizontalOverflow ? "OVERFLOW" : "ok";
      console.log(
        `  ${vp.name}: ${flag} scrollW=${facts.scrollWidth}/${facts.innerWidth} renderer=${facts.heroRenderer} readyMs=${rendererReadyMs} canvas=${facts.canvasCount} waterR=${facts.heroWaterRenderer} errors=${consoleErrors.length}`,
      );
      if (facts.horizontalOverflow) {
        for (const o of facts.overflowing.slice(0, 6)) {
          console.log(`      overflow: ${o.sel} [${o.left}..${o.right}] ariaHidden=${o.ariaHidden}`);
        }
      }
      for (const e of consoleErrors.slice(0, 3)) console.log(`      error: ${e}`);
    } catch (err) {
      report.engines[engine].viewports[vp.name] = { fatal: String(err).slice(0, 500) };
      console.log(`  ${vp.name}: FAILED ${String(err).slice(0, 200)}`);
    }

    await context.close();
  }

  await browser.close();
}

await writeFile(`${OUT}/report.json`, JSON.stringify(report, null, 2));
console.log(`\nWrote ${OUT}/report.json`);
