import {
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
} from 'react'
export function Reveal({
  children,
  className = '',
  delay = 0,
  stagger = false,
}: {
  children: ReactNode
  className?: string
  delay?: number
  stagger?: boolean
}) {
  const ref = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(true)
  const [entered, setEntered] = useState(false)
  useEffect(() => {
    const element = ref.current
    const media = window.matchMedia('(prefers-reduced-motion: reduce)')
    if (!element || media.matches || !('IntersectionObserver' in window)) return
    if (element.getBoundingClientRect().top < window.innerHeight) {
      setEntered(true)
      return
    }
    setVisible(false)
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setVisible(true)
          setEntered(true)
          observer.disconnect()
        }
      },
      { threshold: 0.08 },
    )
    const onMotionChange = () => {
      if (media.matches) {
        setVisible(true)
        observer.disconnect()
      }
    }
    media.addEventListener('change', onMotionChange)
    observer.observe(element)
    return () => {
      observer.disconnect()
      media.removeEventListener('change', onMotionChange)
    }
  }, [])
  return (
    <div
      ref={ref}
      className={`reveal motion-reveal ${stagger ? 'reveal-stagger' : ''} ${className}`}
      data-visible={visible}
      data-entered={entered}
      style={{ '--reveal-delay': `${delay}ms` } as CSSProperties}
      onFocusCapture={() => {
        setVisible(true)
        setEntered(true)
      }}
    >
      {children}
    </div>
  )
}
