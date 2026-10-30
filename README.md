# SafeKid — The space between them

A cinematic React + Vite concept site for the SafeKid children’s smartwatch and its parent experience.

## GitHub Pages

The production site is published from the `main` branch with GitHub Actions. The deployment workflow installs dependencies, builds the Vite app, and publishes `dist/` to GitHub Pages.

After enabling **Settings → Pages → Build and deployment → Source → GitHub Actions**, every push to `main` triggers a new deployment.

Published URL: https://fynisfl.github.io/SafeKid_Web_Demo_Prototype/

## Local development

```bash
npm ci
npm run dev
```

For a production build: `npm run build`.

## Notes

- The project uses Vite’s repository base path only in GitHub Actions builds; local development stays at `/`.
- `public/404.html` restores deep links on GitHub Pages.
- The hidden “A Little Detour” runner is activated by hovering over the SafeKid mark in the footer for 3 seconds (or holding it on touch devices).
- Device features and interactions are concept demonstrations; no live watch, emergency dispatch, or real location service is connected.
