import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import App from '../src/App'
import { content } from '../src/data/content'
import { setReducedMotion } from './setup'

describe('Landing page integration', () => {
  it('opens directly to an interactive page with only the scroll-controlled video', () => {
    const { container } = render(<App />)
    const shell = container.querySelector('.site-shell')!
    expect(shell.hasAttribute('inert')).toBe(false)
    expect(shell.hasAttribute('aria-hidden')).toBe(false)
    expect(screen.getByRole('main')).not.toBeNull()
    expect(document.body.style.overflow).not.toBe('hidden')
    expect(container.querySelectorAll('video')).toHaveLength(1)
    expect(container.querySelector('video')!.classList.contains('world-video')).toBe(true)
    expect(container.querySelector('video')!.autoplay).toBe(false)
    expect(container.querySelector('.intro-video')).toBeNull()
  })
  it('bypasses media for reduced motion and connects path links to the form', () => {
    setReducedMotion(true)
    const { container } = render(<App />)
    expect(container.querySelector('video')).toBeNull()
    expect(screen.getByRole('heading', { level: 1 }).getAttribute('aria-label')).toBe(
      content.hero.heading,
    )
    fireEvent.click(screen.getByRole('link', { name: 'Explore languages' }))
    expect((screen.getByLabelText('Learning goal') as HTMLSelectElement).value).toBe('languages')
  })
  it('keeps the page accessible when the section video fails', () => {
    const { container } = render(<App />)
    fireEvent.error(container.querySelector('.world-video')!)
    expect(container.querySelector('.world-static')).not.toBeNull()
    expect(screen.getByRole('main')).not.toBeNull()
    expect(container.querySelector('.site-shell')!.hasAttribute('inert')).toBe(false)
  })
})
