import { motion } from 'motion/react'
import { useCinematicMotion, useEntranceMotion } from '../hooks/useCinematicMotion'

export function ArrivalTitle() {
  const cinematic = useCinematicMotion()
  const entrance = useEntranceMotion()
  if (!entrance) return <h1>Arrive <em>slowly.</em></h1>
  return <h1 aria-label="Arrive slowly.">
    <span className="arrival-word" aria-hidden="true"><motion.span initial={{ y: cinematic ? '112%' : '44%' }} animate={{ y: '0%' }} transition={{ duration: cinematic ? 1.45 : 0.85, delay: cinematic ? 0.12 : 0.06, ease: [0.16, 1, 0.3, 1] }}>Arrive</motion.span></span>{' '}
    <span className="arrival-word" aria-hidden="true"><motion.em initial={{ y: cinematic ? '112%' : '44%' }} animate={{ y: '0%' }} transition={{ duration: cinematic ? 1.6 : 0.95, delay: cinematic ? 0.3 : 0.15, ease: [0.16, 1, 0.3, 1] }}>slowly.</motion.em></span>
  </h1>
}
