import { useState } from 'react'
import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { SignupForm } from '../src/components/SignupForm'
import { content } from '../src/data/content'

function Demo() {
  const [goal, setGoal] = useState('')
  return <SignupForm data={content.signup} goal={goal} onGoalChange={setGoal} />
}

describe('Learning plan demo form', () => {
  it('labels every field and explains the demo before submitting', () => {
    render(<Demo />)
    expect(screen.getByLabelText('Learning goal')).toBeTruthy()
    expect(screen.getByLabelText('Experience level')).toBeTruthy()
    expect(screen.getByLabelText('Email').getAttribute('type')).toBe('email')
    expect(screen.getByText(content.signup.note)).toBeTruthy()
  })
  it('shows field errors and focuses the first invalid control', () => {
    render(<Demo />)
    fireEvent.click(screen.getByRole('button', { name: content.signup.button }))
    expect(screen.getAllByRole('alert')).toHaveLength(3)
    expect(document.activeElement).toBe(screen.getByLabelText('Learning goal'))
  })
  it('validates email on blur and allows correcting it', () => {
    render(<Demo />)
    const email = screen.getByLabelText('Email')
    fireEvent.change(email, { target: { value: 'wrong' } })
    fireEvent.blur(email)
    expect(email.getAttribute('aria-invalid')).toBe('true')
    fireEvent.change(email, { target: { value: 'learner@example.com' } })
    fireEvent.blur(email)
    expect(email.getAttribute('aria-invalid')).toBe('false')
  })
  it('creates a local plan without sending or storing personal information', () => {
    const fetchSpy = vi.spyOn(globalThis, 'fetch')
    const storageSpy = vi.spyOn(Storage.prototype, 'setItem')
    render(<Demo />)
    fireEvent.change(screen.getByLabelText('Learning goal'), { target: { value: 'creative' } })
    fireEvent.change(screen.getByLabelText('Experience level'), { target: { value: 'beginner' } })
    fireEvent.change(screen.getByLabelText('Email'), { target: { value: 'learner@example.com' } })
    fireEvent.click(screen.getByRole('button', { name: content.signup.button }))
    expect(screen.getByRole('heading', { name: content.signup.previewTitle })).toBeTruthy()
    expect(screen.getByText('Explore my creative side')).toBeTruthy()
    expect(screen.getByText(content.signup.plan.beginner[0])).toBeTruthy()
    expect(fetchSpy).not.toHaveBeenCalled()
    expect(storageSpy).not.toHaveBeenCalled()
    fireEvent.click(screen.getByRole('button', { name: content.signup.editLabel }))
    expect((screen.getByLabelText('Email') as HTMLInputElement).value).toBe('learner@example.com')
  })
})
