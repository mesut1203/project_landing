import { useEffect, useRef, type ReactNode } from 'react'

/** Measure the static track so animated children never feed back into scroll progress. */
export function SectionTransition({
  children,
  opening = false,
}: {
  children: ReactNode
  opening?: boolean
}) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const track = ref.current
    if (!track) return
    const media = window.matchMedia('(prefers-reduced-motion: reduce)')
    let frame = 0

    const update = () => {
      frame = 0
      if (media.matches) {
        track.removeAttribute('data-motion')
        track.style.removeProperty('--scene-enter')
        track.style.removeProperty('--scene-exit')
        return
      }
      const { top, height } = track.getBoundingClientRect()
      const viewport = window.innerHeight
      const clamp = (value: number) => Math.min(1, Math.max(0, value))
      const enter = clamp((viewport - top) / (viewport * 0.72))
      // Keep long mobile heroes readable until their final viewport starts leaving.
      const exit = clamp((-top - Math.max(0, height - viewport)) / viewport)
      track.style.setProperty('--scene-enter', String(1 - (1 - enter) ** 2))
      track.style.setProperty('--scene-exit', String(exit))
      track.dataset.motion = 'true'
    }
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(update)
    }
    const observer = new ResizeObserver(schedule)
    // Content changes (filters, form summaries, fonts) can move later scenes.
    observer.observe(document.body)
    observer.observe(track)
    window.addEventListener('scroll', schedule, { passive: true })
    window.addEventListener('resize', schedule)
    media.addEventListener('change', schedule)
    update()
    return () => {
      cancelAnimationFrame(frame)
      observer.disconnect()
      window.removeEventListener('scroll', schedule)
      window.removeEventListener('resize', schedule)
      media.removeEventListener('change', schedule)
    }
  }, [])

  return (
    <div ref={ref} className="scene-track" data-opening={opening}>
      {children}
    </div>
  )
}
