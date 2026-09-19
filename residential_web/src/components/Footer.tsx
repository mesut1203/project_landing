import { ArrowUpIcon } from '@radix-ui/react-icons'
import { content } from '../data/content'
import { Brand } from './Brand'

export function Footer() {
  return <footer className="footer page-shell">
    <div className="footer-top">
      <div><Brand className="footer-brand" /><p className="footer-statement">{content.footer.statement}</p></div>
      <nav aria-label={content.footer.navigationLabel} className="footer-links">
        {content.navigation.links.map(link => <a href={link.href} key={link.href}>{link.label}</a>)}
      </nav>
      <a className="text-link" href={content.actions.backTop.href}>{content.actions.backTop.label}<ArrowUpIcon /></a>
    </div>
    <div className="footer-bottom"><p>© {new Date().getFullYear()} {content.footer.copyright}</p><p>{content.footer.disclosure}</p></div>
  </footer>
}
