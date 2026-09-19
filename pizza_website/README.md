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

`dist/` contains the production site, including the style tile, responsive photos, fonts, and all animation frames. No external font, image, or animation service is required at runtime.

## Content and reservations

Edit `src/content.ts` to change the menu, email/booking URL, or opening hours. The email `hello@fiamma.example` is intentionally a sample, not a working restaurant address. Opening hours are illustrative and marked on the page. Replace both contact fields with real information and set `isPreview` to `false` before publishing. Mailto links open an email draft; this site does not send mail or confirm bookings.

## Design and animation

- Shared palette, fonts, wordmark and buttons: `public/styles/brand.css`.
- Responsive page layout: `src/index.css`.
- Design notes: `docs/brand-guidelines.md`.
- Scroll sequence: `src/components/Hero.tsx`.
- Section entrances: `src/components/Reveal.tsx`.

The 50 supplied frames from `src/assets/ezgif-7b835a60f523e052-jpg.zip` remain losslessly published to `public/media/sequence/`. The hero automatically plays them on desktop, tablet, and mobile, at an authored 10 fps with a short hold on the final scene before looping (the ZIP supplies no timing). Playback buffers while an image loads. On screens at least 1024px wide and 600px tall, “Explore on scroll” switches to the original native-scroll sequence with transforming/fading copy; “Watch film” returns to automatic playback. A twelve-frame cache and at most three concurrent requests bound image work. Rendering uses a single animation-frame loop, stops outside the hero, and pauses in hidden tabs. Missing frames retain the last good image. No wheel interception or scroll replacement is used.

Reduced-motion users and devices reporting a slow/data-saving connection receive a static hero without the sticky scroll distance, with a visible "Play motion" button to explicitly start playback. This opt-in lasts until reload; system and data preferences remain the default on the next visit. RAM/CPU hints no longer silently disable animation. Automatic playback uses normal page height on every screen. The pause control freezes the current image, disables page motion, and remembers the preference for the browser session. Resuming continues the film or eases toward the latest scroll position in scroll mode.

Mobile navigation is a keyboard-accessible disclosure with Escape, outside-click, and link-selection dismissal. Header offsets follow its measured height when text size changes. Interactive targets are at least 44px, content supports 200% text, and safe-area spacing is included for mobile controls.

Below-fold photos use responsive WebP sources and JPEG fallbacks. The 640px mobile hero is approximately 38 KB, compared with the original 87 KB poster. The original JPEG sequence is retained because transcoding most frames to WebP increased their file size. To regenerate responsive images, run `scripts/optimize-media.py` with Python 3 and Pillow already available; generation is not required for development or production builds.

Photos and fonts are self-hosted. Image sources are documented in `public/media/photos/CREDITS.md`; font licenses are in `public/media/fonts/`. The supplied sequence and stock imagery are illustrations, not documentary photographs of a real Fiamma venue. Original source assets remain unchanged.

Keyboard navigation includes a skip link, visible focus, and native section links. The page has one semantic H1. Secondary hero copy is decorative, so assistive technology receives one stable introduction.

The end-to-end suite covers widths from 320px to 1440px, portrait/landscape layouts, navigation, enlarged text, motion preferences, constrained-device modes, missing frames, and automated WCAG accessibility checks. See `docs/ui-ux-review.md` for the latest validation details and the limits of browser emulation.
