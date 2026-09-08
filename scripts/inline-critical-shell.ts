import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import type { Plugin } from "vite";

const criticalShell = readFileSync(
  resolve("src/styles/critical.css"),
  "utf8",
);

export function inlineCriticalShell(): Plugin {
  return {
    name: "inline-critical-shell",
    transformIndexHtml: {
      order: "post",
      handler(html) {
        if (html.includes('id="critical-shell"')) return html;
        return html.replace(
          "</head>",
          `<style id="critical-shell">${criticalShell}</style></head>`,
        );
      },
    },
  };
}
