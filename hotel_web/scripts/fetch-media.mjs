import { mkdir, writeFile } from 'node:fs/promises'
import { photoSources } from '../src/data/content.ts'

await mkdir(new URL('../public/media/', import.meta.url), { recursive: true })
const results = await Promise.allSettled(photoSources.map(async ({ file, url }) => {
  const response = await fetch(url, { signal: AbortSignal.timeout(25000) })
  if (!response.ok || !response.headers.get('content-type')?.startsWith('image/')) throw new Error(`${file}: ${response.status}`)
  const buffer = Buffer.from(await response.arrayBuffer())
  await writeFile(new URL(`../public/media/${file}`, import.meta.url), buffer)
  console.log(`${file}: ${buffer.length} bytes`)
}))
for (const result of results) if (result.status === 'rejected') { console.error(result.reason); process.exitCode = 1 }
