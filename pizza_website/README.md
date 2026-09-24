# Fiamma Pizza House

A responsive pizza landing page built with React, TypeScript, Vite, Tailwind CSS, and native browser animation APIs. Charcoal photography sections alternate with a warm cream menu, with tomato-red accents throughout.

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

The end-to-end tests use the installed Microsoft Edge browser. On another platform, change the Playwright channel and install the desired browser with `npx playwright install chromium`.

`dist/` contains the production site, including the style tile, responsive photos, and fonts. No external font, image, or animation service is required at runtime.

## Content and reservations

Edit `src/content.ts` to change the menu, email/booking URL, or opening hours. The email `hello@fiamma.example` is intentionally a sample, not a working restaurant address. Opening hours are illustrative and marked on the page. Replace both contact fields with real information and set `isPreview` to `false` before publishing. Mailto links open an email draft; this site does not send mail or confirm bookings.

## Design and animation

- Shared palette, fonts, wordmark and buttons: `public/styles/brand.css`.
- Responsive page layout: `src/index.css`.
- Design notes: `docs/brand-guidelines.md`.
- Static hero: `src/components/Hero.tsx`.
- Section entrances: `src/components/Reveal.tsx`.

The hero uses a responsive static photograph on every device. Native scrolling moves directly through the page, with no pinned scene, autoplay, frame sequence, or playback controls. Section entrances run once with a 6px rise and gentle fade over 280ms; control transitions last 220ms. System reduced-motion and slow/data-saving connections disable entrances and transitions. Changes to these preferences apply immediately.

Mobile navigation is a keyboard-accessible disclosure with Escape, outside-click, and link-selection dismissal. Header offsets follow its measured height when text size changes. Interactive targets are at least 44px, content supports 200% text, and safe-area spacing is included for mobile controls.

Below-fold photos use responsive WebP sources and JPEG fallbacks. The 640px mobile hero is approximately 38 KB, compared with the original 87 KB poster. To regenerate responsive images, run `scripts/optimize-media.py` with Python 3 and Pillow already available; generation is not required for development or production builds.

Photos and fonts are self-hosted. Image sources are documented in `public/media/photos/CREDITS.md`; font licenses are in `public/media/fonts/`. The supplied stills and stock imagery are illustrations, not documentary photographs of a real Fiamma venue. The original ZIP and unused sequence frames have been removed; two still compositions remain as hero and dining-room photographs.

Keyboard navigation includes a skip link, visible focus, and native section links. The page has one semantic H1. Secondary hero copy is decorative, so assistive technology receives one stable introduction.

The end-to-end suite covers widths from 320px to 1440px, portrait/landscape layouts, navigation, enlarged text, motion preferences, constrained-device modes, static image loading, and automated WCAG accessibility checks. See `docs/ui-ux-review.md` for the latest validation details and the limits of browser emulation.
