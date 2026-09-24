# Luma Residences design direction

Luxury residential editorial with still architectural imagery and natural scrolling. An architectural narrative leads to one booking destination.

- DESIGN_VARIANCE: 7. Asymmetric residence and amenity compositions, stacked mobile layouts.
- MOTION_INTENSITY: 2. One-time 250 ms reveals (6 px / opacity), 200–250 ms interaction feedback. No pinned scenes, scroll scrubbing, parallax or autoplay intro. Reduced motion cancels reveals and disables interaction transforms.
- VISUAL_DENSITY: 3. Large photography, short copy and deliberate breathing space.
- Custom brand aesthetic with Tailwind CSS, not an imitation of a third-party component system.
- Charcoal `#202421`, ivory `#f1eee6`, champagne `#d4bea0`, forest `#293c33`, muted text `#b7bbb3`.
- Dark theme throughout. The forest visit section is a dark tonal variation.
- Cormorant Garamond's fine architectural proportions suit the brief's luxury editorial direction. Manrope provides compact, legible controls and body text. Both are self-hosted.
- Square edges, hairline rules, no elevated card containers. Gold is reserved for the main action and selected navigation states.
- Desktop places copy beside the image. Mobile places copy below the image. Neither hides the central architecture behind a CTA.
- The requested navbar CTA is “Book a viewing”; primary page CTA is “Book a private viewing”. Both target the same visit form.
- No invented location, architect attribution, dimensions, prices, ratings, scarcity claims or testimonials.

Layers are documented in `src/index.css`. Only transform and opacity animate. Navigation and form feedback remain usable with reduced motion.
