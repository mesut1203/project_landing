import { useEffect, useId, useRef, useState } from 'react'

export function HeroCoffee() {
  const sceneRef = useRef<HTMLDivElement>(null)
  const [active, setActive] = useState(true)
  const id = useId()

  useEffect(() => {
    const scene = sceneRef.current
    if (!scene) return

    let inView = true
    const updateActivity = () => setActive(inView && !document.hidden)
    const observer = new IntersectionObserver(([entry]) => {
      inView = entry.isIntersecting
      updateActivity()
    })

    observer.observe(scene)
    document.addEventListener('visibilitychange', updateActivity)
    updateActivity()

    return () => {
      observer.disconnect()
      document.removeEventListener('visibilitychange', updateActivity)
    }
  }, [])

  return (
    <div
      className="hero-scene"
      id="hero-scene"
      ref={sceneRef}
      data-paused={!active}
    >
      <div className="hero-photo">
        {/* Keep the photo and effects in one coordinate system as the camera moves. */}
        <svg
          className="coffee-scene"
          viewBox="0 0 1200 1800"
          preserveAspectRatio="xMidYMid slice"
          role="img"
          aria-labelledby={`${id}-title`}
        >
          <title id={`${id}-title`}>
            Tách cà phê với lớp bọt sữa hình lá trên bàn gỗ và hơi nóng bay lên
          </title>
          <defs>
            <linearGradient id={`${id}-steam`} x1="0" y1="1" x2="0" y2="0">
              <stop offset="0" stopColor="#fff2df" stopOpacity="0" />
              <stop offset="0.35" stopColor="#fff2df" stopOpacity="0.7" />
              <stop offset="0.7" stopColor="#fff2df" stopOpacity="0.3" />
              <stop offset="1" stopColor="#fff2df" stopOpacity="0" />
            </linearGradient>
            <filter id={`${id}-soft`} x="-60%" y="-30%" width="220%" height="160%">
              <feGaussianBlur stdDeviation="4" />
            </filter>
            <clipPath id={`${id}-surface`}>
              <ellipse cx="599" cy="864" rx="133" ry="139" />
            </clipPath>
          </defs>

          <image id={`${id}-photo`} href="/images/hero-coffee.webp" width="1200" height="1800" />

          <g clipPath={`url(#${id}-surface)`}>
            <use className="coffee-surface-motion" href={`#${id}-photo`} />
          </g>

          <g
            className="coffee-steam"
            fill="none"
            stroke={`url(#${id}-steam)`}
            strokeWidth="14"
            strokeLinecap="round"
            filter={`url(#${id}-soft)`}
          >
            <path className="coffee-wisp" d="M540 830 C502 774 579 752 548 691 S515 620 553 565" />
            <path className="coffee-wisp coffee-wisp-two" d="M605 843 C645 791 558 743 593 691 S628 615 593 558" />
            <path className="coffee-wisp coffee-wisp-three" d="M680 853 C718 800 644 764 677 710 S702 649 680 601" />
          </g>
        </svg>
      </div>
      <div className="hero-atmosphere" aria-hidden="true">
        <div className="hero-light hero-light-one" />
        <div className="hero-light hero-light-two" />
        <span className="hero-mote hero-mote-one" />
        <span className="hero-mote hero-mote-two" />
        <span className="hero-mote hero-mote-three" />
        <span className="hero-mote hero-mote-four" />
        <span className="hero-mote hero-mote-five" />
      </div>
    </div>
  )
}
