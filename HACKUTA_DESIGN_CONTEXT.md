# HackUTA 2026 Landing Page — Design Context

Last updated: September 4, 2026

## Project status

- Repository: `hackuta-2026-repository`
- Current scope is the frontend landing page only.
- **Implemented sections:** Hero, About, Schedule (tabbed day timeline), FAQ, Sponsors, Footer.
- **Retired from the live page:** the four-chapter Voyage scroll sequence and the standalone Arrival CTA (footer now carries the homecoming content).
- Palette tokens live in `src/styles/index.css` (`--color-*` / `--ink`, `--clay`, etc.).

## Theme and chosen art direction

- Theme: Greek mythology, focused on Homer's *Odyssey*.
- Preferred visual treatment: ancient pottery and illustration, not cinematic realism or marble-statue neoclassicism.
- Dominant historical grammar: Attic/Corinthian black-figure pottery.
- Use red-figure inversion once as a deliberate dramatic transition, not randomly throughout the page.
- Avoid directly copying the contemporary *Odyssey* movie's logo, costumes, key art, or promotional compositions. Draw from the public-domain myth and historical pottery instead.

## Core creative concept: The Living Frieze

Treat the landing page like an ancient vase painting unwrapped into a continuous narrative band. Vertical scrolling advances the user's voyage, including one major horizontal, pinned pottery frieze on desktop.

Central event metaphor:

> HackUTA is the beginning of the hacker's odyssey: gather your crew, face challenges, and return with something worth remembering.

Working hero copy:

> HACKUTA 2026  
> YOUR ODYSSEY BEGINS HERE  
> 24 hours. One crew. Build something worthy of legend.

Primary CTA: `BEGIN THE JOURNEY`  
Secondary CTA: `LEARN MORE`

The date, location, and registration CTA must be visible in the initial viewport. Users should not need to complete an animation before receiving essential information.

## Recommended page narrative

1. **Hero / The Amphora Awakens**
   - Terracotta field with black-figure artwork.
   - A monumental amphora rises or assembles.
   - Meander bands draw around the vessel.
   - Sailors and a ship appear as if painted onto the clay.
   - The title resolves from incised linework.
   - The painted band unwraps into the page.

2. **The Call — What is HackUTA?**
   - "Every epic begins with a challenge."
   - A messenger carries or unfurls the event explanation.

3. **Gather Your Crew — Who belongs here?**
   - "No experience required. Every crew needs a first voyage."
   - Figures representing beginners, designers, developers, and builders join the ship and take the oars.

4. **The Voyage — The signature scroll sequence**
   - Pin the viewport for approximately 300–400vh on desktop.
   - Vertical scrolling moves a continuous black-figure frieze horizontally.
   - Chapters: discovery, opening ceremony, hacking, late-night debugging, mentors/workshops, submissions/judging, and awards.
   - A small ship follows a painted wave through every chapter.
   - Translate hackathon experiences humorously: a Hydra of software bugs, notification Sirens, a Cyclops compiler error, and Athena offering documentation or mentorship.

5. **Face the Trials — Tracks and challenges**
   - Pottery-panel cards.
   - On entry or hover, outlined figures fill with black glaze.

6. **Claim the Spoils — Prizes and event benefits**
   - Laurel wreaths, food, prizes, and animated inscriptions/statistics.

7. **Chronicles of Past Voyages**
   - Reveal real HackUTA photographs through irregular pottery-shard masks.
   - Optionally transition photos into simplified black-figure tracings.

8. **Ask the Oracle — FAQ**
   - Keep the accordion conventional and readable.
   - Only use subtle eye, tile, or incised-line motion.

9. **Sponsors of the Journey**
   - Treat logos like makers' stamps while retaining their official colors and legibility when required.
   - Avoid a large pinned animation here.

10. **Arrival / Final CTA**
    - The ship reaches a stylized Arlington/UTA destination at sunrise.
    - The completed amphora returns as a visual payoff.
    - Copy idea: "The next legend has not been written. Will it be yours?"
    - CTA: `BEGIN YOUR ODYSSEY`

Keep normal navigation labels such as About, Schedule, FAQ, and Sponsors. Mythological phrases can flavor section headings but should not make navigation ambiguous.

## Major scroll moments

Limit the page to two long pinned sequences:

### 1. Hero launch

- Approximately 250–320vh with a 100svh sticky stage.
- Amphora assembly, painted-figure reveal, sun/wave movement, and ship departure.
- Use layered SVG rather than mandatory 3D.

### 2. Horizontal Living Frieze

- Approximately 300–400vh on desktop.
- One coordinated GSAP timeline moves the frieze and ship through the event story.
- On mobile, remove the long horizontal pin. Stack scenes vertically and let the ship descend along a winding route.

Supporting motion should be quieter:

- Greek-key border doubles as journey/page progress.
- Incised strokes draw into place.
- Oars row with restrained alternating motion.
- Statistics appear like painted inscriptions.
- Pottery shards reveal event photography.
- Decorative loops pause while off-screen.

### Kiln transition

At dawn or the shift from struggle to achievement, invert the visual language:

- Before: terracotta ground with black figures.
- After: black ground with terracotta figures.

This provides a dramatic transformation grounded in the historical move from black-figure to red-figure pottery.

## Visual system

Site palette (defined in `src/styles/index.css`):

- Ink: `#1a3a52` (`--color-ink` / `--ink`) — primary text and borders
- Night: `#102f46` (`--color-night` / `--night`) — dark section backgrounds
- Clay: `#eee3d2` (`--color-clay` / `--clay`) — light section backgrounds
- Sand: `#ded0bc` (`--color-sand` / `--sand`) — secondary surfaces
- Light: `#f6eddf` (`--color-light` / `--light`) — lighter highlights
- Ocean: `#305873` (`--color-ocean` / `--ocean`) — accent / secondary text
- Mist: `#8ca1aa` (`--color-mist` / `--mist`) — muted UI

Avoid metallic gold and white marble as dominant treatments; they push the identity toward generic neoclassical luxury rather than pottery.

Create an original reusable SVG illustration kit containing:

- Profile faces, almond eyes, patterned robes, shields, and ancient pose language
- Hackers, mentors, judges, and teams
- Ships, sails, hulls, waves, wind, and oars
- Sirens, Cyclops, Hydra, and Scylla
- Laptops reinterpreted as geometric tablets
- Cables rendered with serpent-like rhythm
- Scrolls, project artifacts, olive branches, and laurel wreaths
- Meanders, palmettes, rays, tongues, lotus bands, and rosettes

Motif semantics:

- Meander: journey/progress
- Wave: voyage and section transition
- Palmette: calm informational framing
- Rays: breakthrough, prizes, final CTA
- Rosettes: sparse decorative filler
- Figures: narrative information

Do not equally combine Geometric pottery, Corinthian animal friezes, mature Attic black-figure, red-figure, marble sculpture, and Renaissance engraving. Black-figure is dominant; Geometric patterns are supporting borders; red-figure is the intentional inversion.

## Technical direction

HackUTD's public production bundles were inspected as a reference. Their site uses GSAP/ScrollTrigger, Three.js/WebGL for selected scenes, sticky stages spanning several viewports, persistent backgrounds, horizontal pinned movement, mobile-specific variants, and reduced-motion handling.

Recommended HackUTA implementation:

- React/Next.js with TypeScript if consistent with team skills
- GSAP and ScrollTrigger for pinning, scrubbing, and coordinated timelines
- MotionPathPlugin for the ship following the voyage route
- SVG masks/clip paths for pottery and shard reveals
- `stroke-dasharray` and `stroke-dashoffset` for incised-line drawing
- CSS transforms and opacity for routine entrance animation
- Native scrolling; do not add smooth-scroll infrastructure without a demonstrated need
- Three.js only if the team later chooses a genuinely rotating 3D amphora
- Separate desktop, mobile, and reduced-motion timelines
- Meaningful text remains semantic HTML; decorative illustrations are not the only source of information

## Historical and visual references

- Met black-/red-figure technique: https://www.metmuseum.org/pt/essays/athenian-vase-painting-black-and-red-figure-techniques
- Met Greek Vase Painting book: https://resources.metmuseum.org/resources/metpublications/pdf/Greek_Vase_Painting.pdf
- Odysseus and Circe: https://www.metmuseum.org/art/collection/search/253627
- Odysseus and Polyphemos: https://www.metmuseum.org/art/collection/search/244857
- Odysseus returning to Penelope: https://www.metmuseum.org/art/collection/search/253053
- Siren form: https://www.metmuseum.org/art/collection/search/254191
- Scylla askos: https://www.metmuseum.org/art/collection/search/248471
- Canonical Siren Vase: https://www.britishmuseum.org/collection/object/G_1843-1103-31
- Exekias amphora: https://www.metmuseum.org/art/collection/search/250551
- Cleveland ornament reference: https://www.clevelandart.org/art/1923.644
- Cleveland Geometric bands: https://www.clevelandart.org/art/1927.6
- Parthenon continuous frieze: https://parthenonfrieze.gr/en/

Use public-domain/CC0 museum material as reference and build original HackUTA illustrations. Record each downloaded asset's source, creator/collection, accession number, and license in the eventual design handoff.

## Animation references

- GSAP ScrollTrigger: https://gsap.com/docs/v3/Plugins/ScrollTrigger/
- Scroll-driven SVG map: https://tympanus.net/codrops/2026/05/21/creating-scroll-driven-svg-map-animations-with-gsap/
- Responsive curved path: https://tympanus.net/codrops/2025/12/17/building-responsive-scroll-triggered-curved-path-animations-with-gsap/
- SVG mask transitions: https://tympanus.net/codrops/2026/03/11/svg-mask-transitions-on-scroll-with-gsap-and-scrolltrigger/
- GSAP responsive setup: https://gsap.com/docs/v3/GSAP/gsap.matchMedia%28%29/
- Reduced motion: https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/At-rules/%40media/prefers-reduced-motion
