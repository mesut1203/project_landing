# Fiamma Pizza House

Fiamma is a bold neighborhood trattoria poster: tomato ink on butter paper, an oversized italic wordmark, expressive condensed headings, and food that fills the frame. The menu appears immediately after the opening scene, followed by the craft story and the dining room.

## Tokens and type

Canonical tokens and shared controls live in `public/styles/brand.css`; the page composition lives in `src/redesign.css`.

| Role | Value |
| --- | --- |
| Butter paper | `#F8EDCF` |
| Warm surface | `#EFE0B9` |
| Deep tomato text | `#AC271D` |
| Supporting brown | `#805347` |
| Tomato accent | `#B92C21` |
| Light button text | `#FFF3D5` |
| Image and button radius | `0px` |

Barlow Condensed bold and bold italic carry the wordmark and uppercase display headings. DM Sans handles supporting copy and controls. All fonts are self-hosted WOFF2 files with `font-display: swap`.

## Composition

The desktop hero places an oversized masthead over a food photograph and a red poster panel. Mobile follows the masthead with the invitation, actions and photograph. A printed, ruled menu uses rows for names, ingredients and prices. The craft story is a red spread with one tilted photograph. The visit section pairs a dining-room photograph with the opening hours and contact details.

Rectangular buttons have direct arrow icons and a small printed shadow. A limited checker rule and oven stamp add a pizzeria character. Avoid floating glass navigation, nested rounded frames and decorative CTA circles.

## Motion and access

Animate entrances with transform and opacity only. Entrances run once, respect focus and stop for reduced motion or constrained data connections. Keep the hero static and scrolling native. Navigation uses a focus-trapped mobile overlay with Escape and focus restoration. Controls retain visible focus and at least 44px touch targets.

## Voice and imagery

Warm, direct, and unhurried. Do not invent testimonials, business metrics, or venue history. Opening hours and the contact address remain marked sample content. All three food, craft and room images are generated concept photography; see `public/media/asset-manifest.json`.

The standalone `/style-tile.html` reflects these fonts, colors and controls, with an accessible replay/pause motion demonstration.
