import { useRef, useState } from 'react'
import type { FormEvent } from 'react'
import { ArrowUpRight } from '@phosphor-icons/react'
import { content } from '../data/content'
import { Reveal } from './Reveal'

interface BookingFormProps { data: typeof content.booking }
const localDate = (date: Date) => `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`

export function BookingForm({ data }: BookingFormProps) {
  const [checkIn, setCheckIn] = useState('')
  const [checkOut, setCheckOut] = useState('')
  const [message, setMessage] = useState('')
  const [hasError, setHasError] = useState(false)
  const arrival = useRef<HTMLInputElement>(null)
  const departure = useRef<HTMLInputElement>(null)
  const today = localDate(new Date())
  const afterArrival = new Date(`${checkIn || today}T12:00:00`)
  afterArrival.setDate(afterArrival.getDate() + 1)
  const minCheckout = localDate(afterArrival)
  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!checkIn || !checkOut) { setMessage(data.errors.required); setHasError(true); (!checkIn ? arrival : departure).current?.focus(); return }
    if (checkIn < localDate(new Date())) { setMessage(data.errors.past); setHasError(true); arrival.current?.focus(); return }
    if (checkOut <= checkIn) { setMessage(data.errors.order); setHasError(true); departure.current?.focus(); return }
    setHasError(false); setMessage(data.success)
  }
  const clear = () => { setMessage(''); setHasError(false) }
  return <section id={data.id} className="booking section-shell" aria-labelledby="booking-heading">
    <Reveal><p className="eyebrow">{data.eyebrow}</p><h2 id="booking-heading" className="section-heading">{data.heading}</h2><p className="body-copy">{data.description}</p></Reveal>
    <form className="booking-form" onSubmit={submit} noValidate aria-describedby="booking-note booking-message">
      <div className="booking-fields">
        <label htmlFor="check-in"><span>{data.labels.checkIn}</span><input ref={arrival} id="check-in" name="checkIn" type="date" min={today} value={checkIn} required aria-invalid={hasError || undefined} onChange={(event) => { setCheckIn(event.target.value); clear() }} /></label>
        <label htmlFor="check-out"><span>{data.labels.checkOut}</span><input ref={departure} id="check-out" name="checkOut" type="date" min={minCheckout} value={checkOut} required aria-invalid={hasError || undefined} onChange={(event) => { setCheckOut(event.target.value); clear() }} /></label>
        <label htmlFor="guests"><span>{data.labels.guests}</span><select id="guests" name="guests" defaultValue="2" onChange={clear}>{data.guests.map((guest) => <option key={guest.value} value={guest.value}>{guest.label}</option>)}</select></label>
        <button className="button-primary" type="submit">{data.labels.submit}<ArrowUpRight size={21} weight="light" aria-hidden="true" /></button>
      </div>
      <p id="booking-note" className="booking-note">{data.note}</p>
      <p id="booking-message" className={`booking-message ${hasError ? 'is-error' : ''}`} role="status" aria-live="polite">{message}</p>
    </form>
  </section>
}
