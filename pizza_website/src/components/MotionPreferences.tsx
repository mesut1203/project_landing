import { useEffect, useSyncExternalStore, type ReactNode } from 'react'
import { MotionContext } from '../hooks/useMotionPreferences'

type Connection = EventTarget & { saveData?: boolean; effectiveType?: string }
type DeviceNavigator = Navigator & { connection?: Connection }

const subscribe = (onChange: () => void) => {
  const query = matchMedia('(prefers-reduced-motion: reduce)')
  const connection = (navigator as DeviceNavigator).connection
  query.addEventListener('change', onChange)
  connection?.addEventListener('change', onChange)
  return () => {
    query.removeEventListener('change', onChange)
    connection?.removeEventListener('change', onChange)
  }
}

function shouldReduceMotion() {
  const connection = (navigator as DeviceNavigator).connection
  return matchMedia('(prefers-reduced-motion: reduce)').matches ||
    Boolean(connection?.saveData || /(^|-)2g$/.test(connection?.effectiveType ?? ''))
}

export function MotionPreferences({ children }: { children: ReactNode }) {
  const reduced = useSyncExternalStore(subscribe, shouldReduceMotion, () => true)
  useEffect(() => {
    document.documentElement.dataset.motion = reduced ? 'paused' : 'enabled'
    return () => { delete document.documentElement.dataset.motion }
  }, [reduced])
  return <MotionContext.Provider value={{ reduced }}>{children}</MotionContext.Provider>
}
