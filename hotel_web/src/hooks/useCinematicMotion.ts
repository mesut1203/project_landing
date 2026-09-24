import { useCallback, useSyncExternalStore } from 'react'

function useMediaMatch(query: string) {
  const subscribe = useCallback((callback: () => void) => {
    const media = window.matchMedia(query)
    media.addEventListener('change', callback)
    return () => media.removeEventListener('change', callback)
  }, [query])
  const snapshot = useCallback(() => window.matchMedia(query).matches, [query])
  return useSyncExternalStore(subscribe, snapshot, () => false)
}

/** Scroll depth is desktop-only; small entrances are available on all screen sizes. */
export const useCinematicMotion = () => useMediaMatch('(min-width: 768px) and (prefers-reduced-motion: no-preference)')
export const useEntranceMotion = () => useMediaMatch('(prefers-reduced-motion: no-preference)')
