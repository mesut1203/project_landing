import { ArrowUpRight, ChatCircle, Lightbulb } from '@phosphor-icons/react'
import type { CommunityContent } from '../data/content'
import { Reveal } from './Reveal'

interface CommunityProps {
  data: CommunityContent
}

export function Community({ data }: CommunityProps) {
  return (
    <section
      id="community"
      className="community-section container section-space"
      aria-labelledby="community-title"
    >
      <Reveal className="community-figure">
        <figure>
          <img
            src={data.image.src}
            alt={data.image.alt}
            width={data.image.width}
            height={data.image.height}
            loading="lazy"
          />
          <figcaption>{data.imageCaption}</figcaption>
        </figure>
        <span className="community-mark" aria-hidden="true">
          <ChatCircle size={43} weight="light" />
        </span>
      </Reveal>
      <Reveal className="community-copy" delay={80}>
        <p className="eyebrow">{data.eyebrow}</p>
        <h2 id="community-title">{data.heading}</h2>
        <p className="section-description">{data.description}</p>
        <ul className="community-points">
          {data.points.map((point, index) => (
            <li key={point.title}>
              {index === 0 ? <ChatCircle size={24} /> : <Lightbulb size={24} />}
              <div>
                <h3>{point.title}</h3>
                <p>{point.description}</p>
              </div>
            </li>
          ))}
        </ul>
        <a className="text-link" href={data.cta.href}>
          {data.cta.label}
          <ArrowUpRight size={20} />
        </a>
      </Reveal>
    </section>
  )
}
