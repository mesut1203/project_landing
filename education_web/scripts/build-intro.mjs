import { spawnSync } from 'node:child_process'
import { mkdir, writeFile } from 'node:fs/promises'
import path from 'node:path'

const ffmpeg = path.resolve('node_modules/@ffmpeg-installer/win32-x64/ffmpeg.exe')
await mkdir('public/videos', { recursive: true })
await mkdir('public/images', { recursive: true })
function run(args) {
  const result = spawnSync(ffmpeg, ['-hide_banner', '-loglevel', 'error', '-y', ...args], { encoding: 'utf8' })
  if (result.status !== 0) throw new Error(result.stderr || 'FFmpeg failed')
}

// Four real-footage shots, 2.5 seconds each. Reserve the left third for HTML.
const shots = ['desk', 'math', 'tablet', 'student']
for (const shot of shots) {
  run(['-ss', '1', '-i', `.media-source/${shot}.mp4`, '-t', '2.5', '-an', '-vf',
    'scale=880:720:force_original_aspect_ratio=increase,crop=880:720,setsar=1,fps=24,pad=1280:720:400:0:color=0xf8f9f5',
    '-c:v', 'libx264', '-preset', 'fast', '-crf', '23', '-pix_fmt', 'yuv420p', `.media-source/${shot}-edit.mp4`])
}
await writeFile('.media-source/concat.txt', shots.map((shot) => `file '${shot}-edit.mp4'`).join('\n'))
run(['-f', 'concat', '-safe', '0', '-i', '.media-source/concat.txt', '-an', '-c', 'copy', '-movflags', '+faststart', 'public/videos/education-intro.mp4'])
run(['-i', 'public/videos/education-intro.mp4', '-frames:v', '1', '-c:v', 'libwebp', '-quality', '85', 'public/images/intro-poster.webp'])
run(['-ss', '3', '-i', '.media-source/student.mp4', '-frames:v', '1', '-vf', 'scale=960:1100:force_original_aspect_ratio=increase,crop=960:1100:iw-960:0', '-c:v', 'libwebp', '-quality', '88', 'public/images/hero-student.webp'])
for (const [source, destination, width] of [['coding', 'technology', 1000], ['english', 'languages', 720], ['design', 'creative', 720], ['students', 'community', 1100]]) {
  run(['-i', `public/images/${source}.jpg`, '-vf', `scale=${width}:-1`, '-frames:v', '1', '-c:v', 'libwebp', '-quality', '86', `public/images/${destination}.webp`])
}
console.log('Created 10-second H.264 intro, poster, and optimized WebP images.')
