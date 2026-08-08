# Ilm — 1 minute of knowledge

Ilm is a 1-minute Islamic knowledge feed: a Deepstash-style stream of short,
swipeable insight cards designed to be read in about a minute a day. Browse by
category, work through a daily selection, and build a light daily habit of
learning.

> **Note on content:** All **feed** content is currently **placeholder** and is
> pending scholarly review. It should not yet be relied upon for religious
> guidance. The separate **Hadith** section is real sourced content (see below),
> not placeholder.

## Hadith — Riyad us-Salihin

The app includes a browsable, searchable copy of the full **Riyad us-Salihin**
(رياض الصالحين) collection by Imam Yahya ibn Sharaf al-Nawawi — all **1,896
hadith**, organized into their 20 books and their chapters, with a full-text
search across Arabic, English, and reference.

- **Source / attribution:** the collection is **sourced from
  [sunnah.com](https://sunnah.com)** (via a GitHub mirror). Every hadith links
  back to its sunnah.com permalink and shows its reference, book, chapter, and
  narrator.
- **Grading caveat:** the upstream dataset stamps **every** record
  `grade: "Sahih"` with an empty grader — this is a blanket scraper default,
  **not** verified per-hadith grading. The app therefore **never displays the
  grade as authoritative**; each hadith instead carries a neutral note to
  confirm the authentication on sunnah.com.
- **Performance:** the ~2.6 MB collection is a static asset in
  `public/data/riyadussalihin.json`. It is **not** bundled into the main JS —
  it is lazy-fetched only when the Hadith section is first opened, so initial
  app load stays fast.

## Tech stack

- **React 19** + **TypeScript**
- **Vite** (build tooling / dev server)
- **Tailwind CSS** (styling)
- **Oxlint** (linting)

## Run locally

```bash
npm install
npm run dev
```

Then open the URL Vite prints (default http://localhost:5173).

Other scripts:

```bash
npm run build     # type-check and production build
npm run preview   # preview the production build locally
npm run lint      # run Oxlint
```

## Deployment

The app deploys to **GitHub Pages** via the workflow in
`.github/workflows/deploy.yml`, which builds on every push to `main` and
publishes the `dist/` output. The Vite `base` is set to `/ilm-webapp/`, so the
live site is served from:

**https://muhammadadrian.github.io/ilm-webapp/**

A `404.html` copy of `index.html` is generated during deploy so client-side deep
links resolve correctly.
