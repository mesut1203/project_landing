import { useEffect, useImperativeHandle, useRef, useState } from 'react'
import type { Ref } from 'react'
import type { SequenceConfig } from '../data/content'
import { story } from '../data/content'
import { FrameBuffer } from '../lib/FrameBuffer'
import type { LoadStatus } from '../lib/FrameBuffer'

export interface FrameSequenceHandle { seek: (index: number) => void }
interface FrameSequenceProps {
  config: SequenceConfig
  ref?: Ref<FrameSequenceHandle>
  staticFrame?: boolean
  onFailure?: () => void
}

export function FrameSequence({ config, ref, staticFrame = false, onFailure }: FrameSequenceProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const bufferRef = useRef<FrameBuffer | null>(null)
  const targetRef = useRef(0)
  const drawRef = useRef<() => void>(() => {})
  const [status, setStatus] = useState<LoadStatus>('loading')
  const [painted, setPainted] = useState(false)
  const [posterFailed, setPosterFailed] = useState(false)
  const [retry, setRetry] = useState(0)
  const failureRef = useRef(onFailure)
  useEffect(() => { failureRef.current = onFailure }, [onFailure])

  useImperativeHandle(ref, () => ({ seek(index) {
    targetRef.current = index
    bufferRef.current?.request(index)
    drawRef.current()
  } }), [])

  useEffect(() => {
    if (!config.enabled || staticFrame) return
    const canvas = canvasRef.current
    const context = canvas?.getContext('2d', { alpha: false })
    if (!canvas || !context) return
    let disposed = false
    let raf = 0
    let lastDrawn = -1
    let firstPaint = true
    canvas.width = config.width
    canvas.height = config.height
    const paint = () => {
      raf = 0
      const nearest = buffer.nearest()
      if (!nearest || disposed) return
      if (nearest.index === lastDrawn) return
      // Draw at native resolution; the mobile presentation preserves the full source frame.
      context.drawImage(nearest.frame.source, 0, 0, config.width, config.height)
      canvas.dataset.frame = String(nearest.index)
      canvas.dataset.decoded = String(buffer.stats().decoded)
      lastDrawn = nearest.index
      if (firstPaint) { firstPaint = false; setPainted(true) }
    }
    const requestPaint = () => { if (!raf && !disposed) raf = requestAnimationFrame(paint) }
    const buffer = new FrameBuffer(config, {
      onFrame: requestPaint,
      onStatus: (next) => {
        if (disposed) return
        setStatus(next)
        if (next === 'error') failureRef.current?.()
      },
    })
    bufferRef.current = buffer
    drawRef.current = requestPaint
    setPainted(false)
    setStatus('loading')
    buffer.request(targetRef.current)
    const observer = new ResizeObserver(requestPaint)
    observer.observe(canvas)
    return () => {
      disposed = true
      cancelAnimationFrame(raf)
      observer.disconnect()
      buffer.dispose()
      bufferRef.current = null
      drawRef.current = () => {}
      context.clearRect(0, 0, canvas.width, canvas.height)
      canvas.width = 0
      canvas.height = 0
    }
  }, [config, staticFrame, retry])

  const poster = staticFrame ? config.finalPoster : config.poster
  const showFilm = painted && status !== 'error'
  return (
    <div className={`frame-sequence ${staticFrame || !config.enabled ? 'is-static' : ''}`} data-variant={config.id} data-status={status}>
      {posterFailed ? <div className="poster-empty" role="img" aria-label={config.alt}>{story.unavailableImage}</div> : (
        <img className="sequence-poster" src={poster} alt={config.alt} width={config.width} height={config.height}
          loading="eager" fetchPriority="high" decoding="async" style={{ opacity: showFilm ? 0 : 1 }}
          onError={(event) => {
            if (event.currentTarget.dataset.fallback === 'true' || poster === config.fallback) setPosterFailed(true)
            else { event.currentTarget.dataset.fallback = 'true'; event.currentTarget.src = config.fallback }
          }} />
      )}
      {config.enabled && !staticFrame && <canvas ref={canvasRef} className="sequence-canvas" width={config.width} height={config.height}
        aria-hidden="true" style={{ opacity: showFilm ? 1 : 0 }} />}
      {config.enabled && !staticFrame && <div className={`sequence-status ${status === 'ready' ? 'is-ready' : ''}`} role="status" aria-live="polite">
        {status === 'ready' ? null : status === 'error' ? <><span>{story.failure}</span><button type="button" onClick={() => setRetry((value) => value + 1)}>{story.retry}</button></> : (
          <><span className="loading-line" aria-hidden="true" /><span>{story.loading}</span></>
        )}
      </div>}
    </div>
  )
}
