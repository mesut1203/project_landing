import { content } from '../data/content'
import { Reveal } from './Reveal'
export function Story() {
  const { story } = content
  return (
    <section
      id="our-story"
      className="story-section section-space"
      aria-labelledby="story-heading"
      tabIndex={-1}
    >
      <div className="shell story-grid">
        <Reveal className="story-visual">
          <figure>
            <img
              src={story.image}
              alt={story.imageAlt}
              width="1280"
              height="720"
              loading="lazy"
            />
            <figcaption>{story.imageCaption}</figcaption>
          </figure>
          <div className="photo-border" aria-hidden="true" />
        </Reveal>
        <Reveal className="story-copy">
          <p className="eyebrow text-accent">{story.eyebrow}</p>
          <h2 id="story-heading" className="section-heading">
            {story.heading}
            <br />
            <em>{story.emphasis}</em>
          </h2>
          <p className="body-copy">{story.description}</p>
          <div className="principles">
            {story.principles.map((item) => (
              <div className="principle" key={item.number}>
                <span>{item.number}</span>
                <div>
                  <h3>{item.title}</h3>
                  <p>{item.text}</p>
                </div>
              </div>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  )
}
