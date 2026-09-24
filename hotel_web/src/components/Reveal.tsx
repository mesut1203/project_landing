import { motion } from 'motion/react'
import { useCinematicMotion, useEntranceMotion } from '../hooks/useCinematicMotion'
import type { ReactNode } from 'react'

interface RevealProps { children: ReactNode; className?: string; delay?: number }
export function Reveal({ children, className = '', delay = 0 }: RevealProps) {
  const cinematic = useCinematicMotion()
  const entrance = useEntranceMotion()
  return <motion.div className={className} initial={false} animate={entrance ? undefined : { y: 0 }} whileInView={{ y: entrance ? [cinematic ? 40 : 14, 0] : 0 }} viewport={{ once: true, amount: 0.12 }} transition={{ duration: entrance ? cinematic ? 1.15 : 0.7 : 0, delay: entrance ? delay : 0, ease: [0.22, 0.75, 0.1, 1] }}>{children}</motion.div>
}
