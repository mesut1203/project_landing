import { useEffect, useRef, useState } from 'react'
import type { MotionValue } from 'motion/react'

interface ScrubVideoOptions { src: string; enabled: boolean; progress: MotionValue<number>; timeoutMs?: number }

export function useScrubVideo({ src, enabled, progress, timeoutMs = 8000 }: ScrubVideoOptions) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [state, setState] = useState<'poster' | 'loading' | 'ready' | 'error'>('poster')

  useEffect(() => {
    const video = videoRef.current
    if (!enabled || !video) return
    const controller = new AbortController()
    let objectUrl: string | undefined
    let frame = 0
    let alive = true
    let painted = false
    let pending = progress.get()
    setState('loading')
    const deadline = setTimeout(() => { controller.abort(); if (alive) setState('error') }, timeoutMs)

    const seek = () => {
      frame = 0
      if (!alive || video.readyState < 2 || video.seeking || !Number.isFinite(video.duration)) return
      const target = Math.min(Math.max(pending, 0), 1) * Math.max(0, video.duration - 0.04)
      if (Math.abs(video.currentTime - target) > 0.018) video.currentTime = target
    }
    const schedule = () => { if (!frame) frame = requestAnimationFrame(seek) }
    const show = () => {
      if (!alive) return
      if (!painted) { painted = true; clearTimeout(deadline); setState('ready') }
      schedule()
    }
    const ready = () => { video.pause(); show() }
    const error = () => { clearTimeout(deadline); if (alive) setState('error') }
    const prime = () => {
      if (!alive || !video.src || video.readyState < 2) return
      video.play().then(() => { if (alive) { video.pause(); schedule() } }).catch(() => {})
    }
    video.addEventListener('loadeddata', ready)
    video.addEventListener('seeked', show)
    video.addEventListener('error', error)
    window.addEventListener('pointerdown', prime, { once: true, passive: true })
    const unsubscribe = progress.on('change', value => { pending = value; schedule() })

    fetch(src, { signal: controller.signal }).then(response => {
      if (!response.ok || !response.headers.get('content-type')?.includes('video')) throw new Error('Missing film')
      return response.blob()
    }).then(blob => {
      if (!alive) return
      objectUrl = URL.createObjectURL(blob)
      video.src = objectUrl
      video.load()
    }).catch(() => { if (alive) { clearTimeout(deadline); setState('error') } })

    return () => {
      alive = false
      controller.abort()
      clearTimeout(deadline)
      cancelAnimationFrame(frame)
      unsubscribe()
      video.removeEventListener('loadeddata', ready)
      video.removeEventListener('seeked', show)
      video.removeEventListener('error', error)
      window.removeEventListener('pointerdown', prime)
      video.pause()
      video.removeAttribute('src')
      video.load()
      if (objectUrl) URL.revokeObjectURL(objectUrl)
    }
  }, [src, enabled, progress, timeoutMs])

  return { videoRef, state }
}
