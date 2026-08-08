# Ilm — 1 minute of knowledge

Ilm is a 1-minute Islamic knowledge feed built on the full **Riyad us-Salihin**
hadith collection: a swipeable stream of short narrations designed to be read in
about a minute a day. Get a deterministic daily hadith, scroll a lazy-loaded
feed, save the ones you want to return to, filter by reading difficulty,
free-text search, and browse the collection by book and chapter — building a
light daily habit of learning.

## Hadith — Riyad us-Salihin

The whole app runs on a browsable, searchable copy of the full **Riyad
us-Salihin** (رياض الصالحين) collection by Imam Yahya ibn Sharaf al-Nawawi — all
**1,896 hadith**, organized into their 20 books and their chapters, with a
full-text search across Arabic, English, and reference.

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
  it is fetched once at runtime (and then memoised) rather than baked into the
  bundle, so the JS payload stays small. Each hadith is assigned a reading
  difficulty by a deterministic length-based heuristic at load time.

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
