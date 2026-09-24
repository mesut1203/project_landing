import { motion, useReducedMotion } from 'motion/react'
import type { ReactNode } from 'react'

interface RevealProps { children: ReactNode; className?: string; delay?: number }
export function Reveal({ children, className = '', delay = 0 }: RevealProps) {
  const reduce = useReducedMotion()
  if (reduce) return <div className={className}>{children}</div>
  return <motion.div className={className} initial={false} whileInView={{ opacity: [0.9, 1], y: [6, 0] }} viewport={{ once: true, amount: 0.12 }} transition={{ duration: 0.25, delay, ease: 'easeOut' }}>{children}</motion.div>
}
