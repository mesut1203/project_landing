import { useState } from 'react'
import type { ImageContent } from '../data/content'
import { brand } from '../data/content'

interface MediaImageProps { image: ImageContent; className?: string; eager?: boolean }

export function MediaImage({ image, className = '', eager = false }: MediaImageProps) {
  const [failed, setFailed] = useState(false)
  return failed ? <div className={`image-unavailable ${className}`} role="img" aria-label={image.alt}><span>{brand.model}</span></div> : (
    <img src={image.src} alt={image.alt} width={image.width} height={image.height}
      className={className} loading={eager ? 'eager' : 'lazy'} decoding="async" onError={() => setFailed(true)} />
  )
}
