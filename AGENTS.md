# AGENTS.md

This file is committed to git — it's the shared guide for AI coding agents
(and humans) working on this repo, regardless of which tool is being used
(Claude Code, Codex, Gemini, etc.).

Also read `AGENTS.local.md` (untracked, if present) for personal workflow
preferences — plan-first process, subagent usage, lessons tracking, and the
like. That file is deliberately kept out of this one so project knowledge
(here) stays separate from personal working style (there).

## What this repo is

A static, no-build personal portfolio site for Abdullah Naseer. This repo is
named `ABNaseer.github.io` (GitHub's special "user site" name), so GitHub
Pages serves it automatically at https://abnaseer.github.io from the
`master` branch root — no Vercel, no build step, no package.json.

## File / folder structure

```
index.html        The entire site (single page, anchor-linked sections)
css/styles.css     All styles — design tokens live at the top as :root vars
js/script.js       Nav toggle, scroll-reveal, footer year, in-page anchor
                   scrolling (no #hash written to the URL), the
                   data-disclosure-toggle inline expand/collapse (Experience,
                   Projects), and the one real popup (Get in Touch). See "Inline
                   disclosures vs. the one real popup" below — both are
                   deliberate exceptions to "fully usable with JS disabled",
                   but not in quite the same way (disclosures keep content
                   in the accessibility tree; the popup does not).
README.md          Tracked. User-facing: what the site is, how to run/deploy.
AGENTS.md          Tracked. This file.
AGENTS.local.md    Untracked. Personal workflow preferences (any agent).
CLAUDE.md          Untracked. Points Claude at this file.
CLAUDE.local.md    Untracked. Claude Code-specific tool notes.
LESSONS.md         Untracked. Running learning journal.
TASKS.md           Untracked. To-do tracker for Abdullah.
```

If you add images/screenshots later, put them in an `assets/` or `images/`
folder alongside `css/` and `js/` — keep the root uncluttered.

`robots.txt` and `sitemap.xml` live at the repo root (GitHub Pages serves
them from wherever they sit relative to `index.html`, and search engines
expect them at the domain root) — these two are the intentional exception to
"keep the root uncluttered."

## SEO / social preview assets

- `assets/img/favicon/` — favicon.ico (16/32/48 multi-size) + individual
  favicon-{16,32,192,512}.png + apple-touch-icon.png, all a plain "AN"
  monogram in `--color-ink` on `--color-bg`/`--color-bg-alt`, generated with
  Liberation Serif Bold via Pillow (script not kept in-repo — regenerate the
  same way if these ever need to change, Lora itself isn't installed
  locally so Liberation Serif is the deliberate stand-in for icon-sized
  text).
- `assets/img/og-image.png` (1200x630) — the Open Graph / Twitter card
  preview image, same sepia palette and monogram, name + tagline +
  `abnaseer.github.io`. Referenced by absolute URL in `index.html`'s
  `<head>` (`og:image`/`twitter:image` require absolute URLs, not relative
  paths). If the tagline in the hero changes, regenerate this image to
  match.
- `<head>` also carries canonical link, `og:*`/`twitter:*` meta, and a
  JSON-LD `Person` schema block — keep all of these (title, description,
  URL) in sync with the visible `<title>`/meta description/hero content if
  those ever change; they're duplicated by design for different consumers
  (Google, social link previews, browsers), not accidentally out of sync.

## Image format and dimensions

All project screenshots, thumbnails, and company logos are `.webp` (not
`.png`) — converted from PNG sources for ~90% smaller file size with no
visible quality loss (Pillow, quality 85). `og-image.png` and everything in
`assets/img/favicon/` are the deliberate exceptions and stay PNG/ICO for
social-crawler and OS icon compatibility.

Every real `<img>` tag also carries explicit `width`/`height` attributes
matching the file's actual pixel dimensions. These do NOT affect the
rendered size — every image is styled with `width: 100%`/`object-fit` (or
similar) in CSS, which always wins for display size — they exist purely so
the browser can reserve the correct aspect ratio before the image loads,
preventing layout shift. If you add a new image, convert it to `.webp` and
set real `width`/`height` attrs the same way; don't add a `<picture>`
fallback or keep the PNG around, `.webp` alone is fine at this site's scale.

## Design system (CSS custom properties)

Everything themeable lives in `:root` at the top of `css/styles.css`. Do not
hardcode colors, fonts, or spacing values elsewhere — reference the tokens.

**Color tokens** (sepia/parchment palette — this is the whole aesthetic, there
is no dark mode toggle and none should be added):

- `--color-bg` (#f4ecd8) / `--color-bg-alt` (#efe6d5) — warm parchment
  background tones
- `--color-surface` (#fbf6ec) — card/panel background, slightly lighter
- `--color-ink` (#3a2c22) — primary text, warm dark brown (never pure black)
- `--color-ink-soft` (#5b4636) — secondary/muted text
- `--color-accent` / `--color-accent-dark` — sienna accent for links/buttons
- `--color-rule` / `--color-border` — hairline dividers and card borders

When adding new UI, check contrast against the background tokens — this
palette was chosen to pass WCAG AA, and new colors must too (ink on parchment
comfortably clears 4.5:1; don't introduce low-contrast pastel accents).

**Fonts**: `--font-serif` (Lora, for headings and body copy — this is the
"reading a book" voice) and `--font-sans` (Source Sans 3, for UI chrome: nav,
buttons, meta text, captions). Keep that split — don't set body copy in the
sans font or UI labels in the serif font.

**Spacing scale**: `--space-1` through `--space-6` (0.5rem → 6rem). Use these
instead of arbitrary margin/padding values so rhythm stays consistent.

**Section dividers**: the `❧` character inside `.divider` stands in for a
"chapter break" — understated, not a hard `<hr>` line. If you add new
top-level sections, keep a `.divider` between them.

**Motion**: only the scroll-reveal fade/slide-up on `.reveal` sections, and it
must respect `prefers-reduced-motion`. Do not add parallax, autoplay
carousels, or anything flashy — restraint is the point.

## Inline disclosures vs. the one real popup

**As of the "no popups for Experience/Projects" pass, there is exactly ONE
true popup left on this page: Get in Touch** (`#contactModal`, opened via
`data-open-modal`). Abdullah explicitly disliked the popup pattern for
Experience/Projects ("I kinda dont dig this simplistic popups... those cards
aint it") and asked for inline expand/collapse instead. Don't reintroduce
modals for those two sections without being asked again.

**Inline expand/collapse** (Experience "Show more", each Projects card, and
About's "Read the boring part") all follow the same idea: a trigger button
with `aria-expanded`/`aria-controls`, and a sibling panel that's
`max-height: 0; overflow: hidden;` by default, expanding to a generous fixed
`max-height` (not computed from `scrollHeight`) via a `.is-expanded` class
toggle. Three concrete flavors on the page:
- **About** (`.about__more`, `#aboutMore`): bespoke word-cutoff/ellipsis
  overlay effect, JS in the dedicated About block of script.js. Progressive
  enhancement — works with JS disabled (see its own note in "Content tone").
- **Experience** (`.timeline__toggle` / `.timeline__panel`): plain
  "Show more" / "Show less" button + panel, wired by the generic
  `[data-disclosure-toggle]` handler below.
- **Projects** (`.project-card__toggle` / `.project-card__panel`): the whole
  card header (thumbnail + title + chevron) is the toggle button; its panel
  holds the screenshot strip (`.project-modal__media`, reused from the old
  popup design — still real, visible `.glightbox` anchors, no more hidden
  `sr-only` gallery-grouping tricks), the tech-stack chips, description, and
  link/Private Repo label.

**Generic wiring**: any element with `data-disclosure-toggle` and
`aria-controls="somePanelId"` gets wired automatically by one handler in
script.js — toggles `.is-expanded` on itself (chevron rotation via
`.project-card__chevron`, shared by both Experience and Projects) and on the
panel. No per-item JS needed. This does NOT use `data-open-modal` — that
attribute is reserved for actual modals (currently just Get in Touch).

- **Trade-off, know this before "fixing" it**: expanding Experience/Projects
  content requires JS. With JS disabled, the toggle buttons still render,
  but clicking does nothing and the panel stays visually collapsed
  (`max-height: 0`, though — unlike the old `[hidden]`-based popups — the
  content stays in the accessibility tree, just clipped). This is an
  intentional trade for the minimal-glance design; don't silently "fix" it
  by making panels always-visible.
- The Get in Touch modal still follows the old modal shape: `<div
  class="contact-modal" id="someModalId" hidden>` with `.contact-modal__backdrop
  [data-close-modal]` and `.contact-modal__panel` / `.contact-modal__close`.
  If you ever add a genuinely new modal, `data-open-modal`/`data-close-modal`
  still wire it automatically the same way.

**Tech-stack icons**: real brand marks (Simple Icons, via
`cdn.jsdelivr.net/npm/simple-icons@latest/icons/<slug>.svg` — check a slug
resolves with `curl` before assuming it exists) inlined as single-path SVGs
with `fill="currentColor"`, sized ~20px, no background badge. This replaced
an earlier 2-letter monogram-badge version — don't revert to monograms if a
real icon exists. No icon exists for Firestore (reuses the Firebase icon) or
Football-Data.org API (a hand-drawn generic globe icon instead). The LoL
Utility App card's icon follows this same Simple Icons convention too
(slug `riotgames`), just sized larger (~52px) since it's the card's whole
`.project-card__icon`, not a small inline tech-stack chip.

**Projects card thumbnails** (`assets/img/thumbs/*.webp`): tight crops
straight out of each project's own real screenshots — MAVISE's wordmark
(from `mavise/login.webp`), Footy-Time's ball icon (from
`footy-time/splash.webp`), and Bloem's heart-checkmark logo (from
`scale-social/capture_1_landing.webp`) — cropped with PIL to roughly match
the `.project-card__gallery` box's ~1.38:1 aspect ratio so `object-fit:
cover` doesn't cut into them. If a project's screenshots change, these
crops may need regenerating from the new source image.

**Experience company logos** (`assets/img/logos/*.webp`): a different, separate
convention from tech-stack icons above — these are small self-hosted raster
crops of each company's *real* logo (not Simple Icons, not hand-drawn),
sized ~32px with rounded corners via `.timeline__logo`. `web7labs.webp` is a
cropped square from their actual LinkedIn logo; `scale-social.webp` is their
site's actual favicon. Don't try to find/replace these with Simple Icons
SVGs — neither company is in that library, which is why raster crops were
used instead.

## Content tone / voice

Calm, literary, first-person, understated — like a well-kept personal journal
or an author's note, not a marketing landing page. Concretely:

- No corporate buzzwords ("synergy", "leverage", "passionate about
  innovation", "rockstar developer").
- Short, plain sentences. Prefer concrete detail over vague enthusiasm.
- It's fine to sound modest — the goal is trustworthy and specific, not hyped.
- Section headings stay simple (About, Experience, Projects, Get in Touch) —
  don't get cute with them. There is no standalone Skills section; tech stack
  lives in each project's one-line meta tag instead.

## Placeholder content

All content is real now (no `TODO(Abdullah)` markers remain as of this
writing). If you need to add a new placeholder while real content isn't
available yet, mark it with an HTML comment
`<!-- TODO(Abdullah): ... -->` and don't invent real-sounding details.

## Git commit / PR attribution

- Never add a "Co-Authored-By: Claude" trailer to git commits or pull request
  descriptions.
- On 2026-09-06 the repo's git history was squashed to a single commit and
  the remote repo deleted/recreated. Cause: every prior commit's author
  email (`zohaibbukhari125@gmail.com`) was verified on a *different* GitHub
  account than this site's owner (`ABNaseer`), so GitHub attributed ~90
  commits and the Contributors graph to that other account instead. Fixed
  by starting over with a single commit under the correct email
  (`abdullahnaseer02@outlook.com`). If you're an agent looking at a
  one-commit history, that's why — it's not a sign the project just
  started; see git tag/commit dates elsewhere (README, this file) for the
  real timeline if needed.

## Git conventions

- Only real site files, plus `README.md` and this file, are tracked:
  `index.html`, `css/`, `js/`, `README.md`, `AGENTS.md`, and any future real
  assets.
- `AGENTS.local.md`, `CLAUDE.md`, `CLAUDE.local.md`, `LESSONS.md`,
  `TASKS.md`, `.claude/`, and `skills-lock.json` must stay untracked —
  they're listed in `.gitignore`. Do not change this without being
  explicitly asked.
- Never use `git add -A` or `git add .` in this repo — always add files by
  explicit name/pattern so the meta files above can't be swept in.
