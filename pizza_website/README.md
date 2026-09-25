# Fiamma Pizza House

A responsive pizza landing page built with React, TypeScript, Vite, Tailwind CSS, and native browser animation APIs. A tomato-red and butter-cream trattoria poster combines an oversized masthead, a printed menu list, a craft spread and a split-photo visit section.

## Run locally

```sh
npm install
npm run dev
```

Open the URL printed by Vite. The standalone style tile is at `/style-tile.html`; it also opens directly from `public/style-tile.html`.

On Windows PowerShell with script execution restricted, use `npm.cmd` instead of `npm`.

## Verify and build

```sh
npm run lint
npm run build
npm run test:e2e
npm run preview
```

The end-to-end tests use Playwright Chromium. Install it with `npx playwright install chromium`, or set `PLAYWRIGHT_CHANNEL` to use an installed browser.

`dist/` contains the production site, including the style tile, responsive photos, and fonts. No external font, image, or animation service is required at runtime.

## Content and reservations

Edit `src/content.ts` to change the menu, email/booking URL, or opening hours. The email `hello@fiamma.example` is intentionally a sample, not a working restaurant address. Opening hours are illustrative and marked on the page. Replace both contact fields with real information and set `isPreview` to `false` before publishing. Mailto links open an email draft; this site does not send mail or confirm bookings.

## Design and animation

- Shared palette, fonts, wordmark and buttons: `public/styles/brand.css`.
- Base styles and responsive poster layout: `src/index.css` and `src/redesign.css`.
- Design notes: `docs/brand-guidelines.md`.
- Static hero: `src/components/Hero.tsx`.
- Section entrances: `src/components/Reveal.tsx`.

The hero uses a responsive static photograph on every device. Native scrolling moves directly through the page, with no pinned scene, autoplay, frame sequence, or playback controls. Section entrances run once with a small rise and fade over 850ms. Controls use brief easing transitions. System reduced-motion and slow/data-saving connections disable entrances and transitions. Changes to these preferences apply immediately.

Mobile navigation is a keyboard-accessible overlay with a focus trap with Escape, outside-click, and link-selection dismissal. Header offsets follow its measured height when text size changes. Interactive targets are at least 44px, content supports 200% text, and safe-area spacing is included for mobile controls.

All photography is newly generated for this redesign and stored as optimized WebP assets. The hero loads eagerly; supporting photographs load lazily. No image-generation step is needed to build or run the site.

Photos and fonts are self-hosted. The five distinct generated images and their prompt descriptions are documented in `public/media/asset-manifest.json`; font licenses remain in `public/media/fonts/`. The imagery illustrates the fictional Fiamma concept. All previous image files and obsolete media optimization scripts have been removed.

Keyboard navigation includes a skip link, visible focus, and native section links. The page has one semantic H1. Secondary hero copy is decorative, so assistive technology receives one stable introduction.

The end-to-end suite covers widths from 320px to 1440px, portrait/landscape layouts, navigation, enlarged text, motion preferences, constrained-device modes, static image loading, and automated WCAG accessibility checks. See `docs/ui-ux-review.md` for the latest validation details and the limits of browser emulation.
