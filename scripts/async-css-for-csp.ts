import type { Plugin } from "vite";

export function asyncCssForCsp(): Plugin {
  return {
    name: "async-css-for-csp",
    transformIndexHtml: {
      order: "post",
      handler(html) {
        const withoutInlineHandler = html.replace(
          /<link rel="preload" crossorigin href="([^"]+\.css)" onload="[^"]*" as="style">/,
          '<link rel="preload" crossorigin href="$1" as="style" id="app-styles">',
        );

        if (withoutInlineHandler.includes('src="/load-css.js"')) {
          return withoutInlineHandler;
        }

        return withoutInlineHandler.replace(
          "</body>",
          '    <script src="/load-css.js" defer></script>\n  </body>',
        );
      },
    },
  };
}
