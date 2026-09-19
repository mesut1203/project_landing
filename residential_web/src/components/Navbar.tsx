import { useCallback, useEffect, useState } from 'react'
import { ArrowTopRightIcon, HamburgerMenuIcon } from '@radix-ui/react-icons'
import { content } from '../data/content'
import { useMediaQuery } from '../hooks/useMediaQuery'
import { Brand } from './Brand'
import { MobileMenu } from './MobileMenu'

export function Navbar() {
  const [open, setOpen] = useState(false)
  const desktop = useMediaQuery('(min-width: 1024px)')
  const close = useCallback(() => setOpen(false), [])
  useEffect(() => { if (desktop) close() }, [desktop, close])

  return <>
    <a className="skip-link" href="#main">{content.actions.skipContent}</a>
    <header className="navbar">
      <div className="page-shell flex h-full items-center justify-between gap-8">
        <Brand />
        <nav className="hidden items-center gap-9 lg:flex" aria-label={content.navigation.label}>
          {content.navigation.links.map(link => <a className="nav-link" key={link.href} href={link.href}>{link.label}</a>)}
        </nav>
        <a href={content.navigation.cta.href} className="button nav-cta hidden lg:inline-flex">{content.navigation.cta.label}<ArrowTopRightIcon /></a>
        <button className="icon-button lg:hidden" onClick={() => setOpen(true)} aria-label={content.navigation.open}
          aria-expanded={open} aria-controls="mobile-menu" aria-haspopup="dialog"><HamburgerMenuIcon /></button>
      </div>
    </header>
    <MobileMenu open={open} onClose={close} />
  </>
}
