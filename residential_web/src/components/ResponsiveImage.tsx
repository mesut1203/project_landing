import type { ResponsiveImage as ImageContent } from '../types/content'
import { portraitQuery, useMediaQuery } from '../hooks/useMediaQuery'

interface ResponsiveImageProps {
  image: ImageContent
  className?: string
  eager?: boolean
}

export function ResponsiveImage({ image, className = '', eager = false }: ResponsiveImageProps) {
  const portrait = useMediaQuery(portraitQuery)
  return <div className={`image-shell ${className ? `${className}-shell` : ''}`}><img src={portrait ? image.mobile : image.desktop} alt={image.alt} className={className}
    loading={eager ? 'eager' : 'lazy'} decoding="async" fetchPriority={eager ? 'high' : 'auto'} /></div>
}
