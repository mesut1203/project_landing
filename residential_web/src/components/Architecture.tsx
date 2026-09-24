import { content } from '../data/content'
import { ResponsiveImage } from './ResponsiveImage'
import { Reveal } from './Reveal'
import { ArchitecturalPlate } from './ArchitecturalPlate'

export function Architecture() {
  return <section id="architecture" tabIndex={-1} className="architecture section-space" aria-labelledby="architecture-title">
    <div className="page-shell architecture-grid">
      <ArchitecturalPlate className="architecture-image"><ResponsiveImage image={content.architecture.image} /></ArchitecturalPlate>
      <div className="architecture-copy">
        <Reveal>
          <h2 id="architecture-title" className="display-title">{content.architecture.title}</h2>
          <p className="section-description">{content.architecture.description}</p>
        </Reveal>
        <div className="architecture-details">
          {content.architecture.details.map((detail, index) => <Reveal key={detail.title}>
            <span className="detail-number" aria-hidden="true">0{index + 1}</span>
            <h3>{detail.title}</h3><p>{detail.description}</p>
          </Reveal>)}
        </div>
      </div>
    </div>
  </section>
}
