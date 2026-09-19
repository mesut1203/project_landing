import { useEffect, useState, useSyncExternalStore, type ReactNode } from 'react'
import { MotionContext } from '../hooks/useMotionPreferences'
type Connection = EventTarget & { saveData?: boolean; effectiveType?: string }
type DeviceNavigator = Navigator & { connection?: Connection }

const subscribe = (onChange: () => void) => {
  const queries = [matchMedia('(prefers-reduced-motion: reduce)'), matchMedia('(min-width: 1024px) and (min-height: 600px)')]
  queries.forEach(query => query.addEventListener('change', onChange))
  const connection = (navigator as DeviceNavigator).connection
  connection?.addEventListener('change', onChange)
  return () => {
    queries.forEach(query => query.removeEventListener('change', onChange))
    connection?.removeEventListener('change', onChange)
  }
}
function getDeviceMode() {
  const device = navigator as DeviceNavigator
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return 'reduced'
  // Coarse RAM/CPU hints are not a reliable reason to disable a bounded film.
  if (device.connection?.saveData || /(^|-)2g$/.test(device.connection?.effectiveType ?? '')) return 'light'
  return matchMedia('(min-width: 1024px) and (min-height: 600px)').matches ? 'cinematic' : 'compact'
}
export function MotionPreferences({ children }: { children: ReactNode }) {
  const mode = useSyncExternalStore(subscribe, getDeviceMode, () => 'reduced')
  const [paused, setPaused] = useState(() => {
    try { return sessionStorage.getItem('fiamma-pause-motion') === 'true' } catch { return false }
  })
  // Respect system/data preferences by default, but keep playback available
  // through an explicit visitor action. This override lasts only until reload.
  const [motionOptIn, setMotionOptIn] = useState(false)
  const reduced = (mode === 'reduced' || mode === 'light') && !motionOptIn
  useEffect(() => {
    document.documentElement.dataset.motion = paused || reduced ? 'paused' : 'enabled'
    return () => { delete document.documentElement.dataset.motion }
  }, [paused, reduced])
  const toggle = () => {
    const nextPaused = reduced ? false : !paused
    if (reduced) setMotionOptIn(true)
    setPaused(nextPaused)
    try { sessionStorage.setItem('fiamma-pause-motion', String(nextPaused)) } catch { /* Storage is optional. */ }
  }
  return <MotionContext.Provider value={{ cinematic: mode === 'cinematic', reduced, paused, toggle }}>{children}</MotionContext.Provider>
}
