import { ArrowUp, ArrowUpRight } from '@phosphor-icons/react'
import type { FooterContent } from '../data/content'

interface FooterProps {
  data: FooterContent
}

export function Footer({ data }: FooterProps) {
  return (
    <footer className="footer">
      <div className="container footer-main">
        <div>
          <a href="#home" className="wordmark">
            <span className="brand-symbol" aria-hidden="true">
              <ArrowUpRight weight="bold" />
            </span>
            {data.brand}
          </a>
          <p>{data.description}</p>
        </div>
        <nav aria-label={data.navigationLabel}>
          {data.links.map((link) => (
            <a key={link.href} href={link.href}>
              {link.label}
            </a>
          ))}
        </nav>
        <a className="icon-button back-top" href="#home" aria-label={data.topLabel}>
          <ArrowUp size={22} />
        </a>
      </div>
      <div className="container footer-bottom">
        <p>
          © {new Date().getFullYear()} {data.copyright}
        </p>
        <p>{data.note}</p>
      </div>
    </footer>
  )
}
