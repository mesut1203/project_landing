import { useEffect, useRef, useState, type ReactNode } from 'react'
export function Reveal({
  children,
  className = '',
}: {
  children: ReactNode
  className?: string
}) {
  const ref = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(true)
  useEffect(() => {
    const element = ref.current
    const media = window.matchMedia('(prefers-reduced-motion: reduce)')
    if (!element || media.matches || !('IntersectionObserver' in window)) return
    if (element.getBoundingClientRect().top < window.innerHeight) {
      return
    }
    setVisible(false)
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setVisible(true)
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
      className={`reveal ${className}`}
      data-visible={visible}
      onFocusCapture={() => {
        setVisible(true)
      }}
    >
      {children}
    </div>
  )
}
