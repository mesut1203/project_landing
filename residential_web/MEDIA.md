# Media provenance

## Current presentation (2026-09-24)

The page now uses still images with natural scrolling and brief reveals. It makes no video requests. The source ZIP in `src/assets/` and both media-generation scripts were removed at the user's request to simplify the site. The existing WebP images are the runtime assets; the previously rendered MP4 files are retained but unused. The former ZIP/FFmpeg reproduction command is no longer available.

The details below document how the existing assets were originally made.

## Supplied camera movement

Original source: `ezgif-8ac1ae118054c2f1-jpg.zip`, supplied by the user and subsequently removed from `src/assets/`.

The archive contains 140 JPEG frames at 1280 × 720. They show an approach to the building, movement through the entrance and living area, then the balcony and skyline. There is no timing metadata in the ZIP, so the sequence is interpreted at 10 fps to meet the requested 10–15 second intro.

The former preparation script extracted the sequence into `tmp/source-frames`, retained a clean 1120 × 630 composition and encoded H.264 at 30 fps with blended intermediate frames, GOP 8, CRF 20, faststart and no audio. Result: `public/videos/real-estate-intro.mp4`, approximately 13.83 seconds and 4.73 MB. It was used for the former intro and scroll scrubbing.

Desktop poster frames: arrival 1, lobby 57, residence 85 and balcony 116. The single source sequence preserves the original continuous camera movement; no separately generated video legs are joined.

## Independent portrait assets

The ZIP contains no portrait source. Four new native vertical compositions were generated using the built-in image generation tool, with the supplied frames as architectural references. They are illustrative, not verified project photographs. No Monid/Higgsfield paid rendering pipeline was used.

Final web assets are saved in `public/images/mobile/` as `arrival.webp`, `lobby.webp`, `residence.webp`, and `balcony.webp`. Each is 720 pixels wide and taller than it is wide. They are not center crops of the desktop sequence.

The former portrait preparation script produced a separate 720 × 1280, 14-second silent intro. The four portrait images dissolve at 3.2, 6.8 and 10.3 seconds. It is a still-image film. The current page uses the native portrait stills directly.

## Editorial imagery

Four additional native portrait illustrations represent rooftop, wellness, garden and lounge. Their mobile files are in `public/images/mobile/`; separately encoded landscape versions are in `public/images/desktop/`. The desktop residence and material stills use landscape renditions of the portrait residence, lounge, balcony and lobby imagery for sharper editorial presentation.

Editorial illustrations are distinguished from verified project imagery by the visible concept notice in the footer.

## Generation prompt set

Tool: built-in `image_gen`, one generation per asset, eight images total. No API key or separately billed video provider was used.

### Story images

Shared prompt template:

“Generate ONE separate project image asset for Luma Residences named {name}-portrait. The input is a style and architecture reference, not an edit target. {subject} Photoreal architectural editorial photograph, realistic textures, warm sunlight, restrained tones of charcoal, ivory, champagne and forest green. Same design language as the provided reference. No text, no logo, no watermark, no people. Standalone vertical image, native 9:16, no frame, no collage. Save the resulting asset for use in this workspace if possible.”

Subjects:

- **arrival**, reference frame 1: Exterior establishing view of the SAME mid-rise residential building: six floors, dark bronze glazing, pale stone balconies, horizontal roof canopies, lush garden. A low ground-level approach, full building fits vertically with a foreground path and open sky. Native 9:16 portrait camera shot, NOT a center crop of the reference.
- **lobby**, reference frame 71: A new native 9:16 portrait camera composition of the double-height residential lobby, pale limestone floor, full-height bronze framed glass doors, warm oak walls, a single sculptural seat and green planting. Foreground floor and tall ceiling included, balanced vertical architectural photography, NOT a center crop.
- **residence**, reference frame 71: A new native 9:16 portrait architectural camera shot inside the same quiet luxury living room: ivory curved sofa, low light travertine table, pale oak floors, tall gauze curtains and bronze sliding doors toward a city terrace. Include ceiling and a foreground corner chair. NOT a center crop.
- **balcony**, reference frame 106: A new native 9:16 portrait architectural camera shot on the same private balcony, glass balustrade, one sculptural lounge chair, natural limestone, potted greenery, cinematic hazy city skyline in golden late-afternoon light. Include terrace foreground and generous sky. NOT a center crop.

### Amenities

Shared prompt template:

“Use case: photorealistic-natural. Standalone illustrative photographic asset for Luma Residences luxury apartment concept. {subject} Native PORTRAIT 9:16 composition. Realistic subtle material textures, editorial architectural photography, restrained charcoal, ivory, champagne and forest green, photographic optical depth, no artificial bloom. No people, no text, no logo, no watermarks, no collage. Main focal area in middle of image so desktop can use its own landscape rendition.”

Subjects:

- **rooftop**: An open-air rooftop terrace of a refined contemporary residential building, bronze pergola, limestone paving, sculptural ivory outdoor lounge chairs, glass parapet, restrained lush planters and distant city skyline. Wide architecture visible within a native vertical 9:16 composition. No pool.
- **wellness**: An empty elegant residential wellness studio with natural oak wall slats, one limestone bench, neatly rolled linen yoga mats, a low ceramic vase, soft indirect warm lighting and a tall window toward foliage. Clearly a wellness and meditation space, natural architectural photography.
- **garden**: A quiet residential garden courtyard, generous curved limestone path through layered ferns and small mature trees, textured stone bench, modern dark bronze and pale stone facade in the distant background, softly dappled golden sunlight.
- **lounge**: An empty intimate residents lounge with two curved ivory sofas, low travertine coffee table, warm oak millwork, tall bronze-framed windows and soft green foliage outside. Refined contemporary interior in gentle afternoon light.
