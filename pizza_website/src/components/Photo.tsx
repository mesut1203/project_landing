type PhotoProps = { name: string; alt: string; width: number; height: number; sizes: string; className?: string }
export function Photo({ name, alt, width, height, sizes, className }: PhotoProps) {
  return <picture>
    <source type="image/webp" srcSet={`/media/optimized/${name}-640.webp 640w, /media/optimized/${name}-960.webp ${Math.min(width, 960)}w`} sizes={sizes} />
    <img className={className} src={`/media/photos/${name}.jpg`} alt={alt} width={width} height={height} loading="lazy" decoding="async" />
  </picture>
}
