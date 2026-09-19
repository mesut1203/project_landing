import { useEffect, useRef, useState } from 'react'
import { ListIcon } from '@phosphor-icons/react'
import { brand, navigation, story, ctas } from '../data/content'
import { useMediaQuery } from '../hooks/useMediaQuery'
import { focusAnchor } from '../lib/anchors'
import { ActionLink } from './ActionLink'
import { MobileMenu } from './MobileMenu'

export function Navbar() {
  const [open, setOpen] = useState(false)
  const triggerRef = useRef<HTMLButtonElement>(null)
  const mobile = useMediaQuery(story.breakpoint)
  useEffect(() => {
    const query = window.matchMedia(story.breakpoint)
    const closeOnDesktop = (event: MediaQueryListEvent) => { if (!event.matches) setOpen(false) }
    query.addEventListener('change', closeOnDesktop)
    return () => query.removeEventListener('change', closeOnDesktop)
  }, [])

  return (
    <>
      <a className="skip-content" href={navigation.skipContent.href} onClick={(event) => {
        event.preventDefault(); focusAnchor(navigation.skipContent.href)
      }}>{navigation.skipContent.label}</a>
      <header className="site-header">
        <a href="#top" className="wordmark" aria-label={brand.homeLabel} onClick={(event) => {
          event.preventDefault(); focusAnchor('#top')
        }}>{brand.logo}</a>
        <nav className="desktop-nav" aria-label={navigation.label}>
          {navigation.links.map((link) => <a key={link.href} href={link.href} onClick={(event) => {
            event.preventDefault(); focusAnchor(link.href)
          }}>{link.label}</a>)}
        </nav>
        <ActionLink action={ctas.book} variant="outline" className="nav-book" />
        <button ref={triggerRef} type="button" className="icon-button menu-trigger" onClick={() => setOpen(true)}
          aria-label={navigation.openLabel} aria-expanded={open} aria-controls="mobile-navigation"><ListIcon size={26} /></button>
      </header>
      {mobile && <MobileMenu open={open} onClose={() => setOpen(false)} triggerRef={triggerRef} />}
    </>
  )
}
