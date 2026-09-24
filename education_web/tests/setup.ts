import { afterEach, beforeEach, vi } from 'vitest'
import { cleanup } from '@testing-library/react'

let reduced = false
const listeners = new Set<() => void>()
export function setReducedMotion(value: boolean) {
  reduced = value
  listeners.forEach((listener) => listener())
}
beforeEach(() => {
  reduced = false
  Object.defineProperty(window, 'matchMedia', {
    configurable: true,
    value: vi.fn((query: string) => ({
      get matches() {
        return query.includes('prefers-reduced-motion') ? reduced : false
      },
      media: query,
      addEventListener: (_type: string, listener: () => void) => listeners.add(listener),
      removeEventListener: (_type: string, listener: () => void) => listeners.delete(listener),
    })),
  })
})
afterEach(() => {
  cleanup()
  listeners.clear()
  vi.useRealTimers()
  vi.restoreAllMocks()
})
