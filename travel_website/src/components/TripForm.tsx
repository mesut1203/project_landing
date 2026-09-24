import { useRef, useState, type FormEvent } from 'react'
import { content } from '../data/content'
import { Arrow } from './Icon'
import { Reveal } from './Reveal'
type Errors = { name?: string; destination?: string; month?: string }
type Summary = {
  name: string
  destination: string
  month: string
  pace: string
}
export function TripForm({
  destination,
  onDestinationChange,
}: {
  destination: string
  onDestinationChange: (value: string) => void
}) {
  const { form } = content
  const [name, setName] = useState('')
  const [month, setMonth] = useState('')
  const [pace, setPace] = useState<string>(form.paceOptions[0])
  const [errors, setErrors] = useState<Errors>({})
  const [summary, setSummary] = useState<Summary | null>(null)
  const formRef = useRef<HTMLFormElement>(null)
  const now = new Date()
  const minMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`
  const validate = (): Errors => ({
    name: name.trim().length < 2 ? form.errorName : undefined,
    destination: !destination ? form.errorDestination : undefined,
    month: month && month < minMonth ? form.errorMonth : undefined,
  })
  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const nextErrors = validate()
    setErrors(nextErrors)
    const firstInvalid = (Object.keys(nextErrors) as (keyof Errors)[]).find(
      (key) => nextErrors[key],
    )
    if (firstInvalid) {
      ;(
        formRef.current?.elements.namedItem(firstInvalid) as HTMLElement | null
      )?.focus()
      return
    }
    setSummary({ name: name.trim(), destination, month, pace })
  }
  const selectedName = (value: string) =>
    content.destinations.items.find((item) => item.id === value)?.name ||
    form.flexible
  const monthLabel = (value: string) =>
    value
      ? new Intl.DateTimeFormat('vi-VN', {
          month: 'long',
          year: 'numeric',
        }).format(new Date(`${value}-01T12:00:00`))
      : form.undecided
  return (
    <section
      id="plan-trip"
      className="trip-section section-space"
      aria-labelledby="trip-heading"
      tabIndex={-1}
    >
      <div className="shell trip-grid">
        <Reveal className="trip-introduction">
          <p className="eyebrow text-accent">{form.eyebrow}</p>
          <h2 id="trip-heading" className="section-heading">
            {form.heading}
            <br />
            <em>{form.emphasis}</em>
          </h2>
          <p className="body-copy">{form.description}</p>
          <figure className="trip-postcard">
            <img
              src="/images/hoi-an-morning.webp"
              alt="Ánh nắng sớm rọi qua con ngõ vàng yên tĩnh ở Hội An"
              width="1122"
              height="1402"
              loading="lazy"
            />
            <figcaption>Một sáng thật khác. Ở một nơi thật gần.</figcaption>
          </figure>
          <aside className="demo-notice" id="demo-notice">
            <span className="eyebrow">{form.demoLabel}</span>
            <p>{form.demoNotice}</p>
          </aside>
        </Reveal>
        <Reveal className="trip-form-wrap">
          <form
            ref={formRef}
            onSubmit={onSubmit}
            noValidate
            aria-describedby="demo-notice"
          >
            <p className="required-hint">{form.requiredHint}</p>
            <div className="field">
              <label htmlFor="trip-name">{form.name} *</label>
              <input
                id="trip-name"
                name="name"
                autoComplete="given-name"
                required
                maxLength={80}
                value={name}
                placeholder={form.namePlaceholder}
                onChange={(event) => {
                  const value = event.target.value
                  setName(value)
                  if (errors.name && value.trim().length >= 2)
                    setErrors((previous) => ({ ...previous, name: undefined }))
                  setSummary(null)
                }}
                onBlur={() => {
                  const error = validate().name
                  if (error)
                    setErrors((previous) => ({ ...previous, name: error }))
                }}
                aria-invalid={!!errors.name}
                aria-describedby={errors.name ? 'name-error' : undefined}
              />
              {errors.name && (
                <p id="name-error" className="field-error" role="alert">
                  {errors.name}
                </p>
              )}
            </div>
            <div className="field">
              <label htmlFor="trip-destination">{form.destination} *</label>
              <select
                id="trip-destination"
                name="destination"
                required
                value={destination}
                onChange={(event) => {
                  onDestinationChange(event.target.value)
                  setSummary(null)
                  setErrors((previous) => ({
                    ...previous,
                    destination: undefined,
                  }))
                }}
                aria-invalid={!!errors.destination}
                aria-describedby={
                  errors.destination ? 'destination-error' : undefined
                }
              >
                <option value="" disabled>
                  {form.destinationPlaceholder}
                </option>
                {content.destinations.items.map((item) => (
                  <option value={item.id} key={item.id}>
                    {item.name}
                  </option>
                ))}
                <option value="flexible">{form.flexible}</option>
              </select>
              {errors.destination && (
                <p id="destination-error" className="field-error" role="alert">
                  {errors.destination}
                </p>
              )}
            </div>
            <div className="grid gap-5 sm:grid-cols-2">
              <div className="field">
                <label htmlFor="trip-month">{form.month}</label>
                <input
                  id="trip-month"
                  name="month"
                  type="month"
                  min={minMonth}
                  value={month}
                  onChange={(event) => {
                    const value = event.target.value
                    setMonth(value)
                    if (errors.month && (!value || value >= minMonth))
                      setErrors((previous) => ({
                        ...previous,
                        month: undefined,
                      }))
                    setSummary(null)
                  }}
                  onBlur={() => {
                    const error = validate().month
                    if (error)
                      setErrors((previous) => ({ ...previous, month: error }))
                  }}
                  aria-invalid={!!errors.month}
                  aria-describedby={errors.month ? 'month-error' : undefined}
                />
                {errors.month && (
                  <p id="month-error" className="field-error" role="alert">
                    {errors.month}
                  </p>
                )}
              </div>
              <div className="field">
                <label htmlFor="trip-pace">{form.pace}</label>
                <select
                  id="trip-pace"
                  name="pace"
                  value={pace}
                  onChange={(event) => {
                    setPace(event.target.value)
                    setSummary(null)
                  }}
                >
                  {form.paceOptions.map((option) => (
                    <option key={option}>{option}</option>
                  ))}
                </select>
              </div>
            </div>
            <button
              type="submit"
              className="button button-primary submit-button"
            >
              {form.submit}
              <Arrow diagonal />
            </button>
            <div aria-live="polite" aria-atomic="true">
              {summary && summary.destination === destination && (
                <div className="trip-summary">
                  <h3>{form.successTitle}</h3>
                  <p>{form.success(summary.name)}</p>
                  <dl>
                    {[
                      [
                        form.summaryLabels.destination,
                        selectedName(summary.destination),
                      ],
                      [form.summaryLabels.month, monthLabel(summary.month)],
                      [form.summaryLabels.pace, summary.pace],
                    ].map(([label, value]) => (
                      <div key={label}>
                        <dt>{label}</dt>
                        <dd>{value}</dd>
                      </div>
                    ))}
                  </dl>
                  <p className="summary-demo">{form.demoNotice}</p>
                </div>
              )}
            </div>
          </form>
        </Reveal>
      </div>
    </section>
  )
}
