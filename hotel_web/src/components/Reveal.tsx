import { motion, useReducedMotion } from 'motion/react'
import type { ReactNode } from 'react'

interface RevealProps { children: ReactNode; className?: string; delay?: number }
export function Reveal({ children, className = '', delay = 0 }: RevealProps) {
  const reduce = useReducedMotion()
  return <motion.div className={className} initial={false} whileInView={reduce ? undefined : { opacity: [0.7, 1], y: [22, 0] }} viewport={{ once: true, amount: 0.12 }} transition={{ duration: 0.85, delay, ease: [0.22, 1, 0.36, 1] }}>{children}</motion.div>
}
