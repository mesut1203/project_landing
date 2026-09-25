import { useState } from 'react'
import { content, type DestinationCategory } from '../data/content'
import { Arrow } from './Icon'
import { Reveal } from './Reveal'
import DecryptedText from './react-bits/DecryptedText'
import ScrollReveal from './react-bits/ScrollReveal'
export function Destinations({ onChoose }: { onChoose: (id: string) => void }) {
  const [filter, setFilter] = useState<DestinationCategory>('all')
  const { destinations, interlude } = content
  const items = destinations.items.filter(
    (item) => filter === 'all' || item.category === filter,
  )
  return (
    <>
      <section
        id="destinations"
        className="destinations-section section-space"
        aria-labelledby="destinations-heading"
        tabIndex={-1}
      >
        <div className="shell">
          <Reveal className="destination-heading">
            <div>
              <p className="eyebrow text-accent">{destinations.eyebrow}</p>
              <h2 id="destinations-heading" className="section-heading">
                {destinations.heading}
                <br />
                <em>{destinations.emphasis}</em>
              </h2>
            </div>
            <p className="body-copy">{destinations.description}</p>
          </Reveal>
          <div className="destination-tools">
            <div
              className="filters"
              role="group"
              aria-label={content.a11y.filter}
            >
              {destinations.filters.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  aria-pressed={filter === item.id}
                  onClick={() => setFilter(item.id)}
                >
                  {item.label}
                </button>
              ))}
            </div>
            <span className="result-count" role="status">
              {destinations.count(items.length)}
            </span>
          </div>
          <div
            className={`destination-grid${items.length === 1 ? ' destination-grid-single' : ''}`}
          >
            {items.map((item) => (
              <Reveal
                key={`${filter}-${item.id}`}
                className="destination-reveal"
              >
                <article className="destination-card">
                  <a
                    className="destination-photo"
                    href="#plan-trip"
                    onClick={() => onChoose(item.id)}
                    aria-label={`${destinations.choose}: ${item.name}`}
                  >
                    <img
                      src={item.image}
                      alt={item.alt}
                      width="1280"
                      height="720"
                      loading="lazy"
                    />
                    <span className="destination-number">{item.number}</span>
                    <span className="destination-tag">{item.mood}</span>
                    <span className="image-arrow">
                      <Arrow diagonal />
                    </span>
                  </a>
                  <div className="destination-detail">
                    <p className="eyebrow destination-location">
                      <DecryptedText
                        text={item.location}
                        animateOn="inViewHover"
                        speed={35}
                        maxIterations={9}
                        characters="ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"
                      />
                    </p>
                    <h3>{item.name}</h3>
                    <p className="destination-description">
                      {item.description}
                    </p>
                    <a
                      className="text-link"
                      href="#plan-trip"
                      onClick={() => onChoose(item.id)}
                    >
                      {destinations.choose}
                      <Arrow />
                    </a>
                  </div>
                </article>
              </Reveal>
            ))}
          </div>
          <p className="image-note">{destinations.imageNote}</p>
        </div>
      </section>
      <section className="interlude" aria-label={interlude.eyebrow}>
        <img
          src={interlude.image}
          alt=""
          width="1280"
          height="720"
          loading="lazy"
        />
        <div className="interlude-shade" />
        <Reveal className="interlude-content">
          <p className="eyebrow">{interlude.eyebrow}</p>
          <ScrollReveal className="interlude-quote">{`${interlude.line} ${interlude.emphasis}`}</ScrollReveal>
          <span className="interlude-line" />
          <a className="interlude-link" href="#plan-trip">
            Bắt đầu một hành trình
            <Arrow diagonal />
          </a>
        </Reveal>
      </section>
    </>
  )
}
