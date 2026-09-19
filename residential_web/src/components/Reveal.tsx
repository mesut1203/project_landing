import { motion } from 'motion/react'
import type { ReactNode } from 'react'
import { reducedMotionQuery, useMediaQuery } from '../hooks/useMediaQuery'

interface RevealProps { children: ReactNode; className?: string; delay?: number }

export function Reveal({ children, className, delay = 0 }: RevealProps) {
  const reduced = useMediaQuery(reducedMotionQuery)
  return <motion.div className={className} initial={false}
    whileInView={reduced ? undefined : { opacity: [0.5, 1], y: [20, 0] }}
    viewport={{ once: true, amount: 0.12 }} transition={{ duration: 0.65, delay, ease: [0.2, 0.7, 0.2, 1] }}>
    {children}
  </motion.div>
}
