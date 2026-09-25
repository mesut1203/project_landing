# Seven independent websites

Seven React + TypeScript + Vite sites, redesigned in their existing frameworks. Each retains its original brand, language and interactions, with a distinct visual direction and newly generated imagery.

## Deployed websites

| Website         | URL                                         |
| --------------- | ------------------------------------------- |
| Nâu Coffee      | https://nau-coffee-eight.vercel.app         |
| Apex Motors     | https://car-website-eight-henna.vercel.app/ |
| Learn Forward   | https://education-web-roan.vercel.app       |
| Aurelia         | https://hotel-web-phi-two.vercel.app        |
| Fiamma          | https://fiamma-pizza-house.vercel.app       |
| Luma Residences | https://luma-residences.vercel.app          |
| Nomad           | https://nomad-vietnam.vercel.app            |

## Preview everything

Use Node.js 24. From this directory:

```sh
node preview.mjs
```

Open **http://127.0.0.1:5279** for the customer-facing collection page. It starts all seven independent sites. Stop with Ctrl+C. Dependencies must already be installed in each site (`npm ci` inside each folder).

| Folder            | Brand           | Direction                                                                                | Local preview                    |
| ----------------- | --------------- | ---------------------------------------------------------------------------------------- | -------------------------------- |
| `cafe_shop`       | Nâu Coffee      | Espresso-and-copper coffee atelier, bold Swiss typography and React Bits motion          | http://127.0.0.1:5270            |
| `car_website`     | Apex Motors     | Graphite performance showroom, engineering rails and technical data                      | http://127.0.0.1:5271            |
| `education_web`   | Learn Forward   | Cobalt learning institute, bold type, yellow intake bar and course index                 | http://127.0.0.1:5272            |
| `hotel_web`       | Aurelia         | Immersive coast photography, quiet centered type and a booking strip                     | http://127.0.0.1:5273            |
| `pizza_website`   | Fiamma          | Tomato and butter trattoria poster, expressive masthead and paper menu                   | http://127.0.0.1:5274            |
| `residential_web` | Luma Residences | Architectural folio, broad exhibition image, precise grids and animated typography       | http://127.0.0.1:5275            |
| `travel_website`  | Nomad           | Cinematic travel journal, immersive landscapes, featured journeys and React Bits reveals | https://nomad-vietnam.vercel.app |

The collection template is `preview.html`; its seven website captures are in `.preview/`. The launcher serves them locally alongside the independent sites.

Each folder can also run independently with `npm run dev`, `npm run build`, and `npm run preview`.

## Independent visual identities

Each site has its own navigation structure, hero composition, typography, image treatment,
section rhythm and actions. The designs do not share a floating navigation or framed-card
template. Responsive layouts, keyboard access, working demo interactions and reduced-motion
support remain consistent quality requirements across the projects.

Coffee, Apex, Nomad and Luma include selected components from the official React Bits
source, with upstream attribution and licenses retained within each site. Motion
respects reduced-motion settings, and continuous decorative movement has pause
controls where present.

Learn Forward uses masked typography, a portrait shutter and sequenced course/learning-step entrances. Aurelia uses a slow headline arrival, photo depth and room transitions. Apex combines mechanical type assembly, a two-panel reveal and camera movement. Each has its own motion timing; keyboard focus and live reduced-motion changes remain usable.

## New imagery

All original tracked raster images have been removed. There are 68 distinct generated photographs, delivered as 80 optimized WebP files including twelve residential mobile variants. The latest pass adds 37 photographs so every editorial placement and menu item has its own image. Product-detail dialogs and gallery lightboxes retain the image of the selected item. Old videos and frame sequences that used original imagery were also removed. Existing brand marks, icons and licensed fonts remain where appropriate.

Generated with the built-in imagegen tool. These are concept illustrations, not photographs documenting real properties, products, or people. The brief used realistic editorial photography, natural materials, consistent light and color per category, and no embedded text or watermarks.

| Site        | Asset directory                                        | Image subjects                                                                                                           |
| ----------- | ------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------ |
| Café        | `cafe_shop/public/images/editorial/`                   | 17 photos: twelve individual menu items, coffee ritual, interior, counter, reading corner and conversation               |
| Cars        | `car_website/public/media/`                            | Nine views: coast, profile, handling, cockpit, bodywork, mountain pass, rear, headlight and night pavilion               |
| Education   | `education_web/public/images/`                         | Six scenes: individual learner, creative practice, community, code workshop, language conversation and study planning    |
| Hotel       | `hotel_web/public/media/`                              | Eleven scenes: coastline, pool, reading alcove, balcony, three rooms, dining, headland, spa and rooftop                  |
| Pizza       | `pizza_website/public/media/`                          | Five scenes: margherita, dough craft, dining room, sharing table and entrance                                            |
| Residential | `residential_web/public/images/desktop/` and `mobile/` | Twelve scenes: four architectural studies, three residences, materials and four amenities                                |
| Travel      | `travel_website/public/images/`                        | Eight scenes: Ha Giang dawn, terrace walk, mountain pass, coastal cove and road, Hoi An morning and riverside, tea hills |

## Functionality

The existing menus, filters, galleries, keyboard controls, and demo forms remain. Café favorites still persist locally. Booking and enquiry forms retain their existing demo behavior; no new backend or live reservation service was added.

Builds include TypeScript checks. Use each site's available `lint`, `test`, `test:e2e`, or `test:browser` scripts for its checks. Playwright-based projects use installed Chromium (`npx playwright install chromium` if needed).
