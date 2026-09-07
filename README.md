# HackUTA 2026 · The Odyssey

The public landing page, built with React 19, TypeScript, Tailwind CSS 4, and Vite. The approved pottery-inspired concept is implemented as a continuous illustrated journey: a coastal departure, a welcome to the crew, a tabbed weekend schedule, a practical FAQ, supporters, and a footer homecoming.

**Event:** November 14–15, 2026 · UT Arlington · Applications open soon

## Run locally

Requires Node.js 22.12+ (tested on Node 24).

```sh
npm ci
npm run dev
```

Open http://127.0.0.1:5173. For a production preview:

```sh
npm run build
npm run preview
```

The production preview runs at http://127.0.0.1:4174. Deploy the generated `dist/` directory to a static host. No server, API keys, tracking, or external font requests are required.

## Design and motion

- **Palette:** ink, night, clay, sand, light, ocean, and mist tokens in `src/styles/index.css` (`--color-*` in `@theme`, aliased as `--ink`, `--clay`, etc.).
- **Typography:** self-hosted Barlow Semi Condensed for UI and body copy; CS Gelios for the hero display wordmark. The year suffix (`26`) uses Barlow because the current Gelios build lacks numerals.
- **Logos:** two PNG marks in `public/images/` — `hackuta-logo.png` (ink blue, for light backgrounds) and `hackuta-logo-white.png` (white, for dark/blue backgrounds). The `Logo` component in `src/components/art/Logo.tsx` accepts a `variant` prop (`light` | `dark`). The favicon and apple-touch icon use the white mark with a transparent background.
- **Header:** fixed three-column layout on desktop — brand logo, centered pill navigation, mobile menu toggle. The logo swaps automatically when the header theme shifts between clay and night. The MLH trust badge is fixed to the top-right and fades out on scroll.
- **Hero:** two-column copy block with the blue emblem logo, date, and `HackUTA 26` title. Scroll-choreographed coastal opening: the SVG ship emerges from behind the left cliff, crosses the full viewport, enters a WebGL storm, and disappears into the right coast. Scenery fades as the user scrolls away via a `--hero-exit` CSS variable. A licensed Paper Dithering shader supplies the pottery-like atmospheric field, while licensed Wave.js canvases form the animated sea beneath rain and timed lightning.
- **Schedule:** full-viewport clay section with Roman-numeral day tabs, a Greek-themed timeline tablet, and automatic default to whichever event day is closer to the current date.
- **Responsive motion:** the opening hero respects the system reduced-motion setting; visible keyboard focus and a skip link remain available.
- **Performance:** bounded shader resolutions, a capped wave frame rate, and automatic canvas/SVG fallbacks keep the cinematic opening practical across desktop and mobile hardware.
- **Assets:** optimized WebP coast artwork and WOFF2 fonts ship in `public/`. Source artwork lives in the gitignored `design/` directory and is not bundled into the site.

The desktop hero stage requires a viewport at least 960px wide for the full two-column layout. Decorative motion never gates event information.

## Editing

`src/App.tsx` composes the page. Section content lives in `src/components/`, reusable SVG artwork in `src/components/art/`, and shared colors, typography, and layout rules in `src/styles/`. System reduced-motion detection lives in `src/hooks/useMotionPreference.ts`.

`HACKUTA_DESIGN_CONTEXT.md` captures the broader creative direction. When the local `design/` directory is present, `design/DESIGN_V6.md`, `design/DESIGN_V7.md`, and `design/DESIGN_V8.md` record approved concept iterations; `scripts/prepare-assets.mjs` rebuilds production artwork and fonts from those sources:

```sh
npm run assets
```

To replace the site logos, drop updated PNGs into `public/images/` as `hackuta-logo.png` and `hackuta-logo-white.png` (transparent backgrounds). The ships, waves, and coast artwork remain editable SVG components where applicable.

## Licenses and attribution

- Barlow Semi Condensed: `public/fonts/OFL.txt`
- CS Gelios: demo build included for development — replace with a licensed webfont before production launch. See `public/fonts/CSGelios-LICENSE.txt` and `public/THIRD_PARTY_NOTICES.txt`.
- Paper Shaders and Wave.js: complete license copies in `public/licenses/` and notices in `public/THIRD_PARTY_NOTICES.txt`.

## Verify

```sh
npm run lint
npm run build
npm run test:e2e
npm run qa:mcp
```

The MCP audit requires the site to be running and uses an isolated Microsoft Edge browser through the actual Playwright MCP server. It captures desktop/mobile screenshots and checks navigation, responsive geometry, WCAG 2.1 AA rules with axe, the Paper and Wave.js renderers, system motion preferences, artwork density and collision geometry, keyboard interactions, and browser errors. See [docs/QA.md](docs/QA.md). The smaller regression suite starts/reuses the local server automatically. Microsoft Edge must be installed for the default test configuration.

## Before launch

This is a complete design-focused frontend, not an application portal. Applications are intentionally announced as opening soon; schedule times are tentative and supporters are unannounced. Replace those states only when real information and a registration destination are available.

Before going live:

- Confirm event details with the organizing team.
- License CS Gelios for production web use.
- Set an absolute social-image URL and canonical URL in `index.html` once the deployment domain is selected.
