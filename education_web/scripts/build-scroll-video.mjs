import { spawnSync } from 'node:child_process'
import { createHash } from 'node:crypto'
import { existsSync } from 'node:fs'
import { mkdir, readFile, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { readLearningZip } from './read-learning-zip.mjs'

// This section is built only from the user's ZIP, never from the old intro.
const source = path.resolve(process.argv[2] || 'src/assets/ezgif-869e7c93d25206b9-jpg.zip')
const framesDirectory = path.resolve('.media-source/learning-world-zip')
const output = 'public/videos/learning-world-zip.mp4'
const poster = 'public/images/learning-world-zip-poster.webp'
const frameRate = 10 // ZIP has no timing metadata; scroll determines the viewing pace.
if (!existsSync(source) || path.extname(source).toLowerCase() !== '.zip') {
  throw new Error('Pass the original ZIP containing the ezgif JPG sequence')
}
const zipBytes = await readFile(source)
const zipFrames = readLearningZip(zipBytes)
const frameCount = zipFrames.length
await mkdir(framesDirectory, { recursive: true })
await Promise.all(
  zipFrames.map((frame) => writeFile(path.join(framesDirectory, frame.name), frame.bytes)),
)

const bundled = path.resolve('node_modules/@ffmpeg-installer/win32-x64/ffmpeg.exe')
const ffmpeg = existsSync(bundled) ? bundled : 'ffmpeg'
await mkdir('public/videos', { recursive: true })
await mkdir('public/images', { recursive: true })
function run(args) {
  const result = spawnSync(ffmpeg, ['-hide_banner', '-y', ...args], {
    encoding: 'utf8',
    maxBuffer: 8 * 1024 * 1024,
  })
  if (result.error) throw result.error
  if (result.status !== 0) throw new Error(result.stderr)
  return result.stderr
}
const sequence = path.join(framesDirectory, 'ezgif-frame-%03d.jpg')
run([
  '-loglevel',
  'error',
  '-framerate',
  String(frameRate),
  '-start_number',
  '1',
  '-i',
  sequence,
  '-frames:v',
  String(frameCount),
  '-an',
  '-c:v',
  'libx264',
  '-preset',
  'slow',
  '-crf',
  '18',
  '-pix_fmt',
  'yuv420p',
  '-g',
  '4',
  '-keyint_min',
  '4',
  '-sc_threshold',
  '0',
  '-movflags',
  '+faststart',
  output,
])
run([
  '-loglevel',
  'error',
  '-i',
  output,
  '-frames:v',
  '1',
  '-c:v',
  'libwebp',
  '-quality',
  '90',
  poster,
])

// Compare every encoded frame to the same ordered frame in the extracted ZIP.
const comparison = run([
  '-framerate',
  String(frameRate),
  '-i',
  sequence,
  '-i',
  output,
  '-lavfi',
  '[0:v]format=yuv420p,setsar=1[reference];[1:v]setsar=1[encoded];[reference][encoded]ssim',
  '-frames:v',
  String(frameCount),
  '-f',
  'null',
  '-',
])
const ssim = Number(comparison.match(/All:([0-9.]+)/)?.[1])
if (!Number.isFinite(ssim) || ssim < 0.98) throw new Error(`Source comparison failed: SSIM ${ssim}`)
const sha256 = (bytes) => createHash('sha256').update(bytes).digest('hex')
const frames = await Promise.all(
  Array.from({ length: frameCount }, async (_, index) => {
    const name = `ezgif-frame-${String(index + 1).padStart(3, '0')}.jpg`
    return { name, sha256: sha256(await readFile(path.join(framesDirectory, name))) }
  }),
)
const report = {
  source: path.relative(process.cwd(), source).replaceAll('\\', '/'),
  sourceSha256: sha256(zipBytes),
  output,
  outputSha256: sha256(await readFile(output)),
  frameCount,
  frameRate,
  durationSeconds: frameCount / frameRate,
  timingNote: 'ZIP has no frame timing; 10 fps is an encoding choice, not recovered source timing.',
  comparison: { method: 'All frames in sequence order, SSIM', ssim },
  frames,
}
await writeFile('public/videos/learning-world-source.json', `${JSON.stringify(report, null, 2)}\n`)
console.log(JSON.stringify({ source: report.source, frameCount, frameRate, ssim, output }))
