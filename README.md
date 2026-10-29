# Welcome to your Enter project

[![Built with enter.pro](https://img.shields.io/badge/Build%20with-Enter.pro-FC5776?style=for-the-badge&labelColor=1F1F1F)](https://enter.pro)

*Automatically synced with your [enter.pro](https://enter.pro) workspace* 

---

## Overview

This repository is automatically linked to your app on [enter.pro](https://enter.pro).  
Every change you make in Enter will be reflected here — and any updates you push to this repo will sync back seamlessly.  

Enter.pro helps you **build, edit, and deploy full-stack web apps by prompting**.  
Just describe what you want — Enter turns ideas into production-ready code.

---

## Project URLs

**Live app:** https://<project-id>-latest.preview.enter.pro  
**Edit & build in Enter:** https://enter.pro/project/<project-id>


---

## Continue building

Keep developing your app directly in [Enter.pro](https://enter.pro/project/<project-id>).  
Prompt new features, refine the UI, or connect integrations — all changes are versioned and synced automatically to GitHub.

---

## Local development

Prefer to work locally? You can clone this repo and start developing right away:

```bash
# Step 1: Clone your project repository
git clone <YOUR_GIT_URL>

# Step 2: Navigate into the project folder
cd <YOUR_PROJECT_NAME>

# Step 3: Install all dependencies
pnpm install

# Step 4: Start the local development server
pnpm dev
```

Push your commits — Enter.pro will automatically detect and sync your latest changes.

---

## Multi-language (i18n)

This template ships without i18n. When the app needs more than one language, ask Enter for it: the agent turns on the Enter i18n extension, and the built-in `enter_i18n` skill injects the runtime (`i18n.config.json`, `public/locales/`, `src/i18n/`, the language switcher, and the i18next dependencies) into this repository.

---

## Tech stack

This project uses:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS

---

## Deployment

To deploy, open your Enter.pro project and click "Publish"

Your app will automatically build and go live at your production URL.

---

✨ Keep prompting, keep building — Enter.pro handles the rest.
