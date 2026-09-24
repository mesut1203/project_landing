# Responsive UI review

The current design uses a tomato-red and butter-paper trattoria poster, preserving the React application, menu content, contact links and locally generated photography. The hero, navigation, printed menu, craft story and visit section have separate responsive compositions.

## Preserved behavior

- Mobile navigation supports keyboard focus, a focus trap, Escape, hash links, body scroll locking, background inertness and resizing back to desktop.
- The hero is a static responsive photograph. Scrolling is native, with no pinned scenes, video or frame sequences.
- One-time transform/opacity entrances respect reduced motion, data-saving and slow-connection preferences, including changes during the visit.
- Hero imagery loads eagerly; supporting images load lazily with reserved dimensions.
- The email and opening hours remain explicitly marked sample content. Contact links open an email draft; there is no booking backend.

## Verification scope

The Playwright suite covers desktop and mobile layouts, normal and reduced motion, navigation, 200% mobile text, minimum 44px header controls, constrained-device fallbacks, photo loading, and automated WCAG A/AA checks. It also checks the standalone style tile and its replay/pause controls.

Viewport coverage: 320×700, 375×812, 390×844, 667×375, 768×1024, 844×390, 1024×768, 1280×720, and 1440×900. Browser emulation and automated checks complement visual review; they do not replace physical-device or assistive-technology testing.

Run `npm run build`, `npm run lint`, and `npm run test:e2e` from this folder to verify the current source. Use Node 22.12+ for the Vite 8 toolchain.
