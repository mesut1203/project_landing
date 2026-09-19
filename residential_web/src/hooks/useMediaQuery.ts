import { useCallback, useSyncExternalStore } from 'react'

export function useMediaQuery(query: string) {
  const subscribe = useCallback((callback: () => void) => {
    const media = window.matchMedia(query)
    media.addEventListener('change', callback)
    return () => media.removeEventListener('change', callback)
  }, [query])
  return useSyncExternalStore(subscribe, () => window.matchMedia(query).matches, () => false)
}

export const portraitQuery = '(max-width: 767px), (pointer: coarse)'
export const reducedMotionQuery = '(prefers-reduced-motion: reduce)'
