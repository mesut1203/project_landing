import { ArrowUp } from '@phosphor-icons/react'
import { content } from '../data/content'
import type { LinkContent } from '../data/content'

interface FooterProps { data: typeof content.footer; brand: typeof content.brand; links: LinkContent[] }
export function Footer({ data, brand, links }: FooterProps) {
  return <footer className="footer section-shell"><div className="footer-top"><div><a className="wordmark" href="#top" aria-label={brand.homeLabel}>{brand.logo}</a><p>{brand.tagline}</p></div><nav aria-label={data.navigation}>{links.map((link) => <a key={link.href} href={link.href}>{link.label}</a>)}</nav><a className="back-top" href="#top" aria-label={data.back}><ArrowUp size={24} weight="light" /></a></div><div className="footer-bottom"><p>{data.copyright}</p><p>{data.note}</p></div></footer>
}
