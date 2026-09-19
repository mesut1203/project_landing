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

- The page opens immediately, without an intro overlay or scroll lock.
- UI motion uses opacity and transform. The learning section scrubs a paused video via currentTime.
- The section video comes only from the 50 JPGs in the supplied assets ZIP. Desktop has a wide cinematic image and lower-left copy; mobile preserves the full landscape image above a pale sage text area.
- Learn / Practice / Grow chapter navigation shares the scroll timeline with the video; chapter boundaries are 0%, 36%, 70%.
- Loading timeout: 15 seconds. Seek timeout: 5 seconds. Errors and reduced motion show all steps with a static poster.
- Section reveals use IntersectionObserver and the Web Animations API, without hiding unsupported-browser content.
- Progressive CSS scroll timelines gently scale the hero image and reveal its text. Unsupported browsers retain a static readable hero.
- All observers, timers, playback, media-query listeners and animations are cleaned up.

## Accessibility

Semantic sections, one h1, ordered heading hierarchy, labeled fields, inline errors and first-invalid focus. Native selects. Minimum 44px interactive targets. The page is interactive immediately. Chapter buttons have current-step states and visible keyboard focus; a skip link exits the scroll journey. Sticky navigation remains outside animated containing blocks. Reduced motion is respected at mount and when toggled during playback.

## Skill

The original page follows ui-ux-pro-max guidance for accessibility and form behavior. The learning journey applies scroll-world's Blob scrubbing, seek coalescing and poster handling, with redesign-existing-projects for the wide media layout and restrained chapter navigation. User requirements determine the supplied ZIP as the sole scene source, the React stack, the bright theme and removal of the intro. Chrome headless checks cover desktop, touch emulation and reduced motion.
