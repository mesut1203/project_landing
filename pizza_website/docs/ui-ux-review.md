# Responsive UI review

The UI/UX Pro Max design-system search and animation/accessibility validation informed this update. Recommendations were adapted to the existing React website, its established Barlow Condensed / DM Sans typography, and the available restaurant imagery.

## Delivered behavior

- Editorial dark sections with a cream menu, larger body type, restrained SVG controls, numbered section labels, and a clearer visual rhythm.
- Mobile navigation supports taps, keyboard focus, Escape, outside click, hash links, and resizing back to desktop.
- Short native section entrances replace the runtime animation-library imports. The sequence uses a twelve-image cache, a maximum of three pending loads, and frame scheduling only while relevant.
- The hero autoplays on desktop and mobile. Static hero mode applies by default with reduced motion, data saving, or 2G/slow-2G; a visible "Play motion" button permits explicit playback until reload. RAM/CPU hints no longer disable animation. Scroll-driven playback is an optional mode on viewports at least 1024px wide and 600px tall.
- The mobile poster is 38,166 bytes, compared with 86,986 bytes for the original. Below-fold photos have responsive WebP variants, reserved dimensions, lazy loading, and JPEG fallbacks.

## Verification

`npm.cmd run build` and `npm.cmd run lint` pass. The Playwright suite exercises desktop and mobile layout, normal and reduced motion, navigation, 200% mobile text, at least 44px touch targets, constrained-device fallbacks, failed sequence images, and automated WCAG A/AA checks.

Viewport coverage: 320×700, 375×812, 390×844, 667×375, 768×1024, 844×390, 1024×768, 1280×720, and 1440×900. Visual review includes the opening desktop/mobile scenes, cream menu, mobile disclosure, enlarged text, and the complete page.

A production Lighthouse mobile simulation on 2026-09-08 measured performance 96, accessibility 100, best practices 100, and SEO 100. LCP was 2.5s, total blocking time 0ms, and CLS 0.002. These are local lab results, not guarantees for every physical device or network. Screenshots and the JSON report are retained under `.local/`.

The email and opening hours remain explicitly marked sample content. Reservation links open the existing email draft; no booking backend was added.
