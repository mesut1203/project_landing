import { mkdir, writeFile, access } from 'node:fs/promises'

const sources = [
  { name: 'desk', page: 'https://mixkit.co/free-stock-video/panning-shot-of-college-study-desk-101309/' },
  { name: 'math', page: 'https://mixkit.co/free-stock-video/a-student-making-notes-and-mathematical-charts-on-the-notebook-50109/' },
  { name: 'student', page: 'https://mixkit.co/free-stock-video/girl-doing-homework-in-a-library-4531/' },
  { name: 'tablet', page: 'https://mixkit.co/free-stock-video/girl-working-on-the-floor-of-a-library-4518/' },
]

await mkdir('.media-source', { recursive: true })
for (const source of sources) {
  const path = `.media-source/${source.name}.mp4`
  try { await access(path); console.log(`Using ${path}`); continue } catch { /* Download missing source. */ }
  const page = await fetch(source.page, { signal: AbortSignal.timeout(30000) })
  if (!page.ok) throw new Error(`Source page: ${page.status}`)
  const html = await page.text()
  if (!html.includes('videoFree')) throw new Error(`Check footage license: ${source.page}`)
  const url = html.match(/"contentUrl":"([^"]+)"/)?.[1]
  if (!url?.startsWith('https://assets.mixkit.co/')) throw new Error('Missing video asset URL')
  const response = await fetch(url, { signal: AbortSignal.timeout(90000) })
  if (!response.ok) throw new Error(`Video download: ${response.status}`)
  await writeFile(path, Buffer.from(await response.arrayBuffer()))
  await writeFile(`.media-source/${source.name}-source.json`, JSON.stringify({ ...source, url, license: 'https://mixkit.co/license/#videoFree' }, null, 2))
  console.log(`Downloaded ${path}`)
}
