import { StrictMode } from 'react'
import { act, fireEvent, render, screen } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { HowItWorks } from '../src/components/HowItWorks'
import { content } from '../src/data/content'
import { setReducedMotion } from './setup'

let scrollProgress = 0
let seeking = false
const disconnect = vi.fn()
const fetchVideo = vi.fn()
const revoke = vi.fn()

beforeEach(() => {
  vi.useFakeTimers()
  scrollProgress = 0
  seeking = false
  disconnect.mockClear()
  revoke.mockClear()
  fetchVideo.mockReset().mockResolvedValue({ ok: true, blob: async () => new Blob(['video']) })
  vi.stubGlobal('fetch', fetchVideo)
  vi.stubGlobal(
    'URL',
    class extends URL {
      static createObjectURL = vi.fn(() => 'blob:learning-world')
      static revokeObjectURL = revoke
    },
  )
  vi.spyOn(HTMLMediaElement.prototype, 'duration', 'get').mockReturnValue(5)
  vi.spyOn(HTMLMediaElement.prototype, 'readyState', 'get').mockReturnValue(2)
  vi.spyOn(HTMLMediaElement.prototype, 'seeking', 'get').mockImplementation(() => seeking)
  vi.spyOn(HTMLElement.prototype, 'offsetHeight', 'get').mockImplementation(function () {
    return (this as HTMLElement).classList.contains('world-track') ? 3000 : 1000
  })
  vi.spyOn(HTMLElement.prototype, 'getBoundingClientRect').mockImplementation(() => ({
    top: -scrollProgress * 2000,
    bottom: 3000 - scrollProgress * 2000,
    left: 0,
    right: 1280,
    width: 1280,
    height: 3000,
    x: 0,
    y: -scrollProgress * 2000,
    toJSON: () => ({}),
  }))
  vi.stubGlobal(
    'ResizeObserver',
    class {
      observe() {}
      disconnect = disconnect
    },
  )
})

afterEach(() => vi.unstubAllGlobals())

async function setup(strict = false) {
  const component = <HowItWorks data={content.howItWorks} />
  const result = render(strict ? <StrictMode>{component}</StrictMode> : component)
  await act(async () => {})
  const video = result.container.querySelector('video')!
  fireEvent.loadedMetadata(video)
  fireEvent.loadedData(video)
  act(() => vi.advanceTimersByTime(50))
  return { ...result, video }
}

function scrub(progress: number) {
  scrollProgress = progress
  act(() => {
    fireEvent.scroll(window)
    vi.advanceTimersByTime(1200)
  })
}

describe('Scroll-driven video journey', () => {
  it('navigates to a chapter and marks its matching scroll position as current', async () => {
    await setup()
    const scroll = vi.spyOn(window, 'scrollTo').mockImplementation(() => {})
    fireEvent.click(screen.getByRole('button', { name: 'Go to chapter 3: Grow' }))
    expect(scroll).toHaveBeenCalledWith({ top: 1404, behavior: 'smooth' })
    scrub(0.702)
    expect(
      screen.getByRole('button', { name: 'Go to chapter 3: Grow' }).getAttribute('aria-current'),
    ).toBe('step')
  })
  it('uses Blob video, stays paused and scrubs forward/backward with matching copy', async () => {
    const { container, video } = await setup()
    expect(video.src).toBe('blob:learning-world')
    expect(fetchVideo.mock.calls[0]![0]).toBe('/videos/learning-world-zip.mp4')
    expect(video.autoplay).toBe(false)
    expect(video.loop).toBe(false)
    expect(video.muted).toBe(true)
    expect(video.playsInline).toBe(true)
    expect(video.classList.contains('is-painted')).toBe(true)
    scrub(0.5)
    expect(video.currentTime).toBeCloseTo(2.45, 1)
    expect(container.querySelector('.is-active h3')?.textContent).toBe(
      content.howItWorks.steps[1]!.title,
    )
    scrub(1)
    expect(video.currentTime).toBeGreaterThan(4.8)
    expect(video.currentTime).toBeLessThan(5)
    scrub(0)
    expect(video.currentTime).toBeLessThan(0.02)
    expect(screen.getByRole('link', { name: /Continue to community/ }).getAttribute('href')).toBe(
      '#community',
    )
  })

  it('coalesces a fast scroll into the latest target when the pending seek finishes', async () => {
    const { video } = await setup()
    seeking = true
    scrub(0.4)
    scrub(0.9)
    expect(video.currentTime).toBe(0)
    seeking = false
    fireEvent.seeked(video)
    act(() => vi.advanceTimersByTime(50))
    expect(video.currentTime).toBeCloseTo(4.41, 1)
  })

  it('keeps the poster until frame data is available, not just metadata', async () => {
    vi.spyOn(HTMLMediaElement.prototype, 'readyState', 'get').mockReturnValue(1)
    const { video } = await setup()
    expect(video.classList.contains('is-painted')).toBe(false)
    vi.spyOn(HTMLMediaElement.prototype, 'readyState', 'get').mockReturnValue(2)
    fireEvent.loadedData(video)
    act(() => vi.advanceTimersByTime(50))
    expect(video.classList.contains('is-painted')).toBe(true)
  })

  it('does not load video before the section approaches the viewport', async () => {
    scrollProgress = -3
    render(<HowItWorks data={content.howItWorks} />)
    expect(fetchVideo).not.toHaveBeenCalled()
    scrub(0)
    await act(async () => {})
    expect(fetchVideo).toHaveBeenCalledTimes(1)
  })

  it('displays all steps without video for reduced motion, including a live preference change', async () => {
    const { container } = await setup()
    act(() => setReducedMotion(true))
    expect(container.querySelector('video')).toBeNull()
    expect(container.querySelector('.world-static')).not.toBeNull()
    expect(revoke).toHaveBeenCalledWith('blob:learning-world')
    expect(screen.getAllByRole('heading', { level: 3 })).toHaveLength(3)
    fetchVideo.mockClear()
    scrub(1)
    expect(fetchVideo).not.toHaveBeenCalled()
  })

  it('releases the pin if the video cannot load or decode', async () => {
    fetchVideo.mockResolvedValue({ ok: false })
    const { container } = render(<HowItWorks data={content.howItWorks} />)
    await act(async () => {})
    expect(container.querySelector('.world-static')).not.toBeNull()
    expect(container.querySelector('video')).toBeNull()
  })

  it('recovers from a stalled seek instead of keeping the visitor pinned', async () => {
    const { container } = await setup()
    scrub(0.5)
    act(() => vi.advanceTimersByTime(5500))
    expect(container.querySelector('.world-static')).not.toBeNull()
  })

  it('aborts fetching, frees the Blob and cleans up observers in StrictMode', async () => {
    const { unmount } = await setup(true)
    const signal = fetchVideo.mock.calls.at(-1)![1].signal as AbortSignal
    unmount()
    expect(signal.aborted).toBe(true)
    expect(revoke).toHaveBeenCalledWith('blob:learning-world')
    expect(disconnect).toHaveBeenCalled()
    const calls = fetchVideo.mock.calls.length
    scrub(1)
    expect(fetchVideo).toHaveBeenCalledTimes(calls)
  })
})
