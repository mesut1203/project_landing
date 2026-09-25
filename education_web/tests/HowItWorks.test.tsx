import { act, render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { HowItWorks } from '../src/components/HowItWorks'
import { content } from '../src/data/content'
import { setReducedMotion } from './setup'

describe('Learning journey', () => {
  it('shows every learning step and a community link without video', () => {
    const { container } = render(<HowItWorks data={content.howItWorks} />)
    expect(container.querySelector('video')).toBeNull()
    expect(screen.getAllByRole('listitem')).toHaveLength(3)
    for (const step of content.howItWorks.steps) {
      expect(screen.getByRole('heading', { name: step.title })).not.toBeNull()
      expect(screen.getByText(step.description)).not.toBeNull()
    }
    expect(screen.getByRole('link', { name: 'Continue to community' }).getAttribute('href')).toBe(
      '#community',
    )
    expect(screen.getByRole('img').getAttribute('src')).toBe('/images/learning-plan.webp')
  })

  it('preserves all content when reduced motion changes', () => {
    setReducedMotion(true)
    const { container } = render(<HowItWorks data={content.howItWorks} />)
    act(() => setReducedMotion(false))
    act(() => setReducedMotion(true))
    expect(container.querySelector('video')).toBeNull()
    expect(screen.getAllByRole('listitem')).toHaveLength(3)
  })
})
