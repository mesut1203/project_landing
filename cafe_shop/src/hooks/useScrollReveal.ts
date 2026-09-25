import { useEffect } from 'react'

export function useScrollReveal() {
  useEffect(() => {
    const root = document.getElementById('root')
    if (!root || !('IntersectionObserver' in window) || !HTMLElement.prototype.animate) return

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)')
    const mobile = window.matchMedia('(max-width: 767px)')
    const visible = new Set<HTMLElement>()
    const animations = new Map<HTMLElement, Animation>()
    const observer = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        const element = entry.target
        if (!(element instanceof HTMLElement)) continue
        if (!entry.isIntersecting) {
          visible.delete(element)
          continue
        }
        if (visible.has(element)) continue
        visible.add(element)
        if (reducedMotion.matches || element.contains(document.activeElement)) continue

        const distance = mobile.matches ? 22 : 36
        const delay = Number(element.dataset.reveal) || 0
        const animation = element.animate(
          [
            { opacity: 0, translate: `0 ${distance}px` },
            { opacity: 1, translate: '0 0' },
          ],
          {
            duration: mobile.matches ? 800 : 1000,
            delay: Math.min(delay, mobile.matches ? 120 : 240),
            easing: 'cubic-bezier(0.22, 1, 0.36, 1)',
            fill: 'backwards',
          },
        )
        animation.id = 'scroll-reveal'
        animations.set(element, animation)

        // Translating the observed box must not retrigger its own entrance.
        observer.unobserve(element)
        animation.onfinish = () => {
          animations.delete(element)
          animation.cancel()
          if (element.isConnected) observer.observe(element)
        }
      }
    }, { rootMargin: '0px 0px -24px 0px', threshold: 0 })

    const visitTargets = (node: Node, callback: (element: HTMLElement) => void) => {
      if (!(node instanceof HTMLElement)) return
      if (node.matches('[data-reveal]')) callback(node)
      node.querySelectorAll<HTMLElement>('[data-reveal]').forEach(callback)
    }
    const register = (element: HTMLElement) => observer.observe(element)
    const unregister = (element: HTMLElement) => {
      observer.unobserve(element)
      animations.get(element)?.cancel()
      animations.delete(element)
      visible.delete(element)
    }
    const finishReveal = (element: HTMLElement) => {
      animations.get(element)?.cancel()
      animations.delete(element)
      if (element.isConnected) observer.observe(element)
    }
    const finishAll = () => {
      for (const element of animations.keys()) finishReveal(element)
    }
    const onMotionChange = () => {
      if (reducedMotion.matches) finishAll()
    }
    const onFocus = (event: FocusEvent) => {
      if (!(event.target instanceof Element)) return
      let element = event.target.closest<HTMLElement>('[data-reveal]')
      while (element) {
        finishReveal(element)
        element = element.parentElement?.closest<HTMLElement>('[data-reveal]') ?? null
      }
    }

    // Category changes and “show more” can insert new menu cards after mount.
    const mutations = new MutationObserver((records) => {
      for (const record of records) {
        record.removedNodes.forEach((node) => visitTargets(node, unregister))
        record.addedNodes.forEach((node) => visitTargets(node, register))
      }
    })
    visitTargets(root, register)
    mutations.observe(root, { childList: true, subtree: true })
    window.addEventListener('beforeprint', finishAll)
    root.addEventListener('focusin', onFocus)
    reducedMotion.addEventListener('change', onMotionChange)

    return () => {
      observer.disconnect()
      mutations.disconnect()
      animations.forEach((animation) => animation.cancel())
      window.removeEventListener('beforeprint', finishAll)
      root.removeEventListener('focusin', onFocus)
      reducedMotion.removeEventListener('change', onMotionChange)
    }
  }, [])
}
