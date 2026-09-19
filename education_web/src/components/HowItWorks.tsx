import { useMemo } from 'react'
import { ArrowDown, ArrowUpRight } from '@phosphor-icons/react'
import type { HowItWorksContent } from '../data/content'
import { Reveal } from './Reveal'
import { useVideoScroll } from '../hooks/useVideoScroll'
import './HowItWorks.css'

export function HowItWorks({ data }: { data: HowItWorksContent }) {
  const source = `${import.meta.env.BASE_URL}${data.media.video}`
  const poster = `${import.meta.env.BASE_URL}${data.media.src}`
  const chapterStarts = useMemo(() => data.steps.map((step) => step.start), [data.steps])
  const {
    trackRef,
    stageRef,
    videoRef,
    step: activeStep,
    painted,
    goToChapter,
    staticMode,
  } = useVideoScroll(source, chapterStarts, data.media.frameRate)

  return (
    <section id="how-it-works" className="learning-world" aria-labelledby="how-title">
      <div className="container world-heading">
        <Reveal>
          <p className="eyebrow">
            <span />
            {data.eyebrow}
          </p>
          <h2 id="how-title">{data.heading}</h2>
        </Reveal>
        <Reveal className="world-introduction">
          <p>{data.description}</p>
          <span className="world-hint">
            <ArrowDown size={16} aria-hidden="true" />
            {data.hint}
          </span>
        </Reveal>
      </div>

      <div ref={trackRef} className={`world-track${staticMode ? ' world-static' : ''}`}>
        <div ref={stageRef} className="world-stage">
          <div className="world-media">
            <img
              src={poster}
              width={data.media.width}
              height={data.media.height}
              loading="lazy"
              alt={data.media.alt}
            />
            {!staticMode && (
              <video
                ref={videoRef}
                className={`world-video${painted ? ' is-painted' : ''}`}
                poster={poster}
                muted
                playsInline
                preload="none"
                disablePictureInPicture
                aria-hidden="true"
                tabIndex={-1}
              />
            )}
          </div>

          <div className="world-topline">
            <span>{data.journeyLabel}</span>
            <a href={data.skip.href}>
              {data.skip.label}
              <ArrowUpRight size={16} aria-hidden="true" />
            </a>
          </div>

          <div className="world-story">
            <ol className="world-steps">
              {data.steps.map((step, index) => (
                <li
                  key={step.label}
                  className={`world-step${index === activeStep ? ' is-active' : ''}`}
                >
                  <p className="world-step-label">
                    <span>{String(index + 1).padStart(2, '0')}</span>
                    {step.label}
                  </p>
                  <h3>{step.title}</h3>
                  <p className="world-step-description">{step.description}</p>
                </li>
              ))}
            </ol>
            <nav className="world-chapters" aria-label={data.navigationLabel}>
              {data.steps.map((step, index) => (
                <button
                  key={step.label}
                  type="button"
                  className={`world-chapter world-chapter-${index}${index === activeStep ? ' is-active' : ''}`}
                  aria-label={`Go to chapter ${index + 1}: ${step.label}`}
                  aria-current={index === activeStep ? 'step' : undefined}
                  onClick={() => goToChapter(index)}
                >
                  <span className="world-chapter-line" aria-hidden="true">
                    <i />
                  </span>
                  <span className="world-chapter-name">
                    <span aria-hidden="true">{String(index + 1).padStart(2, '0')}</span>
                    {step.label}
                    <ArrowUpRight size={14} aria-hidden="true" />
                  </span>
                </button>
              ))}
            </nav>
          </div>
        </div>
      </div>
    </section>
  )
}
