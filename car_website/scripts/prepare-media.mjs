import { readFile, mkdir, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { unzipSync } from 'fflate'
import sharp from 'sharp'

const root = process.cwd()
const zipPath = path.join(root, 'src/assets/ezgif-7893fd5aaba20c46-jpg.zip')
const output = path.join(root, 'public/media')
const sequence = path.join(output, 'sequence/desktop')
await mkdir(sequence, { recursive: true })
const entries = unzipSync(await readFile(zipPath))
const names = Object.keys(entries).filter((name) => /^ezgif-frame-\d+\.jpg$/.test(name)).sort()
if (names.length !== 160) throw new Error(`Expected 160 source frames, found ${names.length}`)
let totalBytes = 0
for (let start = 0; start < names.length; start += 8) {
  await Promise.all(names.slice(start, start + 8).map(async (name, offset) => {
    const data = entries[name]
    const metadata = await sharp(data).metadata()
    if (metadata.width !== 1280 || metadata.height !== 720) throw new Error(`Unexpected source dimensions: ${name}`)
    const image = await sharp(data).webp({ quality: 72, effort: 6 }).toBuffer()
    totalBytes += image.length
    await writeFile(path.join(sequence, `frame-${String(start + offset).padStart(4, '0')}.webp`), image)
  }))
}
const stills = {
  'ignition-desktop': 1, 'motion-desktop': 80, 'arrival-desktop': 160,
  model: 130, 'detail-body': 1, 'detail-wheel': 40, 'detail-interior': 55,
  'gallery-coast': 85, 'gallery-rear': 130,
}
for (const [name, frame] of Object.entries(stills)) {
  const source = entries[names[frame - 1]]
  await sharp(source).webp({ quality: 90 }).toFile(path.join(output, `${name}.webp`))
}
// A full-width static phone fallback, explicitly not a portrait film or crop.
await sharp(entries[names.at(-1)]).resize({ width: 720 }).webp({ quality: 85 }).toFile(path.join(output, 'mobile-static.webp'))
await writeFile(path.join(output, 'source-manifest.json'), JSON.stringify({
  source: path.relative(root, zipPath), frames: names.length, width: 1280, height: 720,
  fps: 16, webpBytes: totalBytes, portraitChainAvailable: false,
  limitations: ['Source watermark and manufacturer badges retained', 'Vehicle identity changes between shots', 'Source contains cuts; seamless camera continuity cannot be created by the scrubber'],
}, null, 2) + '\n')
console.log(`Prepared ${names.length} WebP frames, ${(totalBytes / 1024 / 1024).toFixed(2)} MiB. Native portrait media is not present.`)
