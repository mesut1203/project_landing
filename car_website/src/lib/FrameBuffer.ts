import type { SequenceConfig } from '../data/content'
import { clamp, frameUrl } from './frameMath'

export type LoadStatus = 'loading' | 'ready' | 'error'
export interface DecodedFrame {
  source: CanvasImageSource
  width: number
  height: number
  close: () => void
}
interface BufferCallbacks {
  onFrame: () => void
  onStatus: (status: LoadStatus) => void
}

async function decode(blob: Blob): Promise<DecodedFrame> {
  if (typeof createImageBitmap === 'function') {
    const bitmap = await createImageBitmap(blob)
    return { source: bitmap, width: bitmap.width, height: bitmap.height, close: () => bitmap.close() }
  }
  const url = URL.createObjectURL(blob)
  const image = new Image()
  try {
    image.src = url
    await image.decode()
    return { source: image, width: image.naturalWidth, height: image.naturalHeight, close: () => { image.src = '' } }
  } finally { URL.revokeObjectURL(url) }
}

/** Bounded decoded memory, cancellable fetches, and no whole-film preload. */
export class FrameBuffer {
  private frames = new Map<number, DecodedFrame>()
  private requests = new Map<number, AbortController>()
  private failures = new Map<number, number>()
  private target = 0
  private direction = 1
  private disposed = false
  private lastStatus: LoadStatus | null = null

  constructor(private config: SequenceConfig, private callbacks: BufferCallbacks) {}

  request(index: number): void {
    if (this.disposed) return
    const next = Math.round(clamp(index, 0, this.config.frameCount - 1))
    if (next !== this.target) this.direction = next > this.target ? 1 : -1
    this.target = next
    const wanted = new Set(this.neighborhood())
    for (const [frame, controller] of this.requests) {
      if (!wanted.has(frame)) controller.abort()
    }
    this.evict()
    this.report()
    this.pump()
  }

  nearest(): { index: number; frame: DecodedFrame } | null {
    let best: { index: number; frame: DecodedFrame } | null = null
    for (const [index, frame] of this.frames) {
      if (!best || Math.abs(index - this.target) < Math.abs(best.index - this.target)) best = { index, frame }
    }
    return best
  }

  stats(): { decoded: number; pending: number; target: number; disposed: boolean } {
    return { decoded: this.frames.size, pending: this.requests.size, target: this.target, disposed: this.disposed }
  }

  dispose(): void {
    this.disposed = true
    for (const request of this.requests.values()) request.abort()
    this.requests.clear()
    for (const frame of this.frames.values()) frame.close()
    this.frames.clear()
    this.failures.clear()
  }

  private neighborhood(): number[] {
    const result = [this.target]
    for (let distance = 1; distance <= Math.max(this.config.ahead, this.config.behind); distance++) {
      if (distance <= this.config.ahead) result.push(this.target + distance * this.direction)
      if (distance <= this.config.behind) result.push(this.target - distance * this.direction)
    }
    return result.filter((frame) => frame >= 0 && frame < this.config.frameCount)
  }

  private evict(): void {
    const sorted = [...this.frames.keys()].sort((a, b) => Math.abs(a - this.target) - Math.abs(b - this.target))
    for (const index of sorted.slice(this.config.maxDecoded)) {
      this.frames.get(index)?.close()
      this.frames.delete(index)
    }
  }

  private report(): void {
    if (this.disposed) return
    const nearest = this.nearest()
    const status: LoadStatus = nearest && Math.abs(nearest.index - this.target) <= 2 ? 'ready'
      : (this.failures.get(this.target) ?? 0) >= 2 ? 'error' : 'loading'
    if (status !== this.lastStatus) { this.lastStatus = status; this.callbacks.onStatus(status) }
  }

  private pump(): void {
    if (this.disposed) return
    for (const index of this.neighborhood()) {
      if (this.requests.size >= this.config.concurrency) break
      if (this.frames.has(index) || this.requests.has(index) || (this.failures.get(index) ?? 0) >= 2) continue
      const controller = new AbortController()
      this.requests.set(index, controller)
      void this.load(index, controller)
    }
  }

  private async load(index: number, controller: AbortController): Promise<void> {
    const timeout = window.setTimeout(() => controller.abort(new DOMException('Frame request timed out', 'TimeoutError')), 10000)
    let frame: DecodedFrame | undefined
    try {
      const response = await fetch(frameUrl(this.config, index), { signal: controller.signal })
      if (!response.ok) throw new Error(`Frame response ${response.status}`)
      frame = await decode(await response.blob())
      if (this.disposed || controller.signal.aborted) { frame.close(); return }
      this.frames.set(index, frame)
      this.evict()
      this.callbacks.onFrame()
    } catch {
      if (!this.disposed && (!controller.signal.aborted || controller.signal.reason?.name === 'TimeoutError')) {
        this.failures.set(index, (this.failures.get(index) ?? 0) + 1)
      }
    } finally {
      window.clearTimeout(timeout)
      this.requests.delete(index)
      if (!this.disposed) { this.report(); this.pump() }
    }
  }
}
