import { access, copyFile, mkdir, readFile, writeFile } from "node:fs/promises";
import { constants } from "node:fs";
import path from "node:path";
import sharp from "sharp";
import wawoff2 from "wawoff2";

const LOGO_WIDTHS = [120, 240, 400, 640];
const COAST_WIDTHS = [400, 560, 800, 1120];
const DESIGN = "design/assets/";

async function fileExists(filePath) {
  try {
    await access(filePath, constants.F_OK);
    return true;
  } catch {
    return false;
  }
}

async function firstExisting(paths) {
  for (const candidate of paths) {
    if (await fileExists(candidate)) return candidate;
  }
  return null;
}

async function generateResponsiveWebp({
  source,
  outDir,
  baseName,
  widths,
  quality = 85,
}) {
  await mkdir(outDir, { recursive: true });
  const meta = await sharp(source).metadata();
  const aspect = (meta.width ?? 1) / (meta.height ?? 1);

  for (const width of widths) {
    const height = Math.round(width / aspect);
    await sharp(source)
      .resize(width, height, { fit: "inside", withoutEnlargement: true })
      .webp({ quality, alphaQuality: 90 })
      .toFile(path.join(outDir, `${baseName}-${width}.webp`));
  }

  console.log(`  ${baseName}: ${widths.join(", ")}w from ${source}`);
}

await Promise.all([
  mkdir("public/images/logos", { recursive: true }),
  mkdir("public/images/coast", { recursive: true }),
  mkdir("public/fonts", { recursive: true }),
]);

for (const [baseName, fileName] of [
  ["hackuta-logo", "hackuta-logo.png"],
  ["hackuta-logo-white", "hackuta-logo-white.png"],
]) {
  const source = await firstExisting([
    path.join(DESIGN, fileName),
    path.join("public/images", fileName),
  ]);

  if (source) {
    await generateResponsiveWebp({
      source,
      outDir: "public/images/logos",
      baseName,
      widths: LOGO_WIDTHS,
    });
  } else {
    console.warn(`Skipping ${baseName}: source not found`);
  }
}

const whiteLogo = await firstExisting([
  path.join(DESIGN, "hackuta-logo-white.png"),
  path.join("public/images", "hackuta-logo-white.png"),
  path.join("public/images/logos", "hackuta-logo-white-400.webp"),
  path.join("public/images/logos", "hackuta-logo-white-120.webp"),
]);

if (whiteLogo) {
  const iconOptions = {
    fit: "contain",
    background: { r: 0, g: 0, b: 0, alpha: 0 },
  };

  const favicon32 = await sharp(whiteLogo)
    .resize(32, 32, iconOptions)
    .png()
    .toBuffer();
  await writeFile("public/images/favicon-32.png", favicon32);

  await sharp(whiteLogo)
    .resize(180, 180, iconOptions)
    .png()
    .toFile("public/images/apple-touch-icon.png");

  const faviconSvgSource = await sharp(whiteLogo)
    .resize(64, 64, iconOptions)
    .png()
    .toBuffer();
  const faviconSvg = `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 64 64"><image width="64" height="64" xlink:href="data:image/png;base64,${faviconSvgSource.toString("base64")}"/></svg>`;
  await writeFile("public/favicon.svg", faviconSvg);

  console.log("  favicon.svg, favicon-32.png, apple-touch-icon.png");
}

const coastSource = await firstExisting([
  path.join(DESIGN, "coast-cliff-v7.png"),
  path.join("public/images", "coast-cliff-v7.webp"),
]);

if (coastSource) {
  await generateResponsiveWebp({
    source: coastSource,
    outDir: "public/images/coast",
    baseName: "coast-cliff-v7",
    widths: COAST_WIDTHS,
    quality: 82,
  });
} else {
  console.warn(
    "Skipping coast: add design/assets/coast-cliff-v7.png or public/images/coast-cliff-v7.webp",
  );
}

if (await fileExists(path.join(DESIGN, "fonts/BarlowSemiCondensed-Regular.ttf"))) {
  await copyFile(
    path.join(DESIGN, "fonts/BarlowSemiCondensed-OFL.txt"),
    "public/fonts/OFL.txt",
  );

  async function compressFont(name, extension) {
    const font = await readFile(path.join(DESIGN, "fonts", `${name}.${extension}`));
    const compressed = Buffer.from(await wawoff2.compress(font));
    await writeFile(`public/fonts/${name}.woff2`, compressed);
  }

  for (const weight of ["Regular", "SemiBold", "Bold"]) {
    await compressFont(`BarlowSemiCondensed-${weight}`, "ttf");
  }
  await compressFont("CSGelios-Regular", "otf");
  console.log("  compressed fonts");
} else {
  console.warn("Skipping fonts: design/assets/fonts not found");
}

if (await fileExists(path.join(DESIGN, "hackuta-wordmark-v6.svg"))) {
  const wordmark = (await readFile(path.join(DESIGN, "hackuta-wordmark-v6.svg"), "utf8"))
    .replace("<svg ", '<svg x="90" y="170" width="1020" height="148" ')
    .replace("#211912", "#1a3a52");
  const social = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630"><rect width="1200" height="630" fill="#eee3d2"/><circle cx="600" cy="480" r="235" fill="#dfd1bd"/>${wordmark}<g fill="#1a3a52" font-family="sans-serif" text-anchor="middle"><text x="600" y="120" font-size="24" letter-spacing="7">THE ODYSSEY · 2026</text><text x="600" y="390" font-size="28">NOVEMBER 14–15 · UT ARLINGTON</text><text x="600" y="530" font-size="22">Bring an idea. Find your crew.</text></g></svg>`;
  await sharp(Buffer.from(social)).png().toFile("public/images/social-card.png");
  console.log("  social-card.png");
}

console.log("Asset preparation complete.");
