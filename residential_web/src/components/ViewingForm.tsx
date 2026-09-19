import { useRef, useState } from 'react'
import type { FormEvent } from 'react'
import { ArrowTopRightIcon, CheckIcon } from '@radix-ui/react-icons'
import { content } from '../data/content'
import { Reveal } from './Reveal'

interface ViewingDetails { name: string; email: string; date: string }

function today() {
  const date = new Date()
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
}

export function ViewingForm() {
  const [submitted, setSubmitted] = useState(false)
  const feedback = useRef<HTMLParagraphElement>(null)

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const form = event.currentTarget
    const data = new FormData(form)
    const details: ViewingDetails = { name: String(data.get('name') ?? '').trim(), email: String(data.get('email') ?? ''), date: String(data.get('date') ?? '') }
    const nameInput = form.elements.namedItem('name') as HTMLInputElement
    nameInput.setCustomValidity(details.name ? '' : content.visit.invalidName)
    if (!form.reportValidity()) return
    // Demo only. Deliberately no network request, localStorage or console logging of personal data.
    form.reset()
    setSubmitted(true)
    requestAnimationFrame(() => feedback.current?.focus({ preventScroll: true }))
  }

  return <section id="visit" tabIndex={-1} className="visit section-space" aria-labelledby="visit-title">
    <div className="page-shell visit-grid">
      <Reveal className="visit-copy">
        <p className="eyebrow">{content.visit.eyebrow}</p>
        <h2 id="visit-title" className="display-title whitespace-pre-line">{content.visit.title}</h2>
        <p className="section-description">{content.visit.description}</p>
      </Reveal>
      <Reveal className="viewing-form-wrap">
        <form onSubmit={submit} aria-label={content.actions.viewing.label} aria-describedby="demo-note" className="viewing-form">
          <div className="form-field"><label htmlFor="viewing-name">{content.visit.name}</label>
            <input id="viewing-name" name="name" type="text" autoComplete="name" required maxLength={120}
              placeholder={content.visit.namePlaceholder} onInput={event => event.currentTarget.setCustomValidity('')} />
          </div>
          <div className="form-field"><label htmlFor="viewing-email">{content.visit.email}</label>
            <input id="viewing-email" name="email" type="email" autoComplete="email" required maxLength={254} placeholder={content.visit.emailPlaceholder} />
          </div>
          <div className="form-field"><label htmlFor="viewing-date">{content.visit.date}</label>
            <input id="viewing-date" name="date" type="date" required min={today()} />
          </div>
          <button className="button button-gold w-full" type="submit">{content.actions.viewing.label}<ArrowTopRightIcon /></button>
          <p id="demo-note" className="form-note">{content.visit.note}</p>
          <p className="form-note">{content.visit.privacy}</p>
          {submitted && <p ref={feedback} tabIndex={-1} role="status" className="form-feedback"><CheckIcon />{content.visit.success}</p>}
        </form>
      </Reveal>
    </div>
  </section>
}
