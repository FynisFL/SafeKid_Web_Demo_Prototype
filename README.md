# SafeKid — React + Vite

React 18 + Vite implementation of the SafeKid concept site. The home page converts the approved Kombai HTML into React components and keeps product imagery local to the project.

## Run locally

```powershell
npm ci
npm run dev
```

Open the local URL printed by Vite (normally `http://localhost:5173/`). Create a production build with `npm run build`; deploy the generated `dist/` directory to a static host.

Use Node.js 18 or newer. The `SafeKid_VSCode.zip` source bundle includes the app, local images/fonts, dependencies manifest and lockfile, Vite configuration, and project documentation. It excludes `node_modules/` and `dist/`; both can be recreated with `npm ci` and `npm run build`.

To add the project to GitHub, extract the ZIP and upload the contents of the `SafeKid_VSCode` folder as the repository files. Do not upload `node_modules/` or `dist/`.

## Deploy to GitHub Pages

The included `.github/workflows/deploy.yml` builds and publishes the site whenever code is pushed to `main`. In the GitHub repository, open **Settings → Pages**, set **Build and deployment → Source** to **GitHub Actions**, then push to `main` or run the workflow from the **Actions** tab. Vite automatically uses the repository subpath for project pages and `/` for `username.github.io` sites.

## Routes

The app uses hash-based navigation and does not require a server fallback:

- `#/` — Home / landing page
- `#/zodiac` — Zodiac collection
- `#/product/rat` (or another Zodiac ID) — shared product-detail layout
- `#/about`, `#/support`, `#/contact` — informational pages
- `#/chat` — non-connected ChatBot prototype
- `#/sos` — local-only SOS simulation

The home page is a focused SafeKid introduction: a cinematic hero and brand story, a four-beat scroll-linked watch/app concept scene, a concise product overview, and an interactive selector for all 12 Vietnamese Zodiac editions. The parent-app artwork is illustrative only; no watch, location, or live service is connected. Product-detail routes share a concept-led edition page with related Zodiac links; prices and unconfirmed specifications are intentionally omitted. Existing hash routes remain available from the footer and related pages. Scroll-reveal motion is used across pages and respects the device's reduced-motion setting. Commerce, account, payment, and backend flows are intentionally not implemented.

## Notes

See [FIGMA_EXTRACTION_REPORT.md](./FIGMA_EXTRACTION_REPORT.md) for the discovered-frame inventory, implemented scope, asset provenance, prototype behavior, and known gaps. The design uses Google Fonts at runtime; an internet connection is needed to fetch them, with system-font fallbacks available.
