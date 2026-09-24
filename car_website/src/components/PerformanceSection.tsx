import { useState } from 'react'
import { ArrowRightIcon } from '@phosphor-icons/react'
import { performance } from '../data/content'
import { MediaImage } from './MediaImage'

export function PerformanceSection() {
  const [active, setActive] = useState(0)
  return (
    <section id={performance.id} className="performance-section section-shell" tabIndex={-1} aria-labelledby="performance-title">
      <h2 id="performance-title" className="display-heading">{performance.heading}</h2>
      <div className="detail-layout">
        <div className="detail-visuals">
          {performance.details.map((detail, index) => <div key={detail.id} className={`detail-visual ${active === index ? 'is-active' : ''}`} aria-hidden={active !== index}>
            <MediaImage image={detail.image} />
          </div>)}
        </div>
        <div className="detail-list" aria-label={performance.label}>
          {performance.details.map((detail, index) => (
            <div key={detail.id} className={`detail-item ${active === index ? 'is-active' : ''}`}>
              <h3><button type="button" id={`detail-tab-${detail.id}`} aria-expanded={active === index}
                aria-controls={`detail-panel-${detail.id}`} onClick={() => setActive(index)}>
                <span>{detail.label}</span><ArrowRightIcon size={23} aria-hidden="true" />
              </button></h3>
              <div id={`detail-panel-${detail.id}`} role="region" aria-labelledby={`detail-tab-${detail.id}`} hidden={active !== index}>
                <h4>{detail.heading}</h4><p>{detail.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
