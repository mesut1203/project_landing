import { brand, model, ctas } from '../data/content'
import { ActionLink } from './ActionLink'
import { MediaImage } from './MediaImage'

export function ModelSection() {
  return (
    <section id={model.id} className="model-section section-shell" tabIndex={-1} aria-labelledby="model-title">
      <p className="section-kicker"><span>01 / Model overview</span><span>Apex One // Design philosophy</span></p>
      <div className="model-intro">
        <h2 id="model-title" className="display-heading">{model.heading}</h2>
        <p className="body-copy">{model.description}</p>
      </div>
      <figure className="model-figure">
        <div className="model-name" aria-hidden="true">{brand.model}</div>
        <div className="model-media"><MediaImage image={model.image} /></div>
        <figcaption><span>{model.caption}</span><ActionLink action={ctas.detail} variant="text" /></figcaption>
      </figure>
    </section>
  )
}
