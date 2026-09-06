# Browser verification

The design QA harness uses Microsoft's actual `@playwright/mcp` server over the MCP stdio protocol. The JavaScript client discovers the server's tools and calls `browser_navigate`, `browser_resize`, `browser_evaluate`, `browser_run_code_unsafe` (or `browser_run_code` on older releases), `browser_take_screenshot`, `browser_press_key`, and `browser_console_messages`.

Start the website locally, then run:

```powershell
node scripts/qa-mcp.mjs
```

The default URL is `http://127.0.0.1:5173`. Set `QA_BASE_URL` to test a different development or preview server. The default browser is the installed Microsoft Edge; set `QA_BROWSER` to another browser supported by Playwright MCP if needed. Each run uses an isolated headless browser profile.

Screenshots and the complete MCP tool transcript are generated in `artifacts/mcp/`. `qa-report.json` records each check, actual result, discovered tool schemas, and timestamps. The command exits unsuccessfully when a check fails or a tool reports an error.

The checks cover decoded custom fonts, loaded images, desktop and mobile horizontal clipping, section screenshots, header navigation to the schedule, mobile navigation, system reduced motion, the keyboard skip link, runtime exceptions, and browser console output. The opening audit also measures the ship's full left-to-right traversal; confirms rain, lightning, and both water layers; and verifies that the licensed Paper Dithering and Wave.js canvas renderers initialize. Dedicated screenshots record departure, storm peak, and arrival. The retired manual motion switch must be absent, and a legacy `hackuta-motion=off` local-storage value must not suppress default animation. Axe checks WCAG 2.1 A/AA rules at desktop and mobile sizes. Dimensions include 1920×1080, 1440×960, 1440×800, 1024×768, 900×900, 768×1024, 375×812, and 320×740.

The artwork checks measure actual loaded image dimensions against their rendered `object-fit` dimensions and device pixel ratio. They reject stretched aspect ratios or enlargement beyond the available pixels, and check that hero coast imagery does not collide with hero copy. These run at desktop widths of 1440 and 1920 pixels and on a 375-pixel mobile viewport with DPR 2; mobile evidence is captured at device resolution.

The Playwright regression tests in `tests/site.spec.ts` cover event content, schedule tabs, the opening ship traversal, external renderers and storm layers, the mobile menu, system motion preferences, and compact/landscape layouts.

Automated checks are not a complete accessibility certification or cross-browser guarantee. Browser execution here uses Microsoft Edge; Safari, Firefox, real-device touch behavior, and assistive-technology testing remain launch-stage checks.

Reference: [Microsoft Playwright MCP documentation](https://github.com/microsoft/playwright-mcp).
