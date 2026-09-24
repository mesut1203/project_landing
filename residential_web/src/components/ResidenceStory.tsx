import { ArrowRightIcon, ArrowTopRightIcon } from '@radix-ui/react-icons'
import { content } from '../data/content'
import { ResponsiveImage } from './ResponsiveImage'
import { Reveal } from './Reveal'

export function ResidenceStory() {
  return <section className="residence-story" aria-label={content.story.title}>
    {content.story.scenes.map((scene, index) => {
      const Heading = index === 0 ? 'h1' : 'h2'
      const titleId = index === 0 ? 'hero-title' : `${scene.id}-title`
      return <article key={scene.id} className="story-section page-shell" aria-labelledby={titleId}>
        <ResponsiveImage image={scene.image} className="story-image" eager={index === 0} />
        <Reveal className="story-copy">
          <p className="eyebrow">{scene.label}</p>
          <Heading id={titleId} className="story-title">{scene.title}</Heading>
          <p className="story-description">{scene.description}</p>
          {index === 0 && <div className="story-actions">
            <a className="button button-gold" href={content.actions.viewing.href}>{content.actions.viewing.label}<ArrowTopRightIcon /></a>
            <a className="text-link" href={content.actions.exploreResidences.href} onClick={() => {
              requestAnimationFrame(() => document.getElementById('residences')?.focus({ preventScroll: true }))
            }}>{content.actions.exploreResidences.label}<ArrowRightIcon /></a>
          </div>}
        </Reveal>
      </article>
    })}
  </section>
}
