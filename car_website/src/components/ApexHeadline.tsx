import { hero } from '../data/content'
import { useReducedMotionPreference } from '../hooks/useMotionPreference'
import SplitText from './react-bits/SplitText'

export function ApexHeadline() {
  const reduced = useReducedMotionPreference()
  return <h1 id="hero-title" className="hero-heading" aria-label={hero.lines.join(' ')}>
    {hero.lines.map((line, index) => <span className="hero-line" key={line} aria-hidden="true">
      {reduced ? line : <SplitText text={line} tag="span" textAlign="left" delay={index ? 26 : 21} duration={0.95}
        ease="expo.out" rootMargin="0px" from={{ yPercent: 115, rotateX: -40, opacity: 0 }} to={{ yPercent: 0, rotateX: 0, opacity: 1 }} />}
    </span>)}
  </h1>
}
