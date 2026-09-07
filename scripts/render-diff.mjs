import { readFile } from "node:fs/promises";

const report = JSON.parse(await readFile("audit-out/report.json", "utf8"));
const engines = Object.keys(report.engines);
const viewports = Object.keys(report.engines[engines[0]].viewports);

console.log("=== CSS feature support ===");
const featureNames = Object.keys(
  report.engines[engines[0]].viewports[viewports[0]].features ?? {},
);
for (const f of featureNames) {
  const row = engines
    .map((e) => `${e}=${report.engines[e].viewports[viewports[0]].features[f]}`)
    .join("  ");
  const vals = engines.map(
    (e) => report.engines[e].viewports[viewports[0]].features[f],
  );
  const differs = new Set(vals).size > 1;
  console.log(`${differs ? "DIFF " : "     "}${f.padEnd(24)} ${row}`);
}

console.log("\n=== Geometry: webkit vs chromium (threshold 6px) ===");
const boxKeys = Object.keys(
  report.engines.webkit.viewports[viewports[0]].boxes ?? {},
);

for (const vp of viewports) {
  const wk = report.engines.webkit.viewports[vp];
  const cr = report.engines.chromium.viewports[vp];
  const ff = report.engines.firefox.viewports[vp];
  if (!wk?.boxes || !cr?.boxes) continue;

  const lines = [];
  for (const key of boxKeys) {
    const a = wk.boxes[key];
    const b = cr.boxes[key];
    const c = ff?.boxes?.[key];
    if (!a && !b) continue;
    if (!a || !b) {
      lines.push(`  ${key.padEnd(18)} MISSING webkit=${!!a} chromium=${!!b}`);
      continue;
    }
    const deltas = ["top", "left", "w", "h"]
      .map((d) => [d, a[d] - b[d]])
      .filter(([, v]) => Math.abs(v) > 6);
    if (deltas.length) {
      lines.push(
        `  ${key.padEnd(18)} ${deltas
          .map(([d, v]) => `${d}${v > 0 ? "+" : ""}${v}`)
          .join(" ")}   wk=${JSON.stringify(a)} cr=${JSON.stringify(b)}${
          c ? ` ff=${JSON.stringify(c)}` : ""
        }`,
      );
    }
  }
  if (lines.length) {
    console.log(`\n${vp}:`);
    lines.forEach((l) => console.log(l));
  } else {
    console.log(`\n${vp}: no geometry differences > 6px`);
  }
}

console.log("\n=== Canvas backing sizes ===");
for (const vp of viewports) {
  for (const e of engines) {
    const v = report.engines[e].viewports[vp];
    console.log(
      `${vp.padEnd(20)} ${e.padEnd(10)} ${JSON.stringify(v?.canvasSizes ?? [])}`,
    );
  }
}
