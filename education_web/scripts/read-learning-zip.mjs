import { inflateRawSync } from 'node:zlib'

// Read the numbered JPG entries from a standard ZIP using Node's built-in tools.
// Names are restricted to flat ezgif filenames; archive paths are never extracted.
export function readLearningZip(zip) {
  let end = zip.length - 22
  const earliest = Math.max(0, end - 65535)
  while (end >= earliest && zip.readUInt32LE(end) !== 0x06054b50) end--
  if (end < earliest) throw new Error('Invalid ZIP directory')
  if (zip.readUInt16LE(end + 4) !== 0 || zip.readUInt16LE(end + 6) !== 0)
    throw new Error('Multi-part ZIP is unsupported')
  const count = zip.readUInt16LE(end + 10)
  let cursor = zip.readUInt32LE(end + 16)
  const frames = []
  for (let i = 0; i < count; i++) {
    if (zip.readUInt32LE(cursor) !== 0x02014b50) throw new Error('Invalid ZIP entry')
    const flags = zip.readUInt16LE(cursor + 8)
    const method = zip.readUInt16LE(cursor + 10)
    const size = zip.readUInt32LE(cursor + 20)
    const rawSize = zip.readUInt32LE(cursor + 24)
    const nameLength = zip.readUInt16LE(cursor + 28)
    const extraLength = zip.readUInt16LE(cursor + 30)
    const commentLength = zip.readUInt16LE(cursor + 32)
    const offset = zip.readUInt32LE(cursor + 42)
    const name = zip.toString('utf8', cursor + 46, cursor + 46 + nameLength)
    cursor += 46 + nameLength + extraLength + commentLength
    if (!/^ezgif-frame-\d{3}\.jpg$/.test(name)) continue
    if (flags & 1 || ![0, 8].includes(method) || rawSize > 20 * 1024 * 1024)
      throw new Error(`Unsupported JPG entry: ${name}`)
    if (zip.readUInt32LE(offset) !== 0x04034b50) throw new Error('Invalid local ZIP entry')
    const start = offset + 30 + zip.readUInt16LE(offset + 26) + zip.readUInt16LE(offset + 28)
    if (start + size > zip.length) throw new Error('Truncated ZIP')
    const compressed = zip.subarray(start, start + size)
    const bytes =
      method === 0 ? compressed : inflateRawSync(compressed, { maxOutputLength: rawSize })
    if (bytes.length !== rawSize) throw new Error(`Wrong frame size: ${name}`)
    frames.push({ name, bytes })
  }
  frames.sort((a, b) => a.name.localeCompare(b.name))
  if (frames.length < 2) throw new Error('The ZIP contains no numbered JPG sequence')
  frames.forEach((frame, index) => {
    if (frame.name !== `ezgif-frame-${String(index + 1).padStart(3, '0')}.jpg`)
      throw new Error('The JPG sequence has gaps or duplicates')
  })
  return frames
}
