# AGENTS.md

Shared guide for any AI coding agent (or human) working on this repo. Also
read `AGENTS.local.md` (untracked, if present) for personal workflow prefs.

## What this repo is

A static, no-build portfolio for Abdullah Naseer. The repo is named
`ABNaseer.github.io`, so GitHub Pages serves it at https://abnaseer.github.io
from the `master` branch root. No build step, no package.json.

## Structure

```
index.html       The entire site (single page, anchor-linked sections)
css/styles.css   All styles; design tokens at the top as :root vars
js/script.js     Nav toggle, scroll-reveal, hash-free anchor scrolling,
                 data-disclosure-toggle expand/collapse, the one popup
assets/          fonts/, img/ (favicon/, thumbs/, one folder per project),
                 og-image.png, the resume PDF
robots.txt, sitemap.xml, llms.txt   Root on purpose (crawlers and AI
                 agents expect them there)
```

Untracked local files (never commit): `AGENTS.local.md`, `CLAUDE.md`,
`CLAUDE.local.md`, `LESSONS.md`, `TASKS.md`, `.claude/`, `skills-lock.json`.

## SEO / social preview

- `assets/img/favicon/`: "AN" monogram in the palette (Pillow, Liberation
  Serif Bold as a stand-in for Lora). `og-image.png` (1200x630) is
  referenced by absolute URL, as `og:image` requires.
- `<head>` carries canonical, `og:*`/`twitter:*` and a JSON-LD `Person`
  block. Keep title/description/URL in sync with the visible content, and
  regenerate `og-image.png` if the hero tagline changes.
- `robots.txt` allows everyone and also names the main AI crawlers/agents
  explicitly. `llms.txt` is a plain-text summary of the page for LLMs;
  update it (and `lastmod` in `sitemap.xml`) when experience or projects
  change.

## Images

- Screenshots, thumbnails and logos are `.webp` (Pillow, quality 85, max
  1600px long side). Exceptions: `og-image.png` and the favicon set.
- Every `<img>` has real `width`/`height` attrs (prevents layout shift; CSS
  still sets display size). No `<picture>` fallbacks, no leftover PNGs.

## Design system

Everything themeable is a token in `:root`. Don't hardcode colours, fonts or
spacing elsewhere.

- **Palette**: sepia/parchment, no dark mode. `--color-bg`/`--color-bg-alt`
  (parchment), `--color-surface` (cards), `--color-ink`/`--color-ink-soft`
  (warm brown text, never black), `--color-accent`/`--color-accent-dark`
  (sienna), `--color-rule`/`--color-border`. New colours must pass WCAG AA.
- **Fonts**: `--font-serif` (Lora) for headings and body, `--font-sans`
  (Source Sans 3) for UI chrome. Self-hosted latin-subset woff2 in
  `assets/fonts/`, two preloaded in `<head>`. Don't reintroduce Google Fonts
  `<link>` tags; add a new `@font-face` instead.
- **Spacing**: `--space-1`..`--space-6`. No arbitrary values.
- **Desktop layout (>=960px)**: sections use a "margin title" grid. The
  title sits in a sticky left column (`--margin-title-width`), content on the
  right, prose capped at `--measure`. Below 960px: centred single column.
- **Hover**: nav links match the hero buttons (fill `--color-accent-dark`,
  text `--color-bg`, `--radius` corners).
- **Dividers**: a faded hairline `.divider` between top-level sections.
- **Motion**: only the `.reveal` fade-in, respecting
  `prefers-reduced-motion`. No parallax, autoplay or anything flashy.

## Disclosures and the one popup

Get in Touch (`#contactModal`, `data-open-modal`) is the only popup.
Experience and Projects expand inline. Abdullah disliked popups there, so
don't reintroduce them.

- Any `[data-disclosure-toggle]` with `aria-controls` is wired by one
  handler: it toggles `.is-expanded` on the trigger and panel. Panels are
  `max-height: 0` until expanded to a fixed generous `max-height`.
- About's "Read the boring part" is its own clamp effect and works with JS
  off. Experience/Projects panels need JS (accepted trade-off; content stays
  in the accessibility tree). Don't make panels always-visible.
- Projects: the whole card header is the toggle. The panel holds the
  screenshot strip (`.project-modal__media`, GLightbox gallery), tech chips,
  a paragraph, and footer links (`.project-card__links` for two links).

**Tech-stack chips**: Simple Icons SVGs inlined with `fill="currentColor"`,
~20px. Check a slug resolves with `curl` first
(`cdn.jsdelivr.net/npm/simple-icons@latest/icons/<slug>.svg`). No icon for
Firestore (reuses Firebase) or Football-Data.org (hand-drawn globe).

**Card thumbnails** (`assets/img/thumbs/`): crops from each project's own
assets at the gallery box's ~1.38:1 ratio. Grownance uses its app icon on
its own `#f8fbfa` background. Collapsed, CSS tones every thumbnail sepia
(`--thumb-filter` + `mix-blend-mode: multiply`); expanded, hovered (mouse
only) or keyboard-focused shows full colour.
Keep the source files in colour. The LoL card's icon is the Simple Icons
`riotgames` fist (~52px): sepia collapsed, `--color-riot-red` (Riot's
official `#eb0029`) expanded.

**Phone screenshots** (Footy-Time): `.phone-frame--thumb` hugs the portrait
screenshot on the strip's parchment (no notch at thumb size). Lightbox
slides use inline `.phone-frame--lightbox` on a transparent slide.

**Experience logos** (`assets/img/logos/`): raster crops of each company's
real logo (~32px, `.timeline__logo`). Neither company is on Simple Icons.

## Content tone

Calm, first person, understated, like an author's note, not a landing page.

- No buzzwords ("synergy", "leverage", "passionate", "rockstar").
- Short, plain sentences; concrete detail over enthusiasm; modest is fine.
- Headings stay simple (About, Experience, Projects, Get in Touch). No Skills
  section; tech stack lives in each project's chips.
- Project descriptions are short paragraphs, not bullet lists.
- Screenshots must not expose private data: blur emails and filled-in
  fields unless Abdullah says a specific one can stay sharp.
- Placeholders: `<!-- TODO(Abdullah): ... -->`; never invent real details.

## Git

- Never add a "Co-Authored-By: Claude" trailer to commits or PRs.
- History was squashed to one commit on 2026-09-06 to fix commits being
  attributed to the wrong GitHub account (wrong `user.email`). A short
  history is expected, not a sign the project is new.
- Track only site files, `README.md` and this file.
- Never `git add -A` or `git add .`; stage files by name so the untracked
  local files above can't be swept in.
