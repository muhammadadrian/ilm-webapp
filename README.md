# Ilm — 1 minute of knowledge

Ilm is a 1-minute Islamic knowledge feed: a Deepstash-style stream of short,
swipeable insight cards designed to be read in about a minute a day. Browse by
category, work through a daily selection, and build a light daily habit of
learning.

> **Note on content:** All feed content is currently **placeholder** and is
> pending scholarly review. It should not yet be relied upon for religious
> guidance.

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
