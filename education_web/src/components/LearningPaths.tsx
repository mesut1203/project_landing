import { ArrowUpRight } from '@phosphor-icons/react'
import type { LearningPathsContent } from '../data/content'
import { Reveal } from './Reveal'

export function LearningPaths({ data, onChoose }: { data: LearningPathsContent; onChoose: (goal: string) => void }) {
  return (
    <section id="learning-paths" className="paths-section container section-space" aria-labelledby="paths-title">
      <span id="courses" className="anchor-target" />
      <Reveal className="section-heading">
        <p className="eyebrow">{data.eyebrow}</p>
        <h2 id="paths-title">{data.heading}</h2>
        <p>{data.description}</p>
      </Reveal>
      <div className="course-index-heading" aria-hidden="true"><span>INDEX</span><span>LEARNING PATH</span><span>EXPLORE YOUR OPTIONS</span></div>
      <div className="paths-layout">
        {data.items.map((path, index) => (
          <Reveal key={path.id} className={`path-reveal path-${path.id}`} variant="index" delay={index * 60}>
            <article className="path-card">
              <span className="course-number">{String(index + 1).padStart(2, '0')}</span>
              <div className="path-content">
                <span className="path-label">{path.label}</span>
                <h3>{path.title}</h3>
                <p>{path.description}</p>
                <ul className="path-topics">{path.topics.map((topic) => <li key={topic}>{topic}</li>)}</ul>
              </div>
              <div className="path-image"><img src={path.image.src} alt={path.image.alt} width={path.image.width} height={path.image.height} loading="lazy" /></div>
              <a href="#signup" className="path-action" aria-label={path.action} onClick={() => onChoose(path.goal)}><span>{path.action}</span><ArrowUpRight size={24} /></a>
              <span className="course-rule" aria-hidden="true" />
            </article>
          </Reveal>
        ))}
      </div>
    </section>
  )
}
