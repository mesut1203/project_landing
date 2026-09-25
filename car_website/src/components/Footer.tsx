import { useState } from 'react'
import { ArrowUpIcon, ArrowUpRightIcon } from '@phosphor-icons/react'
import { brand, footer } from '../data/content'
import { focusAnchor } from '../lib/anchors'
import { InfoDialog } from './InfoDialog'

export function Footer() {
  const [open, setOpen] = useState(false)
  return (
    <footer className="site-footer section-shell">
      <div className="footer-main">
        <a href="#top" className="wordmark" aria-label={brand.homeLabel} onClick={(event) => { event.preventDefault(); focusAnchor('#top') }}>{brand.logo}</a>
        <nav aria-label={footer.socialLabel} className="social-links">
          {footer.socials.map((social) => <a key={social.label} href={social.href ?? '#social-info'}
            onClick={social.href ? undefined : (event) => { event.preventDefault(); setOpen(true) }}
            aria-haspopup={social.href ? undefined : 'dialog'}>{social.label}<ArrowUpRightIcon weight="light" size={14} aria-hidden="true" /></a>)}
        </nav>
        <a href={footer.top.href} className="back-top" onClick={(event) => { event.preventDefault(); focusAnchor(footer.top.href) }} aria-label={footer.top.label}><ArrowUpIcon weight="light" size={24} /></a>
      </div>
      <div className="footer-bottom"><p>{footer.copyright}</p><p>{footer.note}</p></div>
      <InfoDialog id="social-info" open={open} onClose={() => setOpen(false)} title={footer.socialTitle} description={footer.socialNotice} closeLabel={footer.closeLabel} />
    </footer>
  )
}
