import { useEffect, useRef, useState } from 'react'
import { Arrow } from './Icon'

const chapters = [
  {
    label: 'Khởi hành',
    eyebrow: 'VIETNAM, AT YOUR OWN PACE',
    title: 'Đi xa hơn.',
    emphasis: 'Sống chậm lại.',
    body: 'Theo một con đường nhỏ, tìm một vùng trời rộng. Một Việt Nam rất khác đang chờ bạn.',
    start: 0,
  },
  {
    label: 'Khám phá',
    eyebrow: '02 — ĐI THEO SỰ TÒ MÒ',
    title: 'Lạc một chút.',
    emphasis: 'Thấy nhiều hơn.',
    body: 'Để những ngã rẽ dẫn lối. Để một cuộc gặp không hẹn trước trở thành điều bạn nhớ nhất.',
    start: 0.4,
  },
  {
    label: 'Tận hưởng',
    eyebrow: '03 — DÀNH THỜI GIAN CHO MÌNH',
    title: 'Ngày dài hơn.',
    emphasis: 'Lòng nhẹ hơn.',
    body: 'Khi nắng tắt sau dãy núi, chẳng cần đi đâu nữa. Chỉ cần có mặt, ở đây, lúc này.',
    start: 0.79,
  },
]

/** Pinned, coalesced blob scrubbing adapted from scroll-world to the supplied sequence. */
export function Hero() {
  const trackRef = useRef<HTMLElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const progressRef = useRef<HTMLSpanElement>(null)
  const pausedRef = useRef(false)
  const [chapter, setChapter] = useState(0)
  const [reduced, setReduced] = useState(
    () => matchMedia('(prefers-reduced-motion: reduce)').matches,
  )
  const [paused, setPaused] = useState(false)
  const [painted, setPainted] = useState(false)
  const [failed, setFailed] = useState(false)

  useEffect(() => {
    const media = matchMedia('(prefers-reduced-motion: reduce)')
    const change = () => setReduced(media.matches)
    media.addEventListener('change', change)
    return () => media.removeEventListener('change', change)
  }, [])

  useEffect(() => {
    const track = trackRef.current
    const video = videoRef.current
    if (!track || !video || reduced) {
      setPainted(false)
      setChapter(0)
      return
    }
    const abort = new AbortController()
    let disposed = false
    let objectUrl = ''
    let raf = 0
    let target = 0
    let smooth = 0
    let primed = false
    const draw = () => {
      raf = 0
      if (disposed || document.hidden) return
      smooth += (target - smooth) * 0.2
      if (Math.abs(target - smooth) < 0.0006) smooth = target
      progressRef.current?.style.setProperty('transform', `scaleX(${smooth})`)
      setChapter(smooth >= 0.79 ? 2 : smooth >= 0.4 ? 1 : 0)
      if (
        !pausedRef.current &&
        video.readyState >= 2 &&
        Number.isFinite(video.duration) &&
        !video.seeking
      ) {
        const time = smooth * Math.max(0, video.duration - 0.1)
        if (Math.abs(video.currentTime - time) > 0.025) video.currentTime = time
      }
      if (smooth !== target) schedule()
    }
    const schedule = () => {
      if (!raf && !disposed) raf = requestAnimationFrame(draw)
    }
    const measure = () => {
      const rect = track.getBoundingClientRect()
      const stageHeight =
        track.querySelector('.world-stage')?.clientHeight ?? innerHeight
      target = Math.min(
        1,
        Math.max(0, -rect.top / Math.max(1, rect.height - stageHeight)),
      )
      schedule()
    }
    const seeked = () => {
      if (!disposed) setPainted(true)
      schedule()
    }
    const error = () => {
      if (!disposed) {
        setFailed(true)
        setPainted(false)
      }
    }
    // Prime Safari's decoder on a real user gesture; keep the poster until a frame paints.
    const prime = () => {
      if (primed || video.readyState < 2 || pausedRef.current) return
      primed = true
      void video
        .play()
        .then(() => {
          video.pause()
          schedule()
        })
        .catch(() => {
          primed = false
        })
    }
    video.addEventListener('loadeddata', schedule)
    video.addEventListener('seeked', seeked)
    video.addEventListener('error', error)
    window.addEventListener('pointerdown', prime, { passive: true })
    window.addEventListener('touchstart', prime, { passive: true })
    window.addEventListener('scroll', measure, { passive: true })
    window.addEventListener('resize', measure)
    document.addEventListener('visibilitychange', measure)
    setFailed(false)
    fetch('/videos/travel-scroll.mp4', { signal: abort.signal })
      .then((response) => {
        if (!response.ok) throw new Error('Media unavailable')
        return response.blob()
      })
      .then((blob) => {
        if (disposed) return
        objectUrl = URL.createObjectURL(blob)
        video.src = objectUrl
        video.load()
      })
      .catch(() => {
        if (!disposed) error()
      })
    measure()
    return () => {
      disposed = true
      abort.abort()
      cancelAnimationFrame(raf)
      video.pause()
      video.removeEventListener('loadeddata', schedule)
      video.removeEventListener('seeked', seeked)
      video.removeEventListener('error', error)
      video.removeAttribute('src')
      video.load()
      if (objectUrl) URL.revokeObjectURL(objectUrl)
      window.removeEventListener('pointerdown', prime)
      window.removeEventListener('touchstart', prime)
      window.removeEventListener('scroll', measure)
      window.removeEventListener('resize', measure)
      document.removeEventListener('visibilitychange', measure)
    }
  }, [reduced])

  const jump = (index: number) => {
    const track = trackRef.current
    if (!track) return
    const height =
      track.querySelector('.world-stage')?.clientHeight ?? innerHeight
    window.scrollTo({
      top:
        track.offsetTop +
        (track.offsetHeight - height) *
          (chapters[index].start + (index ? 0.015 : 0)),
      behavior: reduced ? 'instant' : 'smooth',
    })
  }
  const toggle = () => {
    pausedRef.current = !pausedRef.current
    setPaused(pausedRef.current)
    window.dispatchEvent(new Event('scroll'))
  }
  const scene = chapters[chapter]
  return (
    <section
      id="top"
      ref={trackRef}
      className="world-track"
      data-reduced={reduced}
      aria-labelledby="hero-heading"
    >
      <div className="world-stage">
        <img
          className="world-poster"
          src="/assets/journey/ezgif-frame-001.jpg"
          alt=""
          width="1280"
          height="720"
          fetchPriority="high"
        />
        <video
          ref={videoRef}
          className="hero-video world-film"
          data-painted={painted && !reduced}
          muted
          playsInline
          preload="none"
          aria-hidden="true"
        />
        <div className="world-shade" />
        <div className="shell world-layout">
          <div className="world-copy">
            <p className="eyebrow world-eyebrow">
              <span />
              {scene.eyebrow}
            </p>
            <h1 id="hero-heading" tabIndex={-1}>
              {scene.title}
              <br />
              <em>{scene.emphasis}</em>
            </h1>
            <p className="world-description">{scene.body}</p>
            <a
              className="world-cta"
              href={chapter === 2 ? '#plan-trip' : '#destinations'}
            >
              {chapter === 2
                ? 'Viết hành trình của bạn'
                : 'Tìm hành trình của bạn'}
              <span>
                <Arrow diagonal />
              </span>
            </a>
          </div>
          <div className="world-side-note" aria-hidden="true">
            THE ART OF GETTING LOST — VIETNAM
          </div>
        </div>
        <div className="shell world-bottom">
          <a className="world-scroll-hint" href="#our-story">
            <span>↓</span>
            <span>
              {reduced ? 'KHÁM PHÁ NOMAD' : 'CUỘN ĐỂ KHÁM PHÁ'}
              <small>Mỗi nhịp cuộn, một khoảng trời.</small>
            </span>
          </a>
          {!reduced && (
            <nav className="world-chapters" aria-label="Các chặng hành trình">
              {chapters.map((item, index) => (
                <button
                  key={item.label}
                  onClick={() => jump(index)}
                  aria-current={chapter === index ? 'step' : undefined}
                >
                  <span>0{index + 1}</span>
                  {item.label}
                </button>
              ))}
            </nav>
          )}
          {!reduced && (
            <button
              className="world-motion"
              onClick={toggle}
              aria-label={
                paused ? 'Bật chuyển động theo cuộn' : 'Tạm dừng chuyển động'
              }
              aria-pressed={paused}
            >
              {paused ? '▷' : 'Ⅱ'}
              <span>{paused ? 'Tiếp tục' : 'Tạm dừng'}</span>
            </button>
          )}
        </div>
        {failed && (
          <p className="world-media-status" role="status">
            Đang hiển thị ảnh tĩnh. Bạn vẫn có thể khám phá các hành trình bên
            dưới.
          </p>
        )}
        <div className="world-progress" aria-hidden="true">
          <span ref={progressRef} />
        </div>
      </div>
    </section>
  )
}
