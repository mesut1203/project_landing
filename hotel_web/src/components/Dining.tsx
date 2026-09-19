import { ArrowUpRight } from '@phosphor-icons/react'
import { content } from '../data/content'
import { Media } from './Media'
import { Reveal } from './Reveal'

interface DiningProps { data: typeof content.dining }
export function Dining({ data }: DiningProps) {
  return <section id={data.id} className="dining" aria-labelledby="dining-heading">
    <Media asset={data.image} className="dining-image" />
    <Reveal className="dining-copy"><p className="eyebrow">{data.eyebrow}</p><h2 id="dining-heading" className="section-heading">{data.heading}</h2><p>{data.description}</p><p className="dining-detail">{data.detail}</p><a className="text-link" href={data.cta.href}>{data.cta.label}<ArrowUpRight size={18} weight="light" aria-hidden="true" /></a></Reveal>
  </section>
}
