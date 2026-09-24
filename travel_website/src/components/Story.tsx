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
          <figure className="story-landscape">
            <img
              src={story.image}
              alt={story.imageAlt}
              width="1280"
              height="720"
              loading="lazy"
            />
            <figcaption>01 / Những bước chân giữa miền xanh</figcaption>
          </figure>
          <figure className="story-detail">
            <img
              src="/images/vinh-hy-cove.webp"
              alt="Một chiếc thuyền nhỏ giữa làn nước trong xanh của vịnh Vĩnh Hy"
              width="1122"
              height="1402"
              loading="lazy"
            />
            <figcaption>02 / Và những ngày chẳng vội</figcaption>
          </figure>
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
