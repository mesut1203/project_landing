import { content } from '../data/content'

interface BrandProps { className?: string }

export function Brand({ className = '' }: BrandProps) {
  return <a href="#top" aria-label={content.brand.homeLabel} className={`brand ${className}`}>
    <span className="brand-wordmark">{content.brand.wordmark}</span>
    <span className="brand-descriptor">{content.brand.descriptor}</span>
  </a>
}
