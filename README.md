# SafeKid v0.3 — React + Vite

React 18 + Vite implementation of the SafeKid concept site. The home page converts the approved Kombai HTML into React components and keeps product imagery local to the project.

## Version 0.3

This source pack includes the shared site header and footer, all Zodiac and product pages, the informational pages and local-only interaction prototypes. The home page includes the interactive MicroSlats background, the scroll/swipe story, a TiltedCard hero watch, and PixelTransition between Zodiac editions. The contact form opens a prefilled email draft; it does not send messages automatically. Watch, app, chat, and SOS features remain concepts and are not connected to live services.

## Run locally

```powershell
npm ci
npm run dev
```

Open the local URL printed by Vite (normally `http://localhost:5173/`). Create a production build with `npm run build`; deploy the generated `dist/` directory to a static host.

Use Node.js 18 or newer. The `SafeKid_VSCode_v0.3.zip` source bundle includes the app, local images/fonts, dependencies manifest and lockfile, Vite configuration, GitHub Pages workflow, React Bits registry/MCP configuration, and project documentation. It excludes `.git/`, `node_modules/`, and `dist/`; these are not needed in the source pack and can be recreated with `npm ci` and `npm run build`.

To add the project to GitHub, extract the ZIP and upload the contents of the `SafeKid_VSCode` folder as the repository files. Do not upload `node_modules/` or `dist/`.

## Deploy to GitHub Pages

The included `.github/workflows/deploy.yml` builds and publishes the site whenever code is pushed to `main`. In the GitHub repository, open **Settings → Pages**, set **Build and deployment → Source** to **GitHub Actions**, then push to `main` or run the workflow from the **Actions** tab. Vite automatically uses the repository subpath for project pages and `/` for `username.github.io` sites. Keep only this SafeKid deployment workflow active in `.github/workflows`; other workflows that publish static or Jekyll content can overwrite the deployed site.

## Routes

The app uses hash-based navigation and does not require a server fallback:

- `#/` — Home / landing page
- `#/zodiac` — Zodiac collection
- `#/product/rat` (or another Zodiac ID) — shared product-detail layout
- `#/about`, `#/support`, `#/contact` — informational pages
- `#/chat` — non-connected ChatBot prototype
- `#/sos` — local-only SOS simulation

The home page is a focused SafeKid introduction: a cinematic hero and brand story, a four-beat scroll-linked watch/app concept scene with swipe navigation on smaller screens, a concise product overview, and an interactive selector for all 12 Vietnamese Zodiac editions. The hero watch responds to pointer movement with a subtle TiltedCard interaction, while changing the selected edition uses a brief pixel-dissolve transition. Both settle without motion when reduced motion is preferred. The parent-app artwork is illustrative only; no watch, location, or live service is connected. Product-detail routes share a concept-led edition page with related Zodiac links; prices and unconfirmed specifications are intentionally omitted. Existing hash routes remain available from the footer and related pages. Scroll-reveal motion, FAQ disclosures, and the interactive MicroSlats background respect the device's reduced-motion setting. Commerce, account, payment, and backend flows are intentionally not implemented.

## React Bits components

The project registers the [React Bits](https://reactbits.dev) component registry for the shadcn MCP server. The landing page uses TiltedCard for subtle pointer response on the hero watch and PixelTransition when changing the Zodiac edition; both respect reduced-motion preferences. In VS Code, open `.vscode/mcp.json` and start the `shadcn` server to browse the registry through Copilot. To add another component manually, use its JavaScript + CSS variant, for example `npx shadcn@latest add @react-bits/PixelTransition-JS-CSS`. The project remains plain CSS; this setup does not add Tailwind. Review the [React Bits license](https://github.com/DavidHDev/react-bits/blob/main/LICENSE.md) before redistributing component source.

## Notes

See [FIGMA_EXTRACTION_REPORT.md](./FIGMA_EXTRACTION_REPORT.md) for the discovered-frame inventory, implemented scope, asset provenance, prototype behavior, and known gaps. The design uses Google Fonts at runtime; an internet connection is needed to fetch them, with system-font fallbacks available.
