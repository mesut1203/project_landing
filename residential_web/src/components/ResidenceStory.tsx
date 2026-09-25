import { ArrowRightIcon, ArrowTopRightIcon } from '@radix-ui/react-icons'
import { content } from '../data/content'
import { ResponsiveImage } from './ResponsiveImage'
import { Reveal } from './Reveal'
import SplitText from './reactbits/SplitText'
import { ArchitecturalPlate } from './ArchitecturalPlate'

export function ResidenceStory() {
  const scenePanel = (scene: typeof content.story.scenes[number], index: number) => {
    const Copy = index === 0 ? 'div' : Reveal
    const titleId = index === 0 ? 'hero-title' : `${scene.id}-title`
    return <article key={scene.id} className={`story-section ${index === 0 ? 'story-feature page-shell' : 'story-detail'}`} aria-labelledby={titleId}>
      <figure className="story-figure">{index === 0 ? <ArchitecturalPlate><ResponsiveImage image={scene.image} className="story-image" eager /></ArchitecturalPlate> : <ResponsiveImage image={scene.image} className="story-image" />}<figcaption><span>0{index + 1} / {index === 0 ? 'Facade & landscape' : scene.label}</span><span>LUMA RESIDENCES</span></figcaption></figure>
      <Copy className="story-copy">
        {index > 0 && <p className="eyebrow">Study 0{index} / {scene.label}</p>}
        {index === 0 ? <SplitText id={titleId} tag="h1" className="story-title" text={scene.title} splitType="words" delay={80} duration={1.1} from={{ opacity: 0, yPercent: 110 }} to={{ opacity: 1, yPercent: 0 }} /> : <h2 id={titleId} className="story-title">{scene.title}</h2>}
        <div className={index === 0 ? 'hero-caption-row' : undefined}>
          <p className="story-description">{scene.description}</p>
          {index === 0 && <div className="story-actions">
            <a className="button button-gold" href={content.actions.viewing.href}>{content.actions.viewing.label}<ArrowTopRightIcon /></a>
            <a className="text-link" href={content.actions.exploreResidences.href} onClick={() => {
              requestAnimationFrame(() => document.getElementById('residences')?.focus({ preventScroll: true }))
            }}>{content.actions.exploreResidences.label}<ArrowRightIcon /></a>
          </div>}
        </div>
      </Copy>
      {index === 0 && <div className="hero-specs"><span>01 / The collection</span><span>One · Two · Three bedrooms</span><span>Light. Space. Nature.</span></div>}
    </article>
  }
  return <section className="residence-story" aria-label={content.story.title}>
    <div className="project-index page-shell"><span className="project-coordinate">Luma — Residential folio</span><span>Architecture / Living / Landscape</span></div>
    {scenePanel(content.story.scenes[0], 0)}
    <div className="study-introduction page-shell"><span className="study-index" aria-hidden="true">01—03</span><div><span>Spatial studies</span><p>Considered from every angle.</p></div></div>
    <div className="story-studies page-shell">{content.story.scenes.slice(1).map((scene, index) => scenePanel(scene, index + 1))}</div>
  </section>
}
