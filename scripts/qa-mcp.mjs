import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { StdioClientTransport } from '@modelcontextprotocol/sdk/client/stdio.js';
import { mkdir, writeFile } from 'node:fs/promises';
import { createRequire } from 'node:module';
import path from 'node:path';

// This is an MCP client, not a renamed direct Playwright script. Every browser
// action below is sent over stdio to Microsoft's @playwright/mcp server.
const require = createRequire(import.meta.url);
const origin = process.env.QA_BASE_URL || 'http://127.0.0.1:5173';
const output = path.resolve('artifacts/mcp');
await mkdir(output, { recursive: true });
const client = new Client({ name: 'hackuta-design-qa', version: '1.0.0' });
const transport = new StdioClientTransport({
  command: process.execPath,
  args: [
    path.join(path.dirname(require.resolve('@playwright/mcp/package.json')), 'cli.js'),
    '--headless', '--browser', process.env.QA_BROWSER || 'msedge', '--isolated',
    '--output-dir', output, '--viewport-size', '1440,960', '--image-responses', 'omit',
  ],
  stderr: 'pipe',
});
const report = { startedAt: new Date().toISOString(), origin, transport: 'MCP stdio', tools: [], checks: [], calls: [] };
let serverLog = '';
const check = (name, pass, detail = null) => {
  report.checks.push({ name, pass, detail });
  console.log(`${pass ? 'PASS' : 'FAIL'} ${name}${detail ? `: ${JSON.stringify(detail)}` : ''}`);
};
const call = async (name, args) => {
  const result = await client.callTool({ name, arguments: args }, undefined, { timeout: 90_000 });
  const text = result.content?.filter(item => item.type === 'text').map(item => item.text).join('\n') || '';
  report.calls.push({ name, arguments: args, isError: result.isError || false, text });
  if (result.isError) throw new Error(`${name}: ${text}`);
  const match = text.match(/### Result\s*\n([\s\S]*?)(?=\n### |$)/);
  if (match) {
    try { return JSON.parse(match[1].trim()); } catch { return match[1].trim(); }
  }
  return text;
};
const evaluate = fn => call('browser_evaluate', { function: fn.toString() });
const run = code => call(report.tools.some(tool => tool.name === 'browser_run_code') ? 'browser_run_code' : 'browser_run_code_unsafe', { code });
const capture = (filename, scale = 'css') => call('browser_take_screenshot', { filename: path.join(output, filename), fullPage: false, type: 'png', scale });
const artGeometry = () => evaluate(() => {
  const paintedRect = element => {
    const source = element.getBoundingClientRect();
    const box = { x: source.x, y: source.y, right: source.right, bottom: source.bottom };
    const ownStyle = getComputedStyle(element);
    if (element instanceof HTMLImageElement && element.naturalWidth > 0 && ['contain', 'scale-down'].includes(ownStyle.objectFit)) {
      const scale = Math.min(source.width / element.naturalWidth, source.height / element.naturalHeight, ownStyle.objectFit === 'scale-down' ? 1 : Infinity);
      const positions = ownStyle.objectPosition.split(' ');
      const position = value => value?.endsWith('%') ? parseFloat(value) / 100 : .5;
      box.x += (source.width - element.naturalWidth * scale) * position(positions[0]);
      box.y += (source.height - element.naturalHeight * scale) * position(positions[1]);
      box.right = box.x + element.naturalWidth * scale;
      box.bottom = box.y + element.naturalHeight * scale;
    }
    for (let ancestor = element.parentElement; ancestor; ancestor = ancestor.parentElement) {
      const style = getComputedStyle(ancestor);
      const clip = ancestor.getBoundingClientRect();
      if (style.overflowX !== 'visible') { box.x = Math.max(box.x, clip.left); box.right = Math.min(box.right, clip.right); }
      if (style.overflowY !== 'visible') { box.y = Math.max(box.y, clip.top); box.bottom = Math.min(box.bottom, clip.bottom); }
    }
    return { ...box, width: Math.max(0, box.right - box.x), height: Math.max(0, box.bottom - box.y) };
  };
  const visible = element => {
    const rect = paintedRect(element);
    if (rect.width < 1 || rect.height < 1 || rect.right <= 0 || rect.x >= innerWidth || rect.bottom <= 0 || rect.y >= innerHeight) return false;
    for (let ancestor = element; ancestor; ancestor = ancestor.parentElement) {
      const style = getComputedStyle(ancestor);
      if (style.display === 'none' || style.visibility === 'hidden' || Number(style.opacity) < .05) return false;
    }
    return true;
  };
  const rect = element => {
    const box = element.getBoundingClientRect();
    return { x: box.x, y: box.y, width: box.width, height: box.height, right: box.right, bottom: box.bottom };
  };
  const overlap = (a, b) => Math.max(0, Math.min(a.right, b.right) - Math.max(a.x, b.x)) * Math.max(0, Math.min(a.bottom, b.bottom) - Math.max(a.y, b.y));
  const images = [...document.querySelectorAll('#top img')].filter(visible).map(image => {
    const bounds = rect(image);
    const fit = getComputedStyle(image).objectFit;
    const widthScale = bounds.width / image.naturalWidth;
    const heightScale = bounds.height / image.naturalHeight;
    const scale = fit === 'cover' ? Math.max(widthScale, heightScale) : fit === 'contain' ? Math.min(widthScale, heightScale) : Math.max(widthScale, heightScale);
    return { src: image.currentSrc, loaded: image.complete && image.naturalWidth > 0, naturalWidth: image.naturalWidth, naturalHeight: image.naturalHeight, bounds, paintedBounds: paintedRect(image), fit, density: 1 / (scale * devicePixelRatio), stretched: fit === 'fill' && Math.abs(widthScale / heightScale - 1) > .02 };
  });
  const collisions = [];
  for (const [boatSelector, textSelector] of [['.od-hero-boat', '.od-hero-copy h1,.od-hero-copy p,.od-hero-copy a']]) {
    const boat = document.querySelector(boatSelector);
    if (boat && visible(boat)) {
      for (const copy of [...document.querySelectorAll(textSelector)].filter(visible)) {
        const area = overlap(paintedRect(boat), rect(copy));
        if (area > 4) collisions.push({ art: boatSelector, text: copy.textContent.trim(), overlapArea: Math.round(area), artBounds: paintedRect(boat), textBounds: rect(copy) });
      }
    }
  }
  return { width: innerWidth, height: innerHeight, dpr: devicePixelRatio, images, collisions };
});
const checkArt = async label => {
  await settle();
  const art = await artGeometry();
  check(`${label}: visible art loads at native display density`, art.images.length > 0 && art.images.every(image => image.loaded && image.density >= .98 && !image.stretched), art);
  check(`${label}: illustration and reading areas do not overlap`, art.collisions.length === 0, art.collisions);
};
const accessibility = async label => {
  const result = await run(`async (page) => {
    await page.addScriptTag({ path: ${JSON.stringify(require.resolve('axe-core/axe.min.js'))} });
    return await page.evaluate(async () => {
      const result = await window.axe.run(document, { runOnly: { type: 'tag', values: ['wcag2a', 'wcag2aa', 'wcag21aa'] } });
      return result.violations.map(violation => ({ id: violation.id, impact: violation.impact, description: violation.description, nodes: violation.nodes.map(node => ({ target: node.target, summary: node.failureSummary })) }));
    });
  }`);
  check(`${label} accessibility audit`, Array.isArray(result) && result.length === 0, result);
};
const settle = async () => run(`async (page) => {
  await page.evaluate(async () => {
    await document.fonts.ready;
    await Promise.all([...document.images].filter(image => image.loading !== 'lazy' || image.complete).map(image => image.decode()));
  });
  await page.waitForTimeout(650);
  return true;
}`);
const geometry = () => evaluate(() => {
  const isVisible = element => {
    const css = getComputedStyle(element);
    return !element.closest('[aria-hidden="true"], [hidden]') && css.display !== 'none' && css.visibility !== 'hidden' && Number(css.opacity) !== 0 && element.getBoundingClientRect().width > 0;
  };
  const clippedText = [...document.querySelectorAll('h1,h2,h3,p,nav a,button')].filter(isVisible).filter(element => {
    if (element.classList.contains('sr-only') || element.classList.contains('visually-hidden')) return false;
    const rect = element.getBoundingClientRect();
    return rect.right > innerWidth + 2 || rect.left < -2;
  }).map(element => ({ tag: element.tagName, text: element.textContent.trim().slice(0, 95), class: element.className, x: Math.round(element.getBoundingClientRect().x), width: Math.round(element.getBoundingClientRect().width) }));
  return {
    width: innerWidth, height: innerHeight, documentWidth: document.documentElement.scrollWidth,
    overflow: document.documentElement.scrollWidth > innerWidth + 1,
    clippedText,
    missingImages: [...document.images].filter(image => image.loading !== 'lazy' || image.complete).filter(image => !image.complete || image.naturalWidth === 0).map(image => image.currentSrc),
    h1Count: document.querySelectorAll('h1').length,
    headings: [...document.querySelectorAll('h1,h2,h3')].filter(isVisible).map(el => el.textContent.trim()),
    sections: [...document.querySelectorAll('main section')].map(el => ({ id: el.id, class: el.className, top: Math.round(el.getBoundingClientRect().top + scrollY), height: Math.round(el.getBoundingClientRect().height) })),
  };
});

try {
  await client.connect(transport);
  transport.stderr?.on('data', data => { serverLog += data.toString(); });
  const discovery = await client.listTools();
  report.tools = discovery.tools.map(tool => ({ name: tool.name, inputSchema: tool.inputSchema }));
  console.log(`Connected to Playwright MCP; discovered ${report.tools.length} tools.`);
  if (process.argv.includes('--discover')) {
    console.log(report.tools.map(tool => tool.name).join('\n'));
  } else {
    await call('browser_navigate', { url: origin });
    await run(`async (page) => {
      await page.addInitScript(() => { window.__qaErrors = []; addEventListener('error', event => window.__qaErrors.push(event.message)); addEventListener('unhandledrejection', event => window.__qaErrors.push(String(event.reason))); });
      await page.reload({ waitUntil: 'networkidle' });
      return { title: await page.title() };
    }`);
    await settle();
    const defaultMotion = await evaluate(() => ({
      hero: document.querySelector('#top')?.getAttribute('data-animated'),
      motionButtons: [...document.querySelectorAll('button')].filter(button => /motion|animation/i.test(`${button.textContent} ${button.getAttribute('aria-label')}`)).map(button => button.outerHTML),
    }));
    check('Animations are enabled by default with no motion toggle', defaultMotion.hero === 'true' && defaultMotion.motionButtons.length === 0, defaultMotion);
    const fonts = await evaluate(() => [...document.fonts].map(font => ({ family: font.family, weight: font.weight, status: font.status })));
    check('Custom regular and semibold fonts successfully decode', ['400', '600'].every(weight => fonts.some(font => font.family === 'Barlow Semi Condensed' && font.weight === weight && font.status === 'loaded')), fonts);
    let state = await geometry();
    check('One descriptive page heading', state.h1Count === 1, state.h1Count);
    check('Eager and requested page images load', state.missingImages.length === 0, state.missingImages);
    check('Desktop has no horizontal overflow', !state.overflow && !state.clippedText.length, state.clippedText);
    const documentLinks = await evaluate(() => ({
      brokenAnchors: [...document.querySelectorAll('a[href^="#"]')].filter(anchor => anchor.hash && !document.getElementById(decodeURIComponent(anchor.hash.slice(1)))).map(anchor => anchor.outerHTML),
      duplicateIds: [...document.querySelectorAll('[id]')].map(element => element.id).filter((id, index, ids) => ids.indexOf(id) !== index),
    }));
    check('All internal anchors resolve', documentLinks.brokenAnchors.length === 0, documentLinks.brokenAnchors);
    check('Document IDs are unique', documentLinks.duplicateIds.length === 0, documentLinks.duplicateIds);
    await capture('desktop-hero.png');
    await checkArt('1440px hero');
    const openingMotion = await run(`async (page) => {
      await page.evaluate(() => scrollTo({ top: 0, behavior: 'instant' }));
      await page.waitForTimeout(250);
      const start = await page.locator('.od-hero-boat').boundingBox();
      await page.waitForFunction(() => document.querySelector('#top')?.getAttribute('data-weather-renderer') === 'paper-webgl');
      const atmosphere = await page.evaluate(() => ({
        rain: document.querySelectorAll('.od-rain i').length,
        lightning: document.querySelectorAll('.od-lightning').length,
        waves: document.querySelectorAll('.od-wave-surface,.od-wave-ripple').length,
        weatherRenderer: document.querySelector('#top')?.getAttribute('data-weather-renderer'),
        waterRenderer: document.querySelector('#top')?.getAttribute('data-water-renderer'),
        shaderCanvases: [...document.querySelectorAll('#top canvas')].map(canvas => ({ width: canvas.width, height: canvas.height, parent: canvas.parentElement?.className })),
      }));
      await page.locator('#top').evaluate(element => scrollTo({ top: element.offsetTop + (element.offsetHeight - innerHeight) * .98, behavior: 'instant' }));
      await page.waitForTimeout(250);
      const end = await page.locator('.od-hero-boat').boundingBox();
      await page.evaluate(() => scrollTo({ top: 0, behavior: 'instant' }));
      await page.waitForTimeout(150);
      return { start, end, atmosphere, viewport: await page.evaluate(() => innerWidth) };
    }`);
    check('Opening ship travels from the left edge to the right edge', openingMotion.start?.x < 0 && openingMotion.end?.x > openingMotion.viewport - openingMotion.end.width && openingMotion.end.x - openingMotion.start.x > openingMotion.viewport * .8, openingMotion);
    check('Opening storm has animated rain, lightning, and layered waves', openingMotion.atmosphere.rain >= 48 && openingMotion.atmosphere.lightning === 2 && openingMotion.atmosphere.waves === 2, openingMotion.atmosphere);
    check('Opening uses the licensed Paper and Wave.js shader renderers', openingMotion.atmosphere.weatherRenderer === 'paper-webgl' && openingMotion.atmosphere.waterRenderer === 'webgl2' && openingMotion.atmosphere.shaderCanvases.length === 2 && openingMotion.atmosphere.shaderCanvases.every(canvas => canvas.width > 0 && canvas.height > 0), openingMotion.atmosphere);
    await run(`async (page) => {
      await page.locator('#top').evaluate(element => scrollTo({ top: element.offsetTop + (element.offsetHeight - innerHeight) * .5, behavior: 'instant' }));
      await page.waitForTimeout(780);
      return true;
    }`);
    await capture('desktop-hero-storm-peak.png');
    await run(`async (page) => {
      await page.locator('#top').evaluate(element => scrollTo({ top: element.offsetTop + (element.offsetHeight - innerHeight) * .98, behavior: 'instant' }));
      await page.waitForTimeout(250);
      return true;
    }`);
    await capture('desktop-hero-arrival.png');
    await evaluate(() => { scrollTo({ top: 0, behavior: 'instant' }); return true; });
    await accessibility('Desktop WCAG 2.1 AA');

    const sections = state.sections.filter(section => section.id && section.top > 100);
    for (const section of sections) {
      await run(`async (page) => {
        await page.locator(${JSON.stringify(`#${section.id}`)}).evaluate(element => window.scrollTo({ top: element.getBoundingClientRect().top + scrollY - 92, behavior: 'instant' }));
        await page.waitForTimeout(600);
        return true;
      }`);
      await capture(`desktop-${section.id}.png`);
    }

    await call('browser_click', { target: 'nav[aria-label="Main navigation"] a[href="#schedule"]', element: 'Schedule navigation link' });
    await run(`async (page) => { await page.waitForTimeout(1000); return true; }`);
    const scheduleNav = await evaluate(() => ({ hash: location.hash, top: Math.round(document.querySelector('#schedule')?.getBoundingClientRect().top ?? -1) }));
    check('Header schedule link reaches the schedule section', scheduleNav.hash === '#schedule' && scheduleNav.top === 0, scheduleNav);

    // Responsive checks include the accepted concept's narrowest sizes and
    // short laptop screens, where sticky-stage typography is most vulnerable.
    for (const [width, height] of [[1920, 1080], [1440, 800], [1024, 768], [900, 900], [768, 1024], [375, 812], [320, 740]]) {
      await call('browser_resize', { width, height });
      await evaluate(() => { scrollTo({ top: 0, behavior: 'instant' }); return true; });
      await settle();
      state = await geometry();
      check(`Layout fits ${width}x${height}`, !state.overflow && !state.clippedText.length, { overflow: state.overflow, clippedText: state.clippedText });
      if (width === 375 || width === 320 || height === 800) await capture(`viewport-${width}x${height}.png`);
      if (width === 1920) {
        await capture('desktop-1920-hero.png');
        await checkArt('1920px hero');
      }
      if (width === 375) {
        const mobileMenu = await run(`async (page) => {
          await page.getByRole('button', { name: 'Open navigation', exact: true }).click();
          const opened = await page.locator('#mobile-navigation').isVisible();
          await page.keyboard.press('Escape');
          const escaped = await page.getByRole('button', { name: 'Open navigation', exact: true }).evaluate(element => document.activeElement === element);
          await page.getByRole('button', { name: 'Open navigation', exact: true }).click();
          await page.locator('#mobile-navigation').getByRole('link', { name: 'Schedule' }).click();
          await page.waitForTimeout(900);
          return { opened, escaped, closedAfterLink: !(await page.locator('#mobile-navigation').isVisible()), hash: await page.evaluate(() => location.hash) };
        }`);
        check('Mobile menu opens, Escape restores focus, and navigation closes it', mobileMenu.opened && mobileMenu.escaped && mobileMenu.closedAfterLink && mobileMenu.hash === '#schedule', mobileMenu);
        await accessibility('375px WCAG 2.1 AA');
        for (const section of state.sections.filter(section => section.id && section.top > 100)) {
          await run(`async (page) => {
            await page.locator(${JSON.stringify(`#${section.id}`)}).evaluate(element => window.scrollTo({ top: element.getBoundingClientRect().top + scrollY - 76, behavior: 'instant' }));
            await page.waitForTimeout(500);
            return true;
          }`);
          await capture(`mobile-375-${section.id}.png`);
        }
      }
    }

    await run(`async (page) => {
      await page.setViewportSize({ width: 375, height: 812 });
      page.__qaDensitySession = await page.context().newCDPSession(page);
      await page.__qaDensitySession.send('Emulation.setDeviceMetricsOverride', { width: 375, height: 812, deviceScaleFactor: 2, mobile: true });
      await page.goto(${JSON.stringify(origin)}, { waitUntil: 'networkidle' });
      return true;
    }`);
    await checkArt('375px DPR2 hero');
    await capture('mobile-dpr2-hero.png', 'device');
    await run(`async (page) => {
      await page.__qaDensitySession.send('Emulation.clearDeviceMetricsOverride');
      await page.__qaDensitySession.detach();
      await page.setViewportSize({ width: 1440, height: 960 });
      await page.evaluate(() => localStorage.setItem('hackuta-motion', 'off'));
      await page.emulateMedia({ reducedMotion: 'no-preference' });
      await page.reload({ waitUntil: 'networkidle' });
      return true;
    }`);
    await settle();
    const legacyMotion = await evaluate(() => ({ legacy: localStorage.getItem('hackuta-motion'), hero: document.querySelector('#top')?.getAttribute('data-animated') }));
    check('Legacy stored motion-off does not disable default animation', legacyMotion.hero === 'true', legacyMotion);
    await run(`async (page) => { await page.emulateMedia({ reducedMotion: 'reduce' }); await page.reload({ waitUntil: 'networkidle' }); return true; }`);
    await settle();
    await capture('reduced-motion-hero.png');
    const reduced = await evaluate(() => ({
      mediaMatches: matchMedia('(prefers-reduced-motion: reduce)').matches,
      mode: document.documentElement.dataset.motion,
      longSections: [...document.querySelectorAll('main section')].filter(el => el.getBoundingClientRect().height > innerHeight * 3).map(el => ({ id: el.id, height: el.getBoundingClientRect().height })),
      activeAnimations: document.getAnimations().filter(animation => animation.playState === 'running').length,
      heroAnimated: document.querySelector('#top')?.getAttribute('data-animated'),
    }));
    check('Reduced-motion media preference is emulated', reduced.mediaMatches, reduced);
    check('Reduced-motion has no running CSS animations', reduced.activeAnimations === 0, reduced.activeAnimations);
    check('Reduced-motion disables hero animation', reduced.heroAnimated === 'false', reduced);
    await run(`async (page) => { await page.emulateMedia({ reducedMotion: 'no-preference' }); await page.reload({ waitUntil: 'networkidle' }); await page.keyboard.press('Tab'); return true; }`);
    const firstFocus = await evaluate(() => ({ text: document.activeElement?.textContent?.trim(), href: document.activeElement?.getAttribute('href'), top: document.activeElement?.getBoundingClientRect().top }));
    check('Keyboard begins with a visible skip link', Boolean(firstFocus.href?.startsWith('#')) && /skip/i.test(firstFocus.text) && firstFocus.top >= 0, firstFocus);
    await call('browser_press_key', { key: 'Enter' });
    const skipTarget = await evaluate(() => ({ hash: location.hash, scrollY, focused: document.activeElement?.id }));
    check('Skip link reaches page content', skipTarget.scrollY > 0 || Boolean(skipTarget.focused), skipTarget);
    const runtimeErrors = await evaluate(() => window.__qaErrors || []);
    check('No runtime exceptions', runtimeErrors.length === 0, runtimeErrors);
    const consoleText = await call('browser_console_messages', { level: 'warning' });
    report.console = consoleText;
    check('Browser console has no errors', !/\[ERROR\]/.test(String(consoleText)), consoleText);
    check('Browser console has no font decoding warnings', !/Failed to decode|OTS parsing error/.test(String(consoleText)), consoleText);
  }
} catch (error) {
  report.fatalError = error.stack;
  console.error(error.stack);
  process.exitCode = 1;
} finally {
  report.finishedAt = new Date().toISOString();
  report.passed = !report.fatalError && report.checks.every(result => result.pass);
  await writeFile(path.join(output, 'qa-report.json'), `${JSON.stringify(report, null, 2)}\n`);
  if (serverLog) await writeFile(path.join(output, 'server.log'), serverLog);
  await client.close();
  if (!report.passed) process.exitCode = 1;
  console.log(`QA report: ${path.join(output, 'qa-report.json')}`);
}
