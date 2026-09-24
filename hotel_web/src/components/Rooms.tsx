import { ArrowUpRight } from '@phosphor-icons/react'
import { content } from '../data/content'
import { Media } from './Media'
import { Reveal } from './Reveal'

interface RoomsProps { data: typeof content.rooms }
export function Rooms({ data }: RoomsProps) {
  return (
    <section id={data.id} className="rooms section-shell" tabIndex={-1} aria-labelledby="rooms-heading">
      <Reveal className="rooms-intro"><p className="eyebrow">{data.eyebrow}</p><h2 id="rooms-heading" className="section-heading">{data.heading}</h2><p className="body-copy">{data.description}</p></Reveal>
      <div className="rooms-grid">
        {data.items.map((room, index) => <Reveal key={room.id} className={`room room-${index + 1}`}>
          <article aria-labelledby={room.id}>
            <a href={room.cta.href} className="room-photo-link" aria-label={`${room.name}: ${room.cta.label}`}><Media asset={room.image} /><span className="image-arrow"><ArrowUpRight size={26} weight="light" aria-hidden="true" /></span></a>
            <div className="room-heading"><h3 id={room.id}>{room.name}</h3><span className="room-index" aria-hidden="true">0{index + 1}</span></div>
            <p className="room-category">{room.category}</p><p className="room-description">{room.description}</p>
            <a className="text-link" href={room.cta.href}>{room.cta.label}<ArrowUpRight size={16} weight="light" aria-hidden="true" /></a>
          </article>
        </Reveal>)}
        <p className="rooms-note">{data.note}</p>
      </div>
    </section>
  )
}
