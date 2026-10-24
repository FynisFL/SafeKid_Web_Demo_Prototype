# Figma extraction report

## Source and method

- Figma design: `SafeKid_Digibabi`, file key `oLr4NAQz1dJQ92S175xhQK`; prototype entry point: node `50:7`.
- The file contains one top-level canvas page, **Page 1** (`0:1`), rather than a separate Figma page for every website route. The list below inventories the named major frames found on that canvas and records how each was treated.
- Design context and screenshots were retrieved with the official Figma MCP for Home (`107:883`), About (`192:555`), and Support (`2007:3661`); earlier extraction context covered the other major frames, including Zodiac, Contact, product detail, ChatBot, and SOS.
- The React UI is implemented as independent components and CSS, not as full-frame screenshots.

## Page and major-frame inventory

| Figma page / frame | Role indicated by the design | Extraction and implementation status |
|---|---|---|
| Page 1 (`0:1`) | Only top-level page; canvas containing the screens and component frames below | Inventoried; no standalone route for the canvas itself |
| `50:7`, `52:1756`, `52:1775`, `107:813` | Early/experimental boards and iterations | Identified; not published as routes because they are experiments/duplicates rather than complete distinct screens |
| Home (`107:883`) | Original Figma landing frame | Superseded on the home route by the approved Kombai landing design; the original frame remains an extraction reference |
| Landing product / Zodiac collection (`252:787`) | Product/collection overview reached by the Hero CTA | Implemented in `ZodiacPage.jsx` with a data-driven 12-animal grid and product-detail links |
| Product page (`352:3489`) | Zodiac product/collection screen with animal tiles | Represented by the 12-item Zodiac grid; source assets downloaded locally |
| Product detail template “Tý PRDDT” (`286:2384`) | Mouse Edition product-detail design | Implemented as a reusable detail page for all 12 animals, including feature and specification sections. Purchase/cart controls are omitted by scope |
| Similar Zodiac detail frames (`315:2394`, `315:2627`, `315:2860`, `315:3093`, `315:3326`, `315:3559`, `315:3792`, `315:4025`, `315:4258`, `315:4491`, `315:4724`) | Other zodiac-specific variants of the product detail design | Mapped to the same data-driven template; variant-specific descriptive/specification differences beyond available source context remain unverified |
| About (`192:555`) | DigiBabi / SafeKid brand story | Implemented in `AboutPage.jsx` |
| Contact (`379:3110`) | Contact information and message form | Implemented in `ContactPage.jsx`; form is local-only and clearly says no message was sent |
| Support Center (`2007:3661`) | FAQ and support information | Implemented in `SupportPage.jsx` with FAQ, shipping, payment-method, return-policy, and privacy-policy sections. All operations are informational only and marked unverified |
| ChatBot intro (`2158:4229`), ChatBot (`2158:4268`) | AI/chat interface | Implemented as a visual, non-connected chat prototype in `ChatPage.jsx`; no external service or message transmission |
| SOS component (`2175:4325`), phone (`2187:4608`), SOS screens (`2187:4802`, `2187:4891`) | SOS interface/simulation | Represented by a prominent local-only demonstration in `SosPage.jsx`; it cannot contact emergency services |
| Cart (`2091:3166`) | Shopping cart | Inventoried; intentionally not implemented |
| Payment and checkout artboards | Commerce/payment flows | Inventoried at the category level; intentionally excluded, with no payment data collection or processing |
| Shared navigation, branding, footer, watch and icon components | Reusable UI | Header and Footer implemented as shared components. Available logo, Hero and product imagery are used locally |

## Implemented structure

- Shared components: `src/components/Header.jsx`, `Footer.jsx`, `SiteLayout.jsx`.
- Home: `src/pages/HomePage.jsx` converts the Kombai structure into React sections for the hero, emotional interlude, four-beat sticky watch/app story, capabilities, Zodiac selector, demos, closing, and footer.
- Pages: Zodiac collection, reusable product detail, About, Support, Contact, Chat, SOS simulation, and not-found state under `src/pages/`.
- Data-driven content: `src/data/zodiac.js` contains the 12 zodiac edition labels, local image references, shared design features, and the product-detail specification values available in the Mouse Edition context.
- Landing styles and motion: `src/styles/safekid-landing.css` provides responsive layouts and reduced-motion behavior; `HomePage.jsx` uses cleaned-up requestAnimationFrame scroll handling for the story scene.
- Figma/local assets: copied SafeKid brand logos, Hero title SVG, and four original watch assets; downloaded 12 Zodiac collection images into `src/assets/products/`.

## Content, interactions, and scope decisions

- Home's hero and section links scroll to in-page anchors; route navigation continues to use hash paths such as `#/zodiac`.
- The Zodiac picker previews all 12 local images and commits an edition on selection. Detail links use the existing `#/product/:id` route.
- Edition controls are semantic buttons with visible focus and Enter/Space activation.
- The pairing interaction is page-local state only. It does not connect to hardware, accounts, or a network.
- Zodiac tiles open informational product-detail routes; those pages return to the collection. No purchase, cart, checkout, or payment controls are wired.
- Contact and Chat forms only display local notices. They do not transmit data.
- SOS is explicitly labeled as a simulation. It does not contact anyone, send an alert, or share location.
- The Figma collection shows `1.599.000 VND`; it is presented with a disclaimer that it is not a live offer. Collection card labels use Figma text (`Mouse`, `BUFFALO`, `TIGER`, `KITTY`, `DRAGON`, `SNAKE`, `PONY`, `SHEEP`, `Monkey`, `CHICK`, `PUPPY`, `PIGGY`). The Mouse Edition specification values are drawn from the detail template and are not asserted as independently verified for every variant.
- Figma mock testimonial/review content is not presented as verified customer testimony.

## Assets, typography, and fidelity gaps

- The landing page uses the local SafeKid logo, watch render, and all 12 Zodiac images. The landing contains no file-system or temporary asset URLs.
- Landing typography uses Plus Jakarta Sans for headings and Inter for body/UI; the other Figma-extracted routes retain their existing font roles. Google Fonts are loaded at runtime with system fallbacks.
- Two older brand assets referenced by the About route were missing from the project. The page now uses the available SafeKid watch render and logo as a restrained fallback.
- The hero entrance and scroll choreography express Separation → Transition → Connection → Reassurance through one reversible progress timeline. The scroll handler is cleaned up on unmount; reduced-motion and compact layouts show a static, complete story.
- The SOS route and landing-page disclosure use the exact message: “Local simulation only. No emergency alert is sent.”
- Contact, FAQ, policy, commerce, and per-variant content have not been validated as live business information. Support text and visible design values are labeled as mockup-derived and unverified.
- Responsive behavior is implemented for narrow screens, but Figma did not provide a verified responsive prototype for every frame; responsive breakpoints/layout are implementation choices rather than measured Figma values.
- Social icons are represented with text glyphs rather than exact exported icon assets. The copied `src/assets/figma/Footer.svg` is retained as an available reference asset, not used as a screenshot replacement.
- The frame inventory is limited to major screens and named component/artboard groups surfaced in metadata/context. Individual decorative layers and every payment sub-artboard are not enumerated one by one.

## Validation status

- `npm ci`: completed successfully in the generated project.
- `npm run build`: passed with Vite 5.4.21 after replacing references to two missing About assets.
- `npm run dev -- --host 127.0.0.1`: started at `http://127.0.0.1:5173/`; browser loaded the app without page or console errors.
- Browser checks passed: anchor navigation stays on Home; all 12 edition controls and local images load; click and keyboard selection update the matching detail link; local pairing completes and resets; Chat and SOS routes render with simulation disclosures; 390px, 768px, and 1440px viewports have no horizontal overflow; forward/reverse story progress and reduced-motion behavior were checked.
- `npm audit` reports 1 high and 1 moderate dependency advisory (`vite` direct and `esbuild` transitive) in the required Vite 5 dependency set. Dependencies were not force-upgraded because the requested project version is Vite 5.
- Visual screenshot verification covered the Home hero, desktop story connection state, and mobile Zodiac selector. Detailed pixel comparison against every reference frame remains outstanding.
