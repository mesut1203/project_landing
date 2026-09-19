import { useState } from 'react'
import { content } from '../data/content'
import type { MediaAsset } from '../data/content'

interface MediaProps { asset: MediaAsset; className?: string; eager?: boolean }
export function Media({ asset, className = '', eager = false }: MediaProps) {
  const [failed, setFailed] = useState(false)
  const [loaded, setLoaded] = useState(false)
  return (
    <div className={`media ${className} ${loaded ? 'is-loaded' : ''}`}>
      {failed ? <div className="media-error" role="img" aria-label={asset.alt}><span>{content.media.error}</span></div> :
        <img src={asset.src} alt={asset.alt} width={asset.width} height={asset.height} loading={eager ? 'eager' : 'lazy'} decoding="async" style={{ objectPosition: asset.position }} onLoad={() => setLoaded(true)} onError={() => setFailed(true)} />}
    </div>
  )
}
