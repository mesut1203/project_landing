import { content } from '../data/content'
import { ResponsiveImage } from './ResponsiveImage'
import { Reveal } from './Reveal'

export function Architecture() {
  return <section id="architecture" tabIndex={-1} className="architecture section-space" aria-labelledby="architecture-title">
    <div className="page-shell architecture-grid">
      <Reveal className="architecture-image"><ResponsiveImage image={content.architecture.image} /></Reveal>
      <div className="architecture-copy">
        <Reveal>
          <h2 id="architecture-title" className="display-title">{content.architecture.title}</h2>
          <p className="section-description">{content.architecture.description}</p>
        </Reveal>
        <div className="architecture-details">
          {content.architecture.details.map(detail => <Reveal key={detail.title}>
            <h3>{detail.title}</h3><p>{detail.description}</p>
          </Reveal>)}
        </div>
      </div>
    </div>
  </section>
}
