# HackUTA 2026 · Color palette

The site palette is inspired by Attic pottery and the coastal Odyssey theme: warm clay fields, deep night seas, and ink-blue figure work.

Source of truth: `src/styles/index.css` (`@theme` block and `:root` aliases).

## Core colors

| Name | Hex | CSS token | Typical use |
|------|-----|-----------|-------------|
| **Ink** | `#1a3a52` | `--color-ink` / `--ink` | Primary text, logos on light backgrounds, borders, UI on clay sections |
| **Night** | `#102f46` | `--color-night` / `--night` | Dark section backgrounds (About, Sponsors, hero water), header nav on dark areas |
| **Clay** | `#eee3d2` | `--color-clay` / `--clay` | Light section backgrounds (Schedule, FAQ, Footer), text on dark sections |
| **Sand** | `#ded0bc` | `--color-sand` / `--sand` | Secondary text on dark backgrounds, header/nav on night sections |
| **Light** | `#f6eddf` | `--color-light` / `--light` | Highlights, soft fills, body text on dark navy |
| **Ocean** | `#305873` | `--color-ocean` / `--ocean` | Mid-tone blue accents, decorative lines, olive branch tint |
| **Mist** | `#8ca1aa` | `--color-mist` / `--mist` | Muted borders, subtle dividers, secondary UI |

## Section themes

Sections use `data-theme` to switch between light and dark treatment:

| Theme | Background feel | Text / nav |
|-------|-----------------|------------|
| **Clay** (`data-theme="clay"`) | `--clay` fields | `--ink` text, dark blue logo |
| **Dark** (`data-theme="dark"`) | `--night` gradients | `--sand` / `--light` text, white logo |

**Clay sections:** Schedule, FAQ, Footer  
**Dark sections:** Hero (storm), About, Sponsors

## Logos

| Variant | Asset | When to use |
|---------|-------|-------------|
| **Light** | Blue mark (`hackuta-logo`) | On clay / light backgrounds |
| **Dark** | White mark (`hackuta-logo-white`) | On night / dark backgrounds |

Favicon and apple-touch icon use the white mark on a transparent background.

## Quick reference (CSS)

```css
--ink:   #1a3a52;
--night: #102f46;
--clay:  #eee3d2;
--sand:  #ded0bc;
--light: #f6eddf;
--ocean: #305873;
--mist:  #8ca1aa;
```

In components, prefer the short aliases (`var(--ink)`, `var(--clay)`, etc.) over hard-coded hex values.
