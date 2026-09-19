# Fiamma pizza frame sequence

50 sequential JPEG frames, 1280 × 720 pixels, extracted from the supplied ZIP.
Images total 2,018,542 bytes. No image processing or recompression was applied.
The original ZIP is retained in `src/assets`.

- Hero poster: `/media/sequence/frame-001.jpg`
- Frame URL: `/media/sequence/frame-${String(index).padStart(3, '0')}.jpg`
- Frame range: 1 through 50, inclusive
- Oven and table scene: `/media/sequence/frame-050.jpg`
- Machine-readable details: `/media/sequence/metadata.json`

The sequence begins with an overhead pizza, moves into a cheese and basil close-up,
then resolves to a pizza on a table in front of a lit wood-fired oven. The supplied
archive contains no frame timing. The hero plays at an authored 10 fps, holds the
final scene briefly, then loops. Its optional desktop scroll mode maps progress
from 0 to 1 onto frame indices 1 to 50. Load the poster first. Honor
`prefers-reduced-motion` with a static poster and avoid loading the sequence when
animation is disabled.

The preparation script `.local/prepare-sequence.ps1` validates each archive entry
before extraction and does not overwrite existing images.
