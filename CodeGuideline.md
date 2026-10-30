# Code Guideline

## Project Structure Overview

```
project-root/
  ├── public/                # Static assets
  ├── src/
  │   ├── components/        # All reusable UI components
  │   │   └── ui/            # Prebuilt and custom UI components, grouped by function
  │   ├── hooks/             # Custom React hooks
  │   ├── lib/               # Utility functions and libraries
  │   ├── pages/             # Application pages (each page in its own subdirectory)
  │   ├── App.tsx            # Main app component, sets up route providers
  │   ├── router.tsx         # Router config, sets up routing
  │   ├── main.tsx           # Entry point for the React app
  │   └── index.css          # Global styles
  ├── package.json           # Project metadata and scripts
  ├── tailwind.config.ts     # Tailwind CSS configuration
  └── ...                    # Other config and lock files
```

## Directory Responsibilities

- **public/**: Static files served directly. Place images, icons, and robots.txt here.
- **src/components/**: All UI components.  
  - **ui/**: Contains atomic and composite UI components.  
  - **error-boundary/**: The shared error fallback (`error-fallback.tsx`) and the route-level `errorElement` (`route-error-boundary.tsx`).  
  - *Group related components into subdirectories if they share a domain or feature (e.g., `form/`, `charts/`).*
- **src/hooks/**: Custom React hooks. Each file should export a single hook focused on one responsibility.
- **src/lib/**: Utility functions and libraries that are not React components or hooks.
- **src/pages/**: All route-level pages.  
  - *Each page should have its own subdirectory if it contains more than a single file or has related logic/components.*
- **src/App.tsx**: Sets up global providers.
- **src/router.tsx**: Sets up routing.
- **src/main.tsx**: Application entry point. Wraps the app in the top-level error boundary and reports caught errors through `src/lib/report-caught-error.ts`.
- **src/setup.ts**: Side-effect imports that must run before the app renders (for example the i18n runtime injected by the `enter_i18n` skill). `src/main.tsx` is platform-managed: add such imports here instead.

**Important:**
Whenever a new module (such as a component, hook, or utility) or a new page is added or removed, this document **must be updated immediately** to reflect the changes. Keeping this documentation up to date ensures that all collaborators have a clear understanding of the current project structure and its intended organization.

## How to Add New Code

### 1. Adding a New Page

- **Create a subdirectory under `src/pages/` for each new page.**
  - Example: For a "Dashboard" page, create `src/pages/dashboard/`.
- **Place the main page component as `index.tsx` inside the subdirectory.**
- **Add any page-specific components or logic in the same subdirectory.**
- **Register the new route in `src/router.tsx and generate a semantic name.**
  - Example:
    ```tsx
    import Dashboard from "./pages/dashboard";
    // ...
    {
      path: "/dashboard",
      name: 'dashboard',
      element: <Dashboard />
    }
    ```

### 2. Adding a New Component

- **If you are adding a group of related components, create a subdirectory (e.g., `form/`, `charts/`).**
- **If the component is only used by a specific page, place it in that page's subdirectory under `src/pages/`.**
- **Each component should be focused on a single responsibility.**
- **Small files (< 100 lines) are encouraged for a single component.**

### 3. Adding a New Hook

- **Create a new file in `src/hooks/` named after the hook (e.g., `use-feature.ts`).**
- **Each file should export only one hook.**
- **Hooks should be as small and focused as possible.**

### 4. Adding Utilities

- **Add utility functions to `src/lib/`.**
- **Group related utilities in the same file or subdirectory if needed.**

### 5. Adding Multi-language Support

- **This template has no i18n by default.** Do not install i18next or hand-write locale files, `i18n.config.json`, or `src/i18n/`.
- **Call the `i18n_enable` tool** when the user needs more than one language. After approval, the built-in `enter_i18n` skill injects the i18n runtime and owns all later language work.

### 6. Updating Page Metadata (SEO & Social Sharing)

- **Site-level metadata lives in the `<head>` of `index.html`.** The `og:*` and `twitter:*` tags ship with Enter platform defaults and are what link previews (WhatsApp, X, Slack, etc.) display.
- **Whenever you change `<title>` or `<meta name="description">`, update `og:title` / `og:description` / `og:image:alt` and `twitter:title` / `twitter:description` to match.**
- **`og:image` / `twitter:image` must be absolute URLs**, because link-preview crawlers do not resolve relative paths. The default points to the Enter share image (1200×630); when the project has its own preview image, replace both with its absolute URL and keep `og:image:width` / `og:image:height` accurate.

## Coding Best Practices

- **One module, one responsibility:**  
  Each file (component, hook, utility) should do one thing only.
- **High cohesion, low coupling:**  
  Keep related logic together and avoid unnecessary dependencies between modules.
- **Naming conventions:**  
  - Use `PascalCase` for components and page directories.
  - Use `camelCase` for hooks and utility functions.
  - Name page subdirectories and files after their route or feature.
- **Component structure:**  
  - Keep components small and focused.
  - Extract subcomponents if a component grows too large.
- **Page structure:**  
  - Place all logic, hooks, and components specific to a page in its subdirectory.
  - Only share code via `components/`, `hooks/`, or `lib/` if it is truly reusable.
- **Documentation:**  
  - Add comments for complex logic.
  - Document the purpose of each module at the top of the file if not obvious.
- **Error boundaries:**  
  - Do not remove them: `src/main.tsx` wraps the app in one, and the pathless root route in `src/App.tsx` gives every page the shared `errorElement`, so a crashing page shows a fallback instead of a blank screen. Keep new routes in `src/router.tsx`; they become children of that root route.
  - Keep the `ErrorBoundary caught a runtime error:` log prefix in `src/lib/report-caught-error.ts`; the Enter preview uses it to recognize caught errors as runtime errors.
  - To let one section fail on its own, wrap it in `ErrorBoundary` from `react-error-boundary` with `FallbackComponent={ErrorFallback}` or a smaller fallback.

## Example: Adding a New "Profile" Page

1. **Create a directory:**  
   `src/pages/profile/`
2. **Add the main page component:**  
   `src/pages/profile/index.tsx`
3. **Add page-specific components:**  
   `src/pages/profile/ProfileHeader.tsx`, `src/pages/profile/ProfileDetails.tsx`
4. **Register the route in `App.tsx`:**
   ```tsx
   import Profile from "./pages/profile";
   // ...
   <Route path="/profile" element={<Profile />} />
   ```
5. **If you need a reusable button, add it to `src/components/ui/button.tsx`.**
