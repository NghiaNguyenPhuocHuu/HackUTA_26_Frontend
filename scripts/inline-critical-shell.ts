import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import type { Plugin } from "vite";

const criticalShellPath = resolve("src/styles/critical.css");

export function inlineCriticalShell(): Plugin {
  return {
    name: "inline-critical-shell",
    transformIndexHtml: {
      order: "post",
      handler(html) {
        if (html.includes('id="critical-shell"')) return html;
        const criticalShell = readFileSync(criticalShellPath, "utf8");
        return html.replace(
          "</head>",
          `<style id="critical-shell">${criticalShell}</style></head>`,
        );
      },
    },
  };
}
