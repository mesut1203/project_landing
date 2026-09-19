# Nomad Vietnam — design system

## Direction

A slow travel journal. Full-viewport scroll-controlled film, quiet chapter navigation, generous serif typography, warm paper sections and forest green surfaces. Existing source frames set the photographic direction. No generated media or fabricated trust signals.

## Palette

| Role              | Value   |
| ----------------- | ------- |
| Forest background | #182923 |
| Forest surface    | #20352d |
| Warm paper        | #f4f1e7 |
| Sage paper        | #eaeadd |
| Light text        | #f5f2e9 |
| Dark text         | #24392c |
| Light accent      | #d6dfac |
| Dark accent       | #4c613c |

Local Lora Variable for display; Segoe UI/Arial for body. Desktop gutters 56px, mobile 20px. Hero headline stays on two lines, imagery carries the atmosphere. Offset destination photographs create a journal rhythm. Buttons and chapter controls have 44px minimum targets.

## Motion and accessibility

Hero stays pinned across a 480svh track (400svh phone). One supplied 16-second sequence follows scroll in both directions. Coalesced seeks, short GOP and Blob loading support scrubbing. An image poster remains until video paints. No autoplay loop. Pause holds the video frame. Respect reduced motion with a static hero and no media request. Other sections retain reversible entrance transitions.

Native buttons/links, labeled navigation and form, keyboard focus, mobile Escape behavior and a skip link remain. The local demo form never sends booking requests. Validate with build and Playwright including WCAG AA, responsive layouts and 200% zoom.
