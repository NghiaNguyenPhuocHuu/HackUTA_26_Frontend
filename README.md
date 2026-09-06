# HackUTA 2026 · The Odyssey

The public landing page, built with React 19, TypeScript, Tailwind CSS 4, and Vite. The approved pottery-inspired concept is implemented as a continuous illustrated journey: a coastal departure, a welcome to the crew, four Odyssey islands, the weekend outline, supporters, and a homecoming.

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

- Original incised SVG wordmark, self-hosted Barlow Semi Condensed typography, terracotta and ink palette.
- Scroll-choreographed coastal opening: the SVG ship emerges from behind the left cliff, crosses the full viewport, enters a WebGL storm, and disappears into the right coast. A licensed Paper Dithering shader supplies the pottery-like atmospheric field, while licensed Wave.js canvases form the animated sea beneath rain and timed lightning.
- Four scroll-driven island scenes with deliberate reading holds and keyboard-operable chapter navigation.
- Fully illustrated stacked chapters on smaller or short screens and when the operating system requests reduced motion.
- Motion is part of the default experience with no on-page switch. The system reduced-motion setting is still respected for accessibility; visible keyboard focus, a skip link, and a direct route past the voyage remain available.
- Separate high-resolution artwork for every island, rendered beside—not beneath—the chapter copy, with density checks for desktop and DPR2 mobile screens.
- Bounded shader resolutions, a capped wave frame rate, and automatic canvas/SVG fallbacks keep the cinematic opening practical across desktop and mobile hardware.
- Optimized WebP illustrations and WOFF2 fonts; source artwork and earlier design explorations remain in `design/` and are not bundled into the site.

The desktop pinned scenes require a viewport at least 960px wide and 660px high. They use native scrolling and requestAnimationFrame, not a scroll-jacking library. Decorative motion never gates event information.

## Editing

`src/App.tsx` composes the page. Section content lives in `src/components/`, reusable SVG artwork in `src/components/art/`, and shared colors, typography, and layout rules in `src/styles/`. System reduced-motion detection lives in `src/hooks/useMotionPreference.ts`.

`design/DESIGN_V6.md` records the approved concept, `design/DESIGN_V7.md` records the image-quality and composition refinement, and `design/DESIGN_V8.md` documents the externally sourced shader opening. `scripts/prepare-assets.mjs` rebuilds production artwork and fonts from the originals:

```sh
npm run assets
```

The font license is included at `public/fonts/OFL.txt`. Paper Shaders and Wave.js attribution and complete license copies are included in `public/THIRD_PARTY_NOTICES.txt` and `public/licenses/`. The v7 island and cliff sources were created specifically for this layout with the built-in image-generation workflow; their complete production prompts are recorded in `design/art-prompts-v7.md`. The wordmark, ships, and water lines remain editable SVG components.

## Verify

```sh
npm run lint
npm run build
npm run test:e2e
npm run qa:mcp
```

The MCP audit requires the site to be running and uses an isolated Microsoft Edge browser through the actual Playwright MCP server. It captures desktop/mobile screenshots and checks navigation, responsive geometry, WCAG 2.1 AA rules with axe, the Paper and Wave.js renderers, system motion preferences, artwork density and collision geometry, keyboard interactions, and browser errors. See [docs/QA.md](docs/QA.md). The smaller regression suite starts/reuses the local server automatically. Microsoft Edge must be installed for the default test configuration.

## Before launch

This is a complete design-focused frontend, not an application portal. Applications are intentionally announced as opening soon; schedule times remain TBA and supporters are unannounced. Replace those states only when real information and a registration destination are available. Confirm the event details with the organizing team, and set an absolute social-image URL and canonical URL in `index.html` once the deployment domain is selected.
