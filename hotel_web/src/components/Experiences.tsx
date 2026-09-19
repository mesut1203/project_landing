import { useRef, useState } from 'react'
import { ArrowUpRight } from '@phosphor-icons/react'
import type { KeyboardEvent } from 'react'
import { content } from '../data/content'
import { Media } from './Media'
import { Reveal } from './Reveal'

interface ExperiencesProps { data: typeof content.experiences }
export function Experiences({ data }: ExperiencesProps) {
  const [active, setActive] = useState(0)
  const tabs = useRef<(HTMLButtonElement | null)[]>([])
  const keyboard = (event: KeyboardEvent<HTMLButtonElement>, index: number) => {
    let next = index
    if (['ArrowDown', 'ArrowRight'].includes(event.key)) next = (index + 1) % data.items.length
    else if (['ArrowUp', 'ArrowLeft'].includes(event.key)) next = (index - 1 + data.items.length) % data.items.length
    else if (event.key === 'Home') next = 0
    else if (event.key === 'End') next = data.items.length - 1
    else return
    event.preventDefault(); setActive(next); tabs.current[next]?.focus()
  }
  return <section id={data.id} className="experiences section-shell" aria-labelledby="experiences-heading">
    <Reveal><h2 id="experiences-heading" className="section-heading">{data.heading}</h2><p className="body-copy">{data.description}</p></Reveal>
    <div className="experience-layout">
      <div className="experience-tabs" role="tablist" aria-label={data.label} aria-orientation="vertical">
        {data.items.map((item, index) => <button key={item.id} ref={(element) => { tabs.current[index] = element }} id={`tab-${item.id}`} type="button" role="tab" aria-selected={active === index} aria-controls={`panel-${item.id}`} tabIndex={active === index ? 0 : -1} className={`experience-tab ${active === index ? 'is-active' : ''}`} onClick={() => setActive(index)} onKeyDown={(event) => keyboard(event, index)}><span className="experience-subtitle">{item.subtitle}</span><span className="experience-title">{item.title}</span><ArrowUpRight size={25} weight="light" aria-hidden="true" /></button>)}
      </div>
      <div className="experience-panels">{data.items.map((item, index) => <div key={item.id} id={`panel-${item.id}`} role="tabpanel" aria-labelledby={`tab-${item.id}`} hidden={active !== index} tabIndex={0}><Media asset={item.image} /><p>{item.description}</p></div>)}</div>
    </div>
  </section>
}
