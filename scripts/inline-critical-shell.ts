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
        // Both this shell and the app stylesheet are unlayered, so whichever
        // comes last in <head> wins ties. The shell only covers first paint,
        // so it goes first and lets the full sheet's breakpoints override it.
        return html.replace(
          /<head(\s[^>]*)?>/,
          (headTag) =>
            `${headTag}<style id="critical-shell">${criticalShell}</style>`,
        );
      },
    },
  };
}
