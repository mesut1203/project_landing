# Apex concept photography and motion

Every editorial photo position has its own generated photograph. The gallery dialog enlarges the selected gallery image, rather than repeating it in a second page section.

| File in `public/media/` | Position |
| --- | --- |
| `apex-coast.webp` | Opening car stage |
| `apex-profile.webp` | Model overview |
| `apex-detail.webp` | Design system |
| `apex-handling.webp` | Handling system |
| `apex-cockpit.webp` | Interior system |
| `apex-pass.webp` | Gallery: mountain road |
| `apex-rear.webp` | Gallery: rear design |
| `apex-headlight.webp` | Gallery: lighting detail |
| `apex-night.webp` | Closing drive invitation |

All photos illustrate the fictional Apex One concept. The media manifest records generation provenance. The opening image loads with high priority; supporting images load lazily. `MediaImage` supplies a labeled fallback if a file fails to load. All original photographs, video, and the old 160-frame sequence have been removed.

The headline uses the official React Bits SplitText source, adapted from upstream commit `b6666e9f3a03a062143ce409f3aac53e27fdfaa8`. The required license is distributed at `public/licenses/react-bits-LICENSE.md`. GSAP supplies a finite image-shutter arrival, scroll-linked camera framing, and reading progress. Detail selection and hover movement preserve the existing controls.

There is no pinned opening, autoplay media, loading gate, or endless decorative loop. Reduced motion removes split text, shutter movement, camera drift and progress animation immediately. Mobile uses the lighter arrival and reveal treatments without desktop camera drift. Focused content is revealed immediately, and animation observers, media subscriptions and resize frames are cleaned up on unmount.
