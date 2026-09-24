# Nomad Vietnam — design system

## Direction

A slow travel journal. Static photographic hero, natural page scrolling, generous serif typography, warm paper sections and forest green surfaces. Existing source frames set the photographic direction. No generated media or fabricated trust signals.

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

Local Lora Variable for display; Segoe UI/Arial for body. Desktop gutters 56px, mobile 20px. Hero headline stays on two lines, imagery carries the atmosphere. Offset destination photographs create a journal rhythm. Buttons and navigation controls have 44px minimum targets.

## Motion and accessibility

Static hero image with no video requests or pinned scroll track. Content reveals once with opacity and at most 8px translation over 280ms; hover feedback lasts 180–280ms. No scroll scrubbing, section scaling, clip-path transitions or repeating motion. Reduced motion disables animations and transitions and keeps every section visible.

Native buttons/links, labeled navigation and form, keyboard focus, mobile Escape behavior and a skip link remain. The local demo form never sends booking requests. Validate with build and Playwright including WCAG AA, responsive layouts and 200% zoom.
