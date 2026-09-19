import { spawnSync } from 'node:child_process'
import ffmpeg from '@ffmpeg-installer/ffmpeg'

// Independent portrait photographs, never crops of the desktop film.
// The mobile intro is a quiet dissolve sequence; the mobile story scrubs these stills.
const names = ['arrival', 'lobby', 'residence', 'balcony']
const inputs = names.flatMap(name => ['-loop', '1', '-i', `public/images/mobile/${name}.webp`])
const filters = [
  '[0:v]scale=720:1280,setsar=1,format=rgba[v0]',
  '[1:v]scale=720:1280,setsar=1,format=rgba,fade=t=in:st=3.2:d=0.7:alpha=1[v1]',
  '[2:v]scale=720:1280,setsar=1,format=rgba,fade=t=in:st=6.8:d=0.7:alpha=1[v2]',
  '[3:v]scale=720:1280,setsar=1,format=rgba,fade=t=in:st=10.3:d=0.7:alpha=1[v3]',
  '[v0][v1]overlay=shortest=1[o1]',
  '[o1][v2]overlay=shortest=1[o2]',
  '[o2][v3]overlay=shortest=1,format=yuv420p[out]',
].join(';')
const result = spawnSync(ffmpeg.path, ['-y', '-loglevel', 'error', ...inputs, '-filter_complex', filters, '-map', '[out]',
  '-t', '14', '-r', '25', '-an', '-c:v', 'libx264', '-preset', 'medium', '-crf', '24', '-g', '50',
  '-movflags', '+faststart', 'public/videos/real-estate-intro-portrait.mp4'], { stdio: 'inherit' })
if (result.status !== 0) throw new Error('Portrait intro encoding failed')
