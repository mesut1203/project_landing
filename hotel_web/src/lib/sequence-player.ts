export interface SequenceConfig { directory: string; prefix: string; extension: string; count: number; width: number; height: number; padding: number }
export type SequenceStatus = 'loading' | 'ready' | 'error'
type DecodedFrame = ImageBitmap | HTMLImageElement

/** A small, proximity-based decoded cache. Network bytes remain in the browser cache. */
export class SequencePlayer {
  private canvas: HTMLCanvasElement
  private config: SequenceConfig
  private onStatus: (status: SequenceStatus) => void
  private cache = new Map<number, DecodedFrame>()
  private pending = new Map<number, AbortController>()
  private failed = new Set<number>()
  private target = 1
  private destroyed = false
  private status: SequenceStatus = 'loading'
  private limit: number
  private observer: ResizeObserver

  constructor(canvas: HTMLCanvasElement, config: SequenceConfig, onStatus: (status: SequenceStatus) => void) {
    this.canvas = canvas; this.config = config; this.onStatus = onStatus
    this.limit = window.matchMedia('(max-width: 767px)').matches ? 18 : 30
    this.observer = new ResizeObserver(() => this.resize())
    this.observer.observe(canvas)
    this.resize()
    this.update(0)
  }

  update(progress: number) {
    if (this.destroyed) return
    this.target = Math.max(1, Math.min(this.config.count, Math.round(progress * (this.config.count - 1)) + 1))
    this.canvas.dataset.targetFrame = String(this.target)
    this.paint()
    this.pump()
  }

  private setStatus(value: SequenceStatus) {
    if (value !== this.status) { this.status = value; this.onStatus(value) }
  }

  private resize() {
    const bounds = this.canvas.getBoundingClientRect()
    const dpr = Math.min(window.devicePixelRatio || 1, 1.5)
    this.canvas.width = Math.round(bounds.width * dpr)
    this.canvas.height = Math.round(bounds.height * dpr)
    this.paint()
  }

  private paint() {
    if (this.destroyed) return
    const nearest = [...this.cache.keys()].sort((a, b) => Math.abs(a - this.target) - Math.abs(b - this.target))[0]
    if (nearest === undefined || (this.failed.has(this.target) && Math.abs(nearest - this.target) > 8)) {
      this.setStatus(this.failed.has(this.target) ? 'error' : 'loading')
      return
    }
    const image = this.cache.get(nearest)!
    const ctx = this.canvas.getContext('2d', { alpha: false })
    if (!ctx || !this.canvas.width || !this.canvas.height) return
    const { width, height } = this.canvas
    const ratio = Math.max(width / this.config.width, height / this.config.height)
    const w = this.config.width * ratio, h = this.config.height * ratio
    ctx.drawImage(image, (width - w) / 2, (height - h) / 2, w, h)
    this.canvas.dataset.frame = String(nearest)
    this.canvas.dataset.cacheSize = String(this.cache.size)
    this.setStatus('ready')
  }

  private pump() {
    if (this.destroyed) return
    const candidates = [this.target]
    // Keep the initial page light. Begin neighbouring-frame prefetch on actual scroll.
    const radius = this.target === 1 ? 0 : 8
    for (let distance = 1; distance <= radius; distance++) candidates.push(this.target + distance, this.target - distance)
    for (const index of candidates) {
      if (this.pending.size >= 4) break
      if (index < 1 || index > this.config.count || this.cache.has(index) || this.pending.has(index) || this.failed.has(index)) continue
      void this.load(index)
    }
  }

  private async load(index: number) {
    const controller = new AbortController()
    this.pending.set(index, controller)
    const timeout = window.setTimeout(() => controller.abort(), 10000)
    try {
      const { directory, prefix, padding, extension } = this.config
      const response = await fetch(`${directory}/${prefix}${String(index).padStart(padding, '0')}${extension}`, { signal: controller.signal, cache: 'force-cache' })
      if (!response.ok) throw new Error('Frame unavailable')
      const blob = await response.blob()
      let decoded: DecodedFrame
      if (typeof createImageBitmap === 'function') decoded = await createImageBitmap(blob)
      else {
        const image = new Image()
        const url = URL.createObjectURL(blob)
        try { image.src = url; await image.decode(); decoded = image } finally { URL.revokeObjectURL(url) }
      }
      if (this.destroyed) { if ('close' in decoded) decoded.close(); return }
      this.cache.set(index, decoded)
      while (this.cache.size > this.limit) {
        const farthest = [...this.cache.keys()].sort((a, b) => Math.abs(b - this.target) - Math.abs(a - this.target))[0]
        const old = this.cache.get(farthest)!
        if ('close' in old) old.close()
        this.cache.delete(farthest)
      }
    } catch {
      if (!this.destroyed) this.failed.add(index)
    } finally {
      window.clearTimeout(timeout)
      this.pending.delete(index)
      if (!this.destroyed) { this.paint(); this.pump() }
    }
  }

  destroy() {
    this.destroyed = true
    this.observer.disconnect()
    this.pending.forEach((controller) => controller.abort())
    this.cache.forEach((frame) => { if ('close' in frame) frame.close() })
    this.pending.clear(); this.cache.clear()
  }
}
