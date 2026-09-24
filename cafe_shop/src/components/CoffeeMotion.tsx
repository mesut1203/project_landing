import { useState } from 'react'
import { useReducedMotionPreference } from '../hooks/useMotionPreference'
import SplitText from './react-bits/SplitText'
import ScrollVelocity from './react-bits/ScrollVelocity'

export function CoffeeHeadline() {
  const reduced = useReducedMotionPreference()
  return (
    <h1 id="hero-title" className="hero-title" aria-label="Chậm một chút. Đậm một ngày.">
      <span className="headline-top" aria-hidden="true">
        {reduced ? 'Chậm một chút.' : <SplitText text="Chậm một chút." tag="span" textAlign="left" delay={24} duration={1.15} rootMargin="0px" from={{ opacity: 0, y: 65, rotateX: -25 }} to={{ opacity: 1, y: 0, rotateX: 0 }} />}
      </span>
      <span className="headline-bottom" aria-hidden="true">
        {reduced ? 'Đậm một ngày.' : <SplitText text="Đậm một ngày." tag="span" textAlign="left" delay={35} duration={1.35} rootMargin="0px" from={{ opacity: 0, y: 65, rotateX: -25 }} to={{ opacity: 1, y: 0, rotateX: 0 }} />}
      </span>
    </h1>
  )
}

export function CoffeeMarquee() {
  const reduced = useReducedMotionPreference()
  const [paused, setPaused] = useState(false)
  return (
    <div className="coffee-marquee">
      <p className="sr-only">Hạt Việt. Vị nguyên bản. Pha bằng tâm.</p>
      <div aria-hidden="true">
        {reduced || paused ? <p className="marquee-static">HẠT VIỆT / VỊ NGUYÊN BẢN / PHA BẰNG TÂM</p> : <ScrollVelocity texts={['HẠT VIỆT / VỊ NGUYÊN BẢN / PHA BẰNG TÂM /']} velocity={30} numCopies={3} velocityMapping={{ input: [0, 1000], output: [0, 2] }} />}
      </div>
      {!reduced && <button className="marquee-control" aria-pressed={paused} onClick={() => setPaused(!paused)}>{paused ? 'Tiếp tục chuyển động' : 'Tạm dừng chuyển động'} <span aria-hidden="true">{paused ? '+' : 'Ⅱ'}</span></button>}
    </div>
  )
}
