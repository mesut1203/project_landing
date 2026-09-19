import { useCallback, useEffect, useRef, useState } from 'react'
import { ArrowRightIcon } from '@radix-ui/react-icons'
import { content } from '../data/content'
import { ResponsiveImage } from './ResponsiveImage'

interface VideoIntroProps { src: string; onReveal: () => void; onComplete: () => void }

export function VideoIntro({ src, onReveal, onComplete }: VideoIntroProps) {
  const video = useRef<HTMLVideoElement>(null)
  const skip = useRef<HTMLButtonElement>(null)
  const done = useRef(false)
  const lastTime = useRef(0)
  const timeout = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)
  const endTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)
  const [exiting, setExiting] = useState(false)
  const [playing, setPlaying] = useState(false)

  const finish = useCallback(() => {
    if (done.current) return
    done.current = true
    clearTimeout(timeout.current)
    video.current?.pause()
    setExiting(true)
    onReveal()
    endTimer.current = setTimeout(onComplete, content.intro.fadeMs)
  }, [onReveal, onComplete])

  const armTimeout = useCallback(() => {
    // Repeated waiting/stalled events must not postpone the initial deadline.
    if (timeout.current !== undefined) return
    timeout.current = setTimeout(finish, content.intro.timeoutMs)
  }, [finish])

  useEffect(() => {
    let alive = true
    done.current = false
    const overflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    skip.current?.focus({ preventScroll: true })
    armTimeout()
    const maximum = setTimeout(finish, (content.story.duration + 5) * 1000)
    const element = video.current
    element?.play().catch(() => { if (alive) finish() })
    return () => {
      alive = false
      clearTimeout(timeout.current)
      timeout.current = undefined
      clearTimeout(endTimer.current)
      clearTimeout(maximum)
      document.body.style.overflow = overflow
      element?.pause()
    }
  }, [src, armTimeout, finish])

  return <div className={`video-intro ${exiting ? 'is-exiting' : ''}`} role="dialog" aria-modal="true"
    aria-labelledby="intro-title" onKeyDown={event => {
      if (event.key === 'Escape') finish()
      if (event.key === 'Tab') { event.preventDefault(); skip.current?.focus() }
    }}>
    <h2 id="intro-title" className="sr-only">{content.intro.title}</h2>
    <ResponsiveImage image={content.story.scenes[0].image} className="intro-poster" eager />
    <video ref={video} src={src} autoPlay muted playsInline preload="auto" className={`intro-video ${playing ? 'is-playing' : ''}`}
      aria-hidden="true" disablePictureInPicture onEnded={finish} onError={finish} onWaiting={armTimeout} onStalled={armTimeout}
      onPlaying={() => { setPlaying(true); clearTimeout(timeout.current); timeout.current = undefined }}
      onTimeUpdate={() => {
        const time = video.current?.currentTime ?? 0
        if (time > lastTime.current + 0.02) { clearTimeout(timeout.current); timeout.current = undefined }
        lastTime.current = time
      }} />
    {!playing && <p className="intro-loading" role="status">{content.intro.loading}</p>}
    <button ref={skip} className="intro-skip button" onClick={finish}>{content.actions.skipIntro}<ArrowRightIcon /></button>
  </div>
}
