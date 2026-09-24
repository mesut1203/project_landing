import { useRef, useState } from 'react'
import type { RefObject } from 'react'
import { motion, useScroll, useTransform } from 'motion/react'
import { content } from '../data/content'
import type { MediaAsset } from '../data/content'
import { useCinematicMotion } from '../hooks/useCinematicMotion'

interface MediaProps { asset: MediaAsset; className?: string; eager?: boolean }
interface AnimatedPhotoProps extends MediaProps {
  frame: RefObject<HTMLDivElement | null>
  loaded: boolean
  onLoad: () => void
  onError: () => void
}

function AnimatedPhoto({ asset, eager = false, frame, loaded, onLoad, onError }: AnimatedPhotoProps) {
  const { scrollYProgress } = useScroll({ target: frame, offset: ['start end', 'end start'] })
  const y = useTransform(scrollYProgress, [0, 1], ['-4%', '4%'])
  return <>
    <motion.div className="media-depth" style={{ y }}>
      <motion.img src={asset.src} alt={asset.alt} width={asset.width} height={asset.height}
        loading={eager ? 'eager' : 'lazy'} fetchPriority={eager ? 'high' : undefined} decoding="async"
        style={{ objectPosition: asset.position }} initial={{ scale: eager ? 1.24 : 1.15 }}
        animate={loaded ? { scale: 1.1 } : undefined} transition={{ duration: eager ? 2.8 : 1.8, ease: [0.16, 1, 0.3, 1] }}
        onLoad={onLoad} onError={onError} />
    </motion.div>
    {!eager && <motion.span className="media-curtain" aria-hidden="true" initial={{ scaleY: 1 }}
      whileInView={{ scaleY: 0 }} viewport={{ once: true, amount: 0.12 }}
      transition={{ duration: 1.25, ease: [0.76, 0, 0.24, 1] }} />}
  </>
}

export function Media({ asset, className = '', eager = false }: MediaProps) {
  const [failed, setFailed] = useState(false)
  const [loaded, setLoaded] = useState(false)
  const frame = useRef<HTMLDivElement>(null)
  const cinematic = useCinematicMotion()
  return <div ref={frame} className={`media ${className} ${loaded ? 'is-loaded' : ''}`}>
    {failed ? <div className="media-error" role="img" aria-label={asset.alt}><span>{content.media.error}</span></div> : cinematic ?
      <AnimatedPhoto asset={asset} eager={eager} frame={frame} loaded={loaded} onLoad={() => setLoaded(true)} onError={() => setFailed(true)} /> :
      <img src={asset.src} alt={asset.alt} width={asset.width} height={asset.height} loading={eager ? 'eager' : 'lazy'} fetchPriority={eager ? 'high' : undefined} decoding="async" style={{ objectPosition: asset.position }} onLoad={() => setLoaded(true)} onError={() => setFailed(true)} />}
  </div>
}
