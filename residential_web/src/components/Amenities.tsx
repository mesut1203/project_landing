import { content } from '../data/content'
import { ResponsiveImage } from './ResponsiveImage'
import { Reveal } from './Reveal'

export function Amenities() {
  return <section id="amenities" tabIndex={-1} className="section-space page-shell amenities" aria-labelledby="amenities-title">
    <Reveal className="amenities-heading">
      <h2 id="amenities-title" className="display-title">{content.amenities.title}</h2>
      <p className="section-description">{content.amenities.description}</p>
    </Reveal>
    <div className="amenities-grid">
      {content.amenities.items.map(item => <Reveal key={item.id} className={`amenity amenity-${item.id}`}>
        <article>
          <ResponsiveImage image={item.image} />
          <h3>{item.title}</h3><p>{item.description}</p>
        </article>
      </Reveal>)}
    </div>
  </section>
}
