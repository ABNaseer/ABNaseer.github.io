# Abdullah Naseer's Portfolio

A minimal, static personal portfolio site. No build step, no framework, just
plain HTML, CSS, and a small amount of JS (nav, scroll effects, and a popup
system for expandable details).

Design direction: a warm, sepia/parchment "reading a book" aesthetic rather
than the usual dark-mode developer-portfolio look. See `AGENTS.md` (untracked,
local-only) for the full design-system rationale if you're an AI agent editing
this repo. It's not committed to git, so read it from the local checkout.

## Structure

```
index.html        Single-page site: hero, about, work, experience, contact
css/styles.css     All styles, including the sepia color tokens
js/script.js       Nav toggle, scroll reveal, and a popup system (About's
                   "Read the boring part" degrades gracefully with JS off;
                   the Experience/Project "Details" and "Get in Touch"
                   popups do not, see the file's own header comment)
```

## Running locally

No build step is required. Either:

- Open `index.html` directly in a browser, or
- Serve it with any static file server, e.g.:

  ```bash
  npx serve .
  # or
  python3 -m http.server 8080
  ```

Then visit the printed local URL.

## Deployment (GitHub Pages)

This repo is named `ABNaseer.github.io`, GitHub's special "user site" repo
name, so Pages is served automatically from the `master` branch root at
https://abnaseer.github.io. No build step, no separate hosting account: push
to `master` and the live site updates.

## License

Personal project. All rights reserved unless stated otherwise.
