import { mkdir, readFile, writeFile, copyFile } from 'node:fs/promises'
import sharp from 'sharp'
import wawoff2 from 'wawoff2'

await Promise.all(['public/images', 'public/fonts'].map(path => mkdir(path, { recursive: true })))
const source = 'design/assets/'
const normalizeBackdrop = async (name) => {
  const { data, info } = await sharp(`${source}island-${name}-v7.png`).ensureAlpha().raw().toBuffer({ resolveWithObject: true })
  // Image generation adds a faint warm vignette even when asked for a flat
  // canvas. Normalize only near-black pixels so each illustration disappears
  // cleanly into the site's night field while preserving all colored linework.
  for (let offset = 0; offset < data.length; offset += 4) {
    if (data[offset] < 58 && data[offset + 1] < 48 && data[offset + 2] < 42) {
      data[offset] = 29
      data[offset + 1] = 25
      data[offset + 2] = 21
      data[offset + 3] = 255
    }
  }
  return sharp(data, { raw: info }).webp({ quality: 95 }).toFile(`public/images/island-${name}-v7.webp`)
}
await Promise.all([
  sharp(source + 'coast-cliff-v7.png').webp({ quality: 95, alphaQuality: 100 }).toFile('public/images/coast-cliff-v7.webp'),
  ...['departure', 'encounter', 'discovery', 'return'].map(normalizeBackdrop),
  copyFile(source + 'fonts/BarlowSemiCondensed-OFL.txt', 'public/fonts/OFL.txt'),
])
// The encoder shares WASM memory: parallel compression can corrupt its output.
for (const weight of ['Regular', 'SemiBold', 'Bold']) {
  const font = await readFile(`${source}fonts/BarlowSemiCondensed-${weight}.ttf`)
  const compressed = Buffer.from(await wawoff2.compress(font))
  await writeFile(`public/fonts/BarlowSemiCondensed-${weight}.woff2`, compressed)
}
const wordmark = (await readFile(source + 'hackuta-wordmark-v6.svg', 'utf8'))
  .replace('<svg ', '<svg x="90" y="170" width="1020" height="148" ')
  .replace('#211912', '#1a3a52')
const social = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630"><rect width="1200" height="630" fill="#eee3d2"/><circle cx="600" cy="480" r="235" fill="#dfd1bd"/>${wordmark}<g fill="#1a3a52" font-family="sans-serif" text-anchor="middle"><text x="600" y="120" font-size="24" letter-spacing="7">THE ODYSSEY · 2026</text><text x="600" y="390" font-size="28">NOVEMBER 14–15 · UT ARLINGTON</text><text x="600" y="530" font-size="22">Bring an idea. Find your crew.</text></g></svg>`
await sharp(Buffer.from(social)).png().toFile('public/images/social-card.png')
console.log('Production artwork, compressed fonts and social preview prepared.')
