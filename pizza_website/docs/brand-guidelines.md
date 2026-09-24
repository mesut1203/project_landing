# Fiamma Pizza House

The identity pairs the heat of a wood-fired oven with the quiet of a neighborhood dining room. Use an editorial layout, direct copy, and generous empty space. Keep photography sections dark and give the menu a warm cream background for a clear change of pace.

Design read: a premium neighborhood restaurant landing page for diners, with cinematic food imagery and bold editorial type. Native CSS on the existing React/Tailwind project is the foundation. UI/UX Pro Max design dials: variance 7, motion 3, density 3. Preserve the established identity while prioritizing readable mobile typography, lightweight motion, and generous spacing.

## Shared tokens

The canonical web tokens and common controls live in `public/styles/brand.css`.

| Role | Value |
| --- | --- |
| Background | `#171614` |
| Raised surface | `#211F1C` |
| Main text | `#F4EDDF` |
| Supporting text | `#B7B0A4` |
| Accent | `#C93626` |
| Hairline | `rgba(244,237,223,.18)` |
| Text on primary button | `#FFF8EB` |
| Image radius | `8px` |
| Button radius | `999px` |

The slightly lighter cream used inside red buttons improves small-text contrast without introducing a new accent. Use tomato red consistently for the primary action. Avoid red for small running text.

## Type

- Wordmark: Barlow Condensed, weight 800, italic, letter-spacing `-.065em`. Render the spelling `fiamma.` exactly.
- Display: Barlow Condensed, weight 700, normal. Keep headings in sentence case and use tight line spacing.
- Body and controls: DM Sans, weights 400 and 500. Body copy should remain comfortably readable on narrow screens.
- Fonts are self-hosted WOFF2 files with `font-display: swap`.

## Imagery and layout

Give food photographs room to be seen. Favor blistered crust, fresh basil, melted cheese, oven fire, and warm wood. Keep image corners at 8px. Menu items sit on cream with dark ink, separated by fine rules. Collapse desktop asymmetry into a clear mobile reading order. Use 16px body text and at least 44px touch targets. Supporting labels may be smaller; retain comfortable contrast in both dark and cream sections.

## Motion

Only animate `transform` and `opacity`. Reveal content once over 280ms with a gentle 6px upward move and fade; cap stagger at 50ms. Use 220ms control transitions and subtle photo scaling on devices with a precise hover pointer. Keep native scrolling and allow keyboard focus to remain predictable. The hero is a static photograph on all screens. No autoplay, pinning, parallax, or scroll-driven sequence is used. Reduced-motion and slow/data-saving preferences disable the short entrances.

Use `prefers-reduced-motion: reduce` to replace animated entrances and zooms with fully visible static content. The HTML style tile demonstrates a single, user-triggered entrance with replay and pause controls.

## Voice

Warm, direct, and unhurried. Short sentences and familiar words. Do not invent testimonials, popularity claims, precise business metrics, or a venue history. Do not use em dashes.

## Style tile

Open `/style-tile.html` while the site is running. The specimen includes the wordmark, palette, type, working navigation buttons, and motion study. Its stylesheet and assets use relative URLs so the visual specimen also works from an extracted asset folder.
