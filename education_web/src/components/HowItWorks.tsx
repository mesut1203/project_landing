import { ArrowUpRight } from '@phosphor-icons/react'
import { useRef } from 'react'
import type { HowItWorksContent } from '../data/content'
import { Reveal } from './Reveal'
import { useEntranceMotion } from '../hooks/useEntranceMotion'
import './HowItWorks.css'

export function HowItWorks({ data }: { data: HowItWorksContent }) {
  const ref = useRef<HTMLElement>(null)
  useEntranceMotion(ref, 'journey')
  return (
    <section ref={ref} id="how-it-works" className="learning-journey" aria-labelledby="how-title">
      <div className="container">
        <Reveal className="journey-heading">
          <div>
            <p className="eyebrow">
              <span />
              {data.eyebrow}
            </p>
            <h2 id="how-title">{data.heading}</h2>
          </div>
          <p className="journey-introduction">{data.description}</p>
        </Reveal>
        <figure className="journey-image">
          <img
            src={import.meta.env.BASE_URL + data.media.src}
            width={data.media.width}
            height={data.media.height}
            loading="lazy"
            alt={data.media.alt}
          />
          <figcaption>{data.journeyLabel}</figcaption>
        </figure>
        <ol className="journey-steps">
          {data.steps.map((step, index) => (
            <li key={step.label}>
              <p className="journey-step-label">
                <span>{String(index + 1).padStart(2, '0')}</span>
                {step.label}
              </p>
              <h3>{step.title}</h3>
              <p className="journey-step-description">{step.description}</p>
              <span className="journey-step-rule" aria-hidden="true" />
            </li>
          ))}
        </ol>
        <a className="text-link journey-link" href={data.cta.href}>
          {data.cta.label}
          <ArrowUpRight size={20} aria-hidden="true" />
        </a>
      </div>
    </section>
  )
}
