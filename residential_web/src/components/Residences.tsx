import { ArrowTopRightIcon } from '@radix-ui/react-icons'
import { content } from '../data/content'
import { ResponsiveImage } from './ResponsiveImage'
import { Reveal } from './Reveal'

export function Residences() {
  return <section id="residences" tabIndex={-1} className="section-space page-shell residences" aria-labelledby="residences-title">
    <Reveal className="section-heading">
      <h2 id="residences-title" className="display-title">{content.residences.title}</h2>
      <p className="section-description">{content.residences.description}</p>
    </Reveal>
    <div className="residences-grid">
      {content.residences.items.map((item, index) => <Reveal key={item.id} className={`residence residence-${index + 1}`}>
        <article>
          <a href={content.actions.viewing.href} className="residence-image-link" aria-label={`${content.residences.linkLabel}: ${item.title}`}>
            <ResponsiveImage image={item.image} className="residence-image" />
          </a>
          <div className="residence-heading">
            <h3>{item.title}</h3>
            <a href={content.actions.viewing.href} className="icon-button" aria-label={`${content.residences.linkLabel}: ${item.title}`}><ArrowTopRightIcon /></a>
          </div>
          <p>{item.description}</p>
        </article>
      </Reveal>)}
    </div>
  </section>
}
