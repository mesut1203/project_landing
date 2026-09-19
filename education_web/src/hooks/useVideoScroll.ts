import { useCallback, useEffect, useRef, useState } from 'react'
import { useReducedMotion } from './useReducedMotion'

export function useVideoScroll(source: string, chapterStarts: number[], frameRate: number) {
  const trackRef = useRef<HTMLDivElement>(null)
  const stageRef = useRef<HTMLDivElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const reduced = useReducedMotion()
  const [step, setStep] = useState(0)
  const [unavailable, setUnavailable] = useState(false)
  const [painted, setPainted] = useState(false)

  useEffect(() => {
    const track = trackRef.current
    const stage = stageRef.current
    const video = videoRef.current
    if (reduced || unavailable || !track || !stage || !video) return

    const controller = new AbortController()
    const coarse = window.matchMedia('(pointer: coarse)').matches
    let disposed = false
    let loading = false
    let ready = false
    let priming = false
    let primed = false
    let gesture = false
    let objectUrl: string | undefined
    let raf = 0
    let paintRaf = 0
    let frameCallback: number | undefined
    let loadTimer: ReturnType<typeof setTimeout> | undefined
    let seekTimer: ReturnType<typeof setTimeout> | undefined
    let target = 0
    let progress = 0
    let previousTime = 0
    let width = window.innerWidth

    setPainted(false)
    video.muted = true

    const fail = () => {
      if (!disposed) setUnavailable(true)
    }
    const showFrame = () => {
      if (disposed || video.readyState < 2) return
      clearTimeout(loadTimer)
      setPainted(true)
    }
    const waitForFrame = () => {
      if (disposed || video.readyState < 2) return
      if (typeof video.requestVideoFrameCallback === 'function') {
        if (frameCallback !== undefined) video.cancelVideoFrameCallback(frameCallback)
        frameCallback = video.requestVideoFrameCallback(() => {
          frameCallback = undefined
          showFrame()
        })
      } else {
        cancelAnimationFrame(paintRaf)
        paintRaf = requestAnimationFrame(showFrame)
      }
    }
    const seek = () => {
      if (!ready || priming || video.seeking) return
      // Stop on the last decodable frame, rather than seeking past the end.
      const time = progress * Math.max(0, video.duration - 1 / frameRate)
      if (Math.abs(video.currentTime - time) < 0.012) return
      try {
        video.currentTime = time
        clearTimeout(seekTimer)
        seekTimer = setTimeout(fail, 5000)
      } catch {
        fail()
      }
    }
    const tick = (time: number) => {
      raf = 0
      if (disposed) return
      const dt = previousTime ? Math.min(time - previousTime, 64) : 16
      previousTime = time
      progress += (target - progress) * (1 - Math.exp(-dt / 85))
      if (Math.abs(target - progress) < 0.0005) progress = target
      stage.style.setProperty('--world-progress', String(progress))
      setStep(
        Math.max(
          0,
          chapterStarts.findLastIndex((start) => progress >= start),
        ),
      )
      chapterStarts.forEach((start, index) => {
        const end = chapterStarts[index + 1] ?? 1
        stage.style.setProperty(
          `--chapter-${index}`,
          String(Math.max(0, Math.min(1, (progress - start) / (end - start)))),
        )
      })
      seek()
      if (progress !== target) raf = requestAnimationFrame(tick)
      else previousTime = 0
    }
    const schedule = () => {
      if (!disposed && !raf) raf = requestAnimationFrame(tick)
    }
    const onSeeked = () => {
      clearTimeout(seekTimer)
      waitForFrame()
      // A fast flick may change the target while the previous seek is pending.
      schedule()
    }
    const prime = () => {
      if (!coarse || !gesture || !ready || primed || priming) return
      priming = true
      void video
        .play()
        .then(() => {
          video.pause()
          if (disposed) return
          priming = false
          primed = true
          waitForFrame()
          schedule()
        })
        .catch(() => {
          priming = false
          // Keep the poster and allow the next gesture to retry on iOS.
        })
    }
    const onGesture = () => {
      gesture = true
      prime()
    }
    const onMetadata = () => {
      if (!Number.isFinite(video.duration) || video.duration <= 0) {
        fail()
        return
      }
      ready = true
      prime()
      schedule()
    }
    const onLoadedData = () => {
      waitForFrame()
      prime()
      schedule()
    }
    const load = async () => {
      if (loading || disposed) return
      loading = true
      loadTimer = setTimeout(fail, 15000)
      try {
        const response = await fetch(source, { signal: controller.signal })
        if (!response.ok) throw new Error('Video could not be loaded')
        const blob = await response.blob()
        if (disposed) return
        // Blob media remains seekable on hosts without HTTP Range support.
        objectUrl = URL.createObjectURL(blob)
        video.src = objectUrl
        video.load()
      } catch {
        if (!controller.signal.aborted) fail()
      }
    }
    const update = () => {
      const rect = track.getBoundingClientRect()
      const top = parseFloat(getComputedStyle(stage).top) || 0
      const distance = track.offsetHeight - stage.offsetHeight
      if (distance <= 0) return
      target = Math.max(0, Math.min(1, (top - rect.top) / distance))
      if (rect.top < window.innerHeight * 2 && rect.bottom > -window.innerHeight) void load()
      schedule()
    }
    const onResize = () => {
      if (coarse && width === window.innerWidth) return
      width = window.innerWidth
      update()
    }

    video.addEventListener('loadedmetadata', onMetadata)
    video.addEventListener('loadeddata', onLoadedData)
    video.addEventListener('seeked', onSeeked)
    video.addEventListener('error', fail)
    window.addEventListener('scroll', update, { passive: true })
    window.addEventListener('resize', onResize)
    window.addEventListener('pointerdown', onGesture, { passive: true })
    window.addEventListener('touchstart', onGesture, { passive: true })
    const observer = typeof ResizeObserver === 'undefined' ? null : new ResizeObserver(update)
    observer?.observe(track)
    observer?.observe(stage)
    update()

    return () => {
      disposed = true
      controller.abort()
      cancelAnimationFrame(raf)
      cancelAnimationFrame(paintRaf)
      clearTimeout(loadTimer)
      clearTimeout(seekTimer)
      if (frameCallback !== undefined) video.cancelVideoFrameCallback(frameCallback)
      observer?.disconnect()
      video.removeEventListener('loadedmetadata', onMetadata)
      video.removeEventListener('loadeddata', onLoadedData)
      video.removeEventListener('seeked', onSeeked)
      video.removeEventListener('error', fail)
      window.removeEventListener('scroll', update)
      window.removeEventListener('resize', onResize)
      window.removeEventListener('pointerdown', onGesture)
      window.removeEventListener('touchstart', onGesture)
      video.pause()
      video.removeAttribute('src')
      video.load()
      if (objectUrl) URL.revokeObjectURL(objectUrl)
    }
  }, [source, reduced, unavailable, chapterStarts, frameRate])

  const goToChapter = useCallback(
    (index: number) => {
      const track = trackRef.current
      const stage = stageRef.current
      if (!track || !stage || chapterStarts[index] === undefined) return
      const inset = parseFloat(getComputedStyle(stage).top) || 0
      const distance = track.offsetHeight - stage.offsetHeight
      const position = Math.min(1, chapterStarts[index] + 0.002)
      window.scrollTo({
        top: track.getBoundingClientRect().top + window.scrollY - inset + distance * position,
        behavior: reduced ? 'auto' : 'smooth',
      })
    },
    [chapterStarts, reduced],
  )

  return {
    trackRef,
    stageRef,
    videoRef,
    step,
    painted,
    goToChapter,
    staticMode: reduced || unavailable,
  }
}
