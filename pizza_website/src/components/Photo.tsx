type PhotoProps = { name: string; alt: string; width: number; height: number; sizes: string; className?: string }
export function Photo({ name, alt, width, height, className }: PhotoProps) {
  return <picture>
    <img className={className} src={`/media/${name}.webp`} alt={alt} width={width} height={height} loading="lazy" decoding="async" />
  </picture>
}
