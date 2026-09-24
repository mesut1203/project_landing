# Learn Forward

## Direction

Premium, optimistic education landing page. Large editorial sans-serif type, real learning imagery, generous white space, asymmetric learning paths. Light theme as requested. No fabricated metrics, testimonials, or social proof.

## Source of truth

All rendered copy, media paths, alt text, navigation destinations and form messages live in `src/data/content.ts` with TypeScript interfaces. The supplied user brief takes priority over skill suggestions.

## Visual tokens

| Role | Value |
| --- | --- |
| Ink / primary action | Navy `#192d42` |
| Page | Soft white `#f8f9f5` |
| Raised surface | `#fdfefa` |
| Positive accent | Sunshine `#f7cd4b` |
| Focus / secondary accent | Blue `#2466bb` |
| Secondary text | `#5b6874` |
| Display | Manrope Variable, 750–800 |
| Body | Be Vietnam Pro, 400–600 |

Cards use 14px corners, controls 6–8px. Photography has deliberate asymmetric cropping. Desktop content is capped at 1264px, with expanded gutters and a 1380px cap on large displays. Mobile is a single-column layout.

## Motion

- Native scrolling, without pinned sections, video scrubbing, parallax or hero zoom.
- The learning journey uses a static 16:9 image and three always-visible steps: three columns on desktop, one on mobile.
- Reveal once using opacity and 8px translation over 250ms. Stagger learning paths by 40ms.
- Hover image scale is limited to 1.015 over 250ms; controls use 200ms transitions.
- Respect reduced motion at mount and on live preference changes. Unsupported browsers retain readable content.
- Clean up observers, media-query listeners and animations.

## Accessibility

Semantic sections, one h1, ordered headings, labeled fields, inline errors and first-invalid focus. Native selects and visible keyboard focus. The learning journey never hides its steps or traps scrolling; its community link remains available. Images reserve their dimensions. Check desktop, mobile, landscape and enlarged text.

## Skill

Apply ui-ux-pro-max guidance for subtle motion, accessibility and performance. Preserve the existing visual identity. The current user request removes the ZIP and Scroll World in favor of lightweight animation.
