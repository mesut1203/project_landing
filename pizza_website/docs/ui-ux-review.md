# Responsive UI review

The UI/UX Pro Max animation and accessibility guidelines informed this update. Its CLI searches were unavailable because Python was not available on PATH. The existing React website, Barlow Condensed / DM Sans typography, and restaurant imagery are preserved.

## Delivered behavior

- Editorial dark sections with a cream menu, larger body type, restrained SVG controls, numbered section labels, and a clearer visual rhythm.
- Mobile navigation supports taps, keyboard focus, Escape, outside click, hash links, and resizing back to desktop.
- Native section entrances use a one-time 280ms fade and 6px rise. The hero uses a static responsive photograph; the ZIP and unused frames are removed.
- Native scrolling has no pinned stage or extra scroll distance. Reduced motion, data saving, and 2G/slow-2G disable the light entrances and transitions, including when preferences change during the visit.
- The mobile poster is 38,166 bytes, compared with 86,986 bytes for the original. Below-fold photos have responsive WebP variants, reserved dimensions, lazy loading, and JPEG fallbacks.

## Verification

`npm.cmd run build` and `npm.cmd run lint` pass. The Playwright suite exercises desktop and mobile layout, normal and reduced motion, navigation, 200% mobile text, at least 44px touch targets, constrained-device fallbacks, static hero image loading, and automated WCAG A/AA checks.

Viewport coverage: 320×700, 375×812, 390×844, 667×375, 768×1024, 844×390, 1024×768, 1280×720, and 1440×900. Visual review includes the opening desktop/mobile scenes, cream menu, mobile disclosure, enlarged text, and the complete page.

A production Lighthouse mobile simulation on 2026-09-08 measured performance 96, accessibility 100, best practices 100, and SEO 100. LCP was 2.5s, total blocking time 0ms, and CLS 0.002. These are local lab results, not guarantees for every physical device or network. Screenshots and the JSON report are retained under `.local/`.

The email and opening hours remain explicitly marked sample content. Reservation links open the existing email draft; no booking backend was added.
