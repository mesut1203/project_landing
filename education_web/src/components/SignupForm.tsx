import { useRef, useState, type FormEvent } from 'react'
import { ArrowRight, ArrowUpRight, CheckCircle, Sparkle } from '@phosphor-icons/react'
import type { FormValues, SignupContent } from '../data/content'
import { Reveal } from './Reveal'

export interface SignupFormProps {
  data: SignupContent
  goal: string
  onGoalChange: (value: string) => void
}
type Errors = Partial<Record<keyof FormValues, string>>

export function SignupForm({ data, goal, onGoalChange }: SignupFormProps) {
  const [level, setLevel] = useState('')
  const [email, setEmail] = useState('')
  const [errors, setErrors] = useState<Errors>({})
  const [preview, setPreview] = useState<FormValues | null>(null)
  const formRef = useRef<HTMLFormElement>(null)
  const resultRef = useRef<HTMLDivElement>(null)
  const validateField = (name: keyof FormValues, value: string): string | undefined => {
    if (name === 'email')
      return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim()) ? undefined : data.fields.email.error
    return data.fields[name].options.some((option) => option.value === value)
      ? undefined
      : data.fields[name].error
  }
  const validateOnBlur = (name: keyof FormValues, value: string) => {
    setErrors((previous) => ({ ...previous, [name]: validateField(name, value) }))
  }
  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const values = { goal, level, email: email.trim() }
    const nextErrors: Errors = {}
    for (const name of Object.keys(values) as (keyof FormValues)[]) {
      const message = validateField(name, values[name])
      if (message) nextErrors[name] = message
    }
    setErrors(nextErrors)
    const firstError = Object.keys(nextErrors)[0]
    if (firstError) {
      ;(formRef.current?.elements.namedItem(firstError) as HTMLElement | null)?.focus()
      return
    }
    setPreview(values)
    requestAnimationFrame(() => resultRef.current?.focus({ preventScroll: true }))
  }
  const currentPreview = preview?.goal === goal ? preview : null
  const goalLabel = data.fields.goal.options.find(
    (option) => option.value === currentPreview?.goal,
  )?.label
  const levelLabel = data.fields.level.options.find(
    (option) => option.value === currentPreview?.level,
  )?.label

  return (
    <section id="signup" className="signup-section section-space" aria-labelledby="signup-title">
      <div className="container signup-layout">
        <Reveal className="signup-copy">
          <span className="signup-spark" aria-hidden="true">
            <Sparkle size={57} weight="fill" />
          </span>
          <p className="eyebrow">{data.eyebrow}</p>
          <h2 id="signup-title">{data.heading}</h2>
          <p>{data.description}</p>
          <span className="signup-direction" aria-hidden="true">
            <ArrowUpRight size={85} weight="thin" />
          </span>
        </Reveal>
        <Reveal className="signup-form-wrap" delay={100}>
          {currentPreview ? (
            <div
              ref={resultRef}
              tabIndex={-1}
              className="plan-preview"
              aria-labelledby="plan-title"
            >
              <CheckCircle size={38} weight="fill" />
              <h3 id="plan-title">{data.previewTitle}</h3>
              <p>{data.previewDescription}</p>
              <div className="plan-choice">
                <strong>{goalLabel}</strong>
                <span>{levelLabel}</span>
              </div>
              <ol>
                {data.plan[currentPreview.level as keyof SignupContent['plan']].map((step) => (
                  <li key={step}>{step}</li>
                ))}
              </ol>
              <p className="sr-only" role="status">
                {data.successAnnouncement}
              </p>
              <button
                className="button button-navy"
                onClick={() => {
                  setPreview(null)
                  requestAnimationFrame(() =>
                    (formRef.current?.elements.namedItem('goal') as HTMLElement | null)?.focus(),
                  )
                }}
              >
                {data.editLabel}
                <ArrowRight size={18} />
              </button>
            </div>
          ) : (
            <form
              ref={formRef}
              onSubmit={submit}
              noValidate
              aria-labelledby="signup-title"
              aria-describedby="demo-note required-note"
            >
              <p id="required-note" className="form-required">
                {data.requiredLabel}
              </p>
              <div className="field">
                <label htmlFor="learning-goal">{data.fields.goal.label}</label>
                <select
                  id="learning-goal"
                  name="goal"
                  required
                  value={goal}
                  onChange={(event) => {
                    onGoalChange(event.target.value)
                    setErrors((previous) => ({ ...previous, goal: undefined }))
                  }}
                  onBlur={() => validateOnBlur('goal', goal)}
                  aria-invalid={!!errors.goal}
                  aria-describedby={errors.goal ? 'goal-error' : undefined}
                >
                  <option value="" disabled>
                    {data.fields.goal.placeholder}
                  </option>
                  {data.fields.goal.options.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
                {errors.goal && (
                  <p id="goal-error" className="field-error" role="alert">
                    {errors.goal}
                  </p>
                )}
              </div>
              <div className="field">
                <label htmlFor="experience-level">{data.fields.level.label}</label>
                <select
                  id="experience-level"
                  name="level"
                  required
                  value={level}
                  onChange={(event) => {
                    setLevel(event.target.value)
                    setErrors((previous) => ({ ...previous, level: undefined }))
                  }}
                  onBlur={() => validateOnBlur('level', level)}
                  aria-invalid={!!errors.level}
                  aria-describedby={errors.level ? 'level-error' : undefined}
                >
                  <option value="" disabled>
                    {data.fields.level.placeholder}
                  </option>
                  {data.fields.level.options.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
                {errors.level && (
                  <p id="level-error" className="field-error" role="alert">
                    {errors.level}
                  </p>
                )}
              </div>
              <div className="field">
                <label htmlFor="email">{data.fields.email.label}</label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  inputMode="email"
                  required
                  maxLength={254}
                  placeholder={data.fields.email.placeholder}
                  value={email}
                  onChange={(event) => {
                    setEmail(event.target.value)
                    setErrors((previous) => ({ ...previous, email: undefined }))
                  }}
                  onBlur={() => validateOnBlur('email', email)}
                  aria-invalid={!!errors.email}
                  aria-describedby={`email-hint${errors.email ? ' email-error' : ''}`}
                />
                <p id="email-hint" className="field-hint">
                  {data.fields.email.hint}
                </p>
                {errors.email && (
                  <p id="email-error" className="field-error" role="alert">
                    {errors.email}
                  </p>
                )}
              </div>
              <button type="submit" className="button button-navy form-submit">
                {data.button}
                <ArrowUpRight size={20} />
              </button>
            </form>
          )}
          <p id="demo-note" className="demo-note">
            {data.note}
          </p>
          <p className="privacy-note">{data.privacyNote}</p>
        </Reveal>
      </div>
    </section>
  )
}
