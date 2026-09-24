# Verification

## Current revision — 2026-09-24

- `npm run build`: passed, including TypeScript validation.
- `npm run test`: 12 passed on installed Chrome.
- Verified immediate content, native scrolling through all four story sections, no video requests, device-specific images, anchor focus, mobile menu, local-only form and axe accessibility.
- Reduced motion works both on initial load and when changed during the session.
- Overflow checks passed at 320, 375, 390, 768, 1024, 1440 and 1920 px.
- Visual QA passed at 1440 × 900, 1366 × 768, 375 × 812 and 844 × 390. Images and CTA do not overlap; no broken editorial images, video requests, page errors or root-text-size overflow were recorded. Reviewed hero and story screenshots; corrected collapsed even-numbered story images on mobile.
- This revision has not been deployed. Prior production and Lighthouse results below describe the previous version, not the current implementation.

## Archived verification — 2026-09-14

Checked on 2026-09-14 against the production build at `http://127.0.0.1:4173/`.

- `npm run build`: passed, including strict TypeScript checks.
- `npm run test`: 14 passed on installed Chrome.
- Desktop video: autoplay/muted/inline/non-looping intro, end-to-page 700 ms fade, seekable Blob and forward/backward progress verified.
- Failure paths: failed media, slow initial download, reduced motion on load and reduced motion enabled during intro verified.
- Mobile: separate portrait requests, no landscape media downloads, menu focus containment, arrow navigation, Escape and focus restoration verified.
- Demo form: valid input reaches local-only feedback; no POST requests are sent. Axe checks passed.
- Overflow checks: 320, 390, 768, 1024, 1440 and 1920 px widths passed.
- Visual review: 1440 × 900 desktop, 1366 × 768 laptop, 390 × 844 phone, 844 × 390 phone landscape. Phone review used 4× CPU throttling and rapid progress changes.
- CTA/media bounds do not overlap. No broken images or browser page errors were recorded in the visual pass.
- Scene seams were captured just before and after progress 0.32, 0.50 and 0.75. Camera composition continues through each seam; copy fades in separate bands to avoid overprinted headlines.

## Lighthouse mobile simulation

| Category | Score |
| --- | ---: |
| Performance | 94 |
| Accessibility | 100 |
| Best Practices | 100 |
| SEO | 100 |

FCP: 2.0 s. LCP: 2.9 s. Total blocking time: 0 ms. CLS: 0. These are local simulated measurements, not production field data; LCP remains above the 2.5 s target under this profile.

Lighthouse wrote a complete report without a runtime audit error to `tmp/lighthouse-final.json`. Its CLI subsequently exited with an EPERM error while cleaning up its temporary Chrome directory on Windows. The scores above come from the saved report, not a claimed successful CLI exit.

Screenshots and machine-readable visual checks are in `tmp/`, excluded from source control. Physical iPhone/Safari verification has not been performed. Native portrait imagery is illustrative; the demo has no CRM or booking backend.

## Vercel production

Deployed on 2026-09-14 to https://luma-residences.vercel.app (Vercel status: READY).

- Linux cloud build: `npm ci` and `npm run build` passed after repairing missing bundled dependencies in the lockfile. No existing dependency versions changed.
- Public HTML and both desktop/portrait MP4 endpoints returned HTTP 200 with correct content types. Desktop MP4 also supports partial responses (206).
- Public Playwright checks passed for mobile portrait media/menu/focus, reduced motion and accessibility, and local-only form feedback.
- Desktop forward/backward video scrubbing passed in a separate public run (25 seconds). Earlier concurrent runs hit network/download timeouts and used the intended poster fallback. The story's background download allowance was increased to 25 seconds; intro still has its 4-second limit.
- After that adjustment, local build plus desktop scrubbing, video-error fallback and form checks all passed.
