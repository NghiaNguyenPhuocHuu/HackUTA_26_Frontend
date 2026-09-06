# Browser verification

The design QA harness uses Microsoft's actual `@playwright/mcp` server over the MCP stdio protocol. The JavaScript client discovers the server's tools and calls `browser_navigate`, `browser_resize`, `browser_evaluate`, `browser_run_code_unsafe` (or `browser_run_code` on older releases), `browser_take_screenshot`, `browser_press_key`, and `browser_console_messages`.

Start the website locally, then run:

```powershell
node scripts/qa-mcp.mjs
```

The default URL is `http://127.0.0.1:5173`. Set `QA_BASE_URL` to test a different development or preview server. The default browser is the installed Microsoft Edge; set `QA_BROWSER` to another browser supported by Playwright MCP if needed. Each run uses an isolated headless browser profile.

Screenshots and the complete MCP tool transcript are generated in `artifacts/mcp/`. `qa-report.json` records each check, actual result, discovered tool schemas, and timestamps. The command exits unsuccessfully when a check fails or a tool reports an error.

The checks cover decoded custom fonts, loaded images, desktop and mobile horizontal clipping, section screenshots, chapter selection and keyboard shortcuts, mobile navigation, system reduced motion, the keyboard skip link, runtime exceptions, and browser console output. The opening audit also measures the ship's full left-to-right traversal; confirms rain, lightning, and both water layers; and verifies that the licensed Paper Dithering and Wave.js canvas renderers initialize. Dedicated screenshots record departure, storm peak, and arrival. The retired manual motion switch must be absent, and a legacy `hackuta-motion=off` local-storage value must not suppress default animation. Axe checks WCAG 2.1 A/AA rules at desktop and mobile sizes. Dimensions include 1920×1080, 1440×960, 1440×800, 1024×768, 900×900, 768×1024, 375×812, and 320×740.

The artwork checks measure actual loaded image dimensions against their rendered `object-fit` dimensions and device pixel ratio. They reject stretched aspect ratios or enlargement beyond the available pixels, and check that island image rectangles do not collide with chapter copy. Hero copy is also checked against the foreground ship. These run at desktop widths of 1440 and 1920 pixels and on a 375-pixel mobile viewport with DPR 2; mobile evidence is captured at device resolution. Pixel density does not by itself prove that source artwork has detailed edges, so the screenshots still require visual inspection.

## Review notes

The refined v8 design passed **67/67 MCP checks**, with **zero console errors or warnings**, on September 5, 2026 at `http://127.0.0.1:5173`. The checked implementation used separate v7 island artwork; Paper Dithering and Wave.js for the opening atmosphere and sea; a full-width storm voyage; and no manual motion switch.

The September 5, 2026 implementation review found and corrected three issues: a mobile header status overriding the responsive hidden state, insufficient contrast on small schedule labels, and corrupted WOFF2 output from parallel calls to a shared-memory font encoder. The asset pipeline now compresses fonts sequentially and copies the returned buffer; the browser audit explicitly verifies that the intended regular and semibold faces have loaded.

The ten Playwright regression tests in `tests/site.spec.ts` cover event content, the opening ship traversal, external renderers and storm layers, the mobile menu, system motion preferences, compact/landscape layouts, desktop artwork composition, and mobile image density. All ten passed against the refined implementation.

Automated checks are not a complete accessibility certification or cross-browser guarantee. Browser execution here uses Microsoft Edge; Safari, Firefox, real-device touch behavior, and assistive-technology testing remain launch-stage checks.

Reference: [Microsoft Playwright MCP documentation](https://github.com/microsoft/playwright-mcp).
