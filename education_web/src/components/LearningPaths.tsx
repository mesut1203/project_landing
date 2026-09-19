import { ArrowUpRight } from '@phosphor-icons/react'
import type { LearningPathsContent } from '../data/content'
import { Reveal } from './Reveal'

interface LearningPathsProps {
  data: LearningPathsContent
  onChoose: (goal: string) => void
}

export function LearningPaths({ data, onChoose }: LearningPathsProps) {
  return (
    <section
      id="learning-paths"
      className="paths-section container section-space"
      aria-labelledby="paths-title"
    >
      <span id="courses" className="anchor-target" />
      <Reveal className="section-heading">
        <p className="eyebrow">{data.eyebrow}</p>
        <h2 id="paths-title">{data.heading}</h2>
        <p>{data.description}</p>
      </Reveal>
      <div className="paths-layout">
        {data.items.map((path, index) => (
          <Reveal key={path.id} className={`path-reveal path-${path.id}`} delay={index * 70}>
            <article className="path-card">
              <div className="path-image">
                <img
                  src={path.image.src}
                  alt={path.image.alt}
                  width={path.image.width}
                  height={path.image.height}
                  loading="lazy"
                />
              </div>
              <div className="path-content">
                <span className="path-label">{path.label}</span>
                <h3>{path.title}</h3>
                <p>{path.description}</p>
                <ul className="path-topics">
                  {path.topics.map((topic) => (
                    <li key={topic}>{topic}</li>
                  ))}
                </ul>
                <a
                  href="#signup"
                  className="path-action"
                  aria-label={path.action}
                  onClick={() => onChoose(path.goal)}
                >
                  <span>{path.action}</span>
                  <span className="path-arrow">
                    <ArrowUpRight size={23} />
                  </span>
                </a>
              </div>
            </article>
          </Reveal>
        ))}
      </div>
    </section>
  )
}
