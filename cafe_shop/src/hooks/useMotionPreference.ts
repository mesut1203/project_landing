import { useSyncExternalStore } from 'react'

const reducedQuery = '(prefers-reduced-motion: reduce)'
const pointerQuery = '(hover: hover) and (pointer: fine)'
function subscribeToMotion(callback: () => void) {
  const query = window.matchMedia(reducedQuery)
  query.addEventListener('change', callback)
  return () => query.removeEventListener('change', callback)
}
function subscribeToPointer(callback: () => void) {
  const query = window.matchMedia(pointerQuery)
  query.addEventListener('change', callback)
  return () => query.removeEventListener('change', callback)
}
export function useReducedMotionPreference() {
  return useSyncExternalStore(subscribeToMotion, () => window.matchMedia(reducedQuery).matches, () => true)
}
export function useFinePointer() {
  return useSyncExternalStore(subscribeToPointer, () => window.matchMedia(pointerQuery).matches, () => false)
}
