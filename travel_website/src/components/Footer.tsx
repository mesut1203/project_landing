import { content } from '../data/content'
import { Arrow, BrandMark } from './Icon'
import { Reveal } from './Reveal'
export function Footer() {
  return (
    <footer className="footer">
      <div className="shell">
        <Reveal className="footer-top" stagger>
          <div>
            <a className="brand" href="#top" aria-label={content.a11y.home}>
              <BrandMark />
              <span>
                {content.brand.name}
                <small>{content.brand.country}</small>
              </span>
            </a>
            <p className="footer-description">{content.footer.description}</p>
          </div>
          <nav aria-label={content.a11y.footerNav}>
            {content.nav.map((item) => (
              <a key={item.href} href={item.href}>
                {item.label}
              </a>
            ))}
          </nav>
          <a className="back-top" href="#top">
            {content.footer.backToTop}
            <Arrow diagonal />
          </a>
        </Reveal>
        <div className="footer-bottom">
          <span>{content.footer.copyright}</span>
          <span>{content.footer.note}</span>
          <a href={content.footer.photoUrl} target="_blank" rel="noreferrer">
            {content.footer.photoCredit}
          </a>
        </div>
      </div>
    </footer>
  )
}
