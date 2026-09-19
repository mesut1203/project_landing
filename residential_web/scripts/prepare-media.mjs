import fs from 'node:fs/promises'
import path from 'node:path'
import { spawnSync } from 'node:child_process'
import AdmZip from 'adm-zip'
import sharp from 'sharp'
import ffmpeg from '@ffmpeg-installer/ffmpeg'

const root = process.cwd()
const source = path.join(root, 'src/assets/ezgif-8ac1ae118054c2f1-jpg.zip')
const frames = path.join(root, 'tmp/source-frames')
await fs.mkdir(frames, { recursive: true })
await fs.mkdir('public/videos', { recursive: true })
await fs.mkdir('public/images/desktop', { recursive: true })
await fs.mkdir('public/images/mobile', { recursive: true })
const entries = new AdmZip(source).getEntries().filter(entry => /^ezgif-frame-\d+\.jpg$/.test(entry.entryName))
for (const entry of entries) await fs.writeFile(path.join(frames, entry.entryName), entry.getData())

// The supplied 1280×720 sequence contains a mark at the right edge.
// Retain a clean 16:9 architectural composition, without inventing new frames.
const crop = { left: 0, top: 0, width: 1120, height: 630 }
const posters = { arrival: 1, lobby: 57, residence: 85, balcony: 116 }
for (const [name, number] of Object.entries(posters)) {
  await sharp(path.join(frames, `ezgif-frame-${String(number).padStart(3, '0')}.jpg`))
    .extract(crop).webp({ quality: 90 }).toFile(`public/images/desktop/${name}.webp`)
}
const result = spawnSync(ffmpeg.path, [
  '-y', '-framerate', '10', '-i', path.join(frames, 'ezgif-frame-%03d.jpg'),
  '-an', '-vf', 'crop=1120:630:0:0,minterpolate=fps=30:mi_mode=blend',
  '-c:v', 'libx264', '-preset', 'medium', '-crf', '20', '-pix_fmt', 'yuv420p',
  '-g', '8', '-keyint_min', '8', '-sc_threshold', '0', '-movflags', '+faststart',
  'public/videos/real-estate-intro.mp4',
], { stdio: 'inherit' })
if (result.status !== 0) throw new Error('Video encoding failed')
console.log(`Prepared ${entries.length} supplied frames, desktop posters and intro/scrub film.`)
