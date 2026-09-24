import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import App from '../src/App'
import { content } from '../src/data/content'
import { setReducedMotion } from './setup'

describe('Landing page integration', () => {
  it('opens directly to an interactive page without video or scroll locks', () => {
    const { container } = render(<App />)
    const shell = container.querySelector('.site-shell')!
    expect(shell.hasAttribute('inert')).toBe(false)
    expect(shell.hasAttribute('aria-hidden')).toBe(false)
    expect(screen.getByRole('main')).not.toBeNull()
    expect(document.body.style.overflow).not.toBe('hidden')
    expect(container.querySelector('video')).toBeNull()
    for (const step of content.howItWorks.steps) {
      expect(screen.getByRole('heading', { name: step.title })).not.toBeNull()
    }
  })
  it('supports reduced motion and connects path links to the form', () => {
    setReducedMotion(true)
    const { container } = render(<App />)
    expect(container.querySelector('video')).toBeNull()
    expect(screen.getByRole('heading', { level: 1 }).getAttribute('aria-label')).toBe(
      content.hero.heading,
    )
    fireEvent.click(screen.getByRole('link', { name: 'Explore languages' }))
    expect((screen.getByLabelText('Learning goal') as HTMLSelectElement).value).toBe('languages')
  })
})
