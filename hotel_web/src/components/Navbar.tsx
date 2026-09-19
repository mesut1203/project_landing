import { useEffect, useRef, useState } from 'react'
import { ArrowUpRight, List, X } from '@phosphor-icons/react'
import { useMotionValueEvent, useScroll } from 'motion/react'
import { content } from '../data/content'

interface NavbarProps { data: typeof content.nav; brand: typeof content.brand }
export function Navbar({ data, brand }: NavbarProps) {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const toggle = useRef<HTMLButtonElement>(null)
  const menu = useRef<HTMLDivElement>(null)
  const { scrollY } = useScroll()
  useMotionValueEvent(scrollY, 'change', (y) => setScrolled(y > 60))

  useEffect(() => {
    if (!open) return
    menu.current?.querySelector<HTMLAnchorElement>('a')?.focus()
    const close = (event: KeyboardEvent) => {
      if (event.key === 'Escape') { setOpen(false); toggle.current?.focus() }
    }
    const desktop = window.matchMedia('(min-width: 768px)')
    const resize = () => { if (desktop.matches) setOpen(false) }
    document.addEventListener('keydown', close)
    desktop.addEventListener('change', resize)
    return () => { document.removeEventListener('keydown', close); desktop.removeEventListener('change', resize) }
  }, [open])

  return (
    <>
      <a className="skip-link" href="#rooms">{data.skip}</a>
      <header className={`navbar ${scrolled || open ? 'navbar-solid' : ''}`}>
        <a href="#top" className="wordmark" aria-label={brand.homeLabel} onClick={() => setOpen(false)}>{brand.logo}</a>
        <nav className="desktop-nav" aria-label={data.label}>{data.links.map((link) => <a key={link.href} href={link.href}>{link.label}</a>)}</nav>
        <div className="nav-actions">
          <a href={data.reserve.href} className="nav-reserve" onClick={() => setOpen(false)}>{data.reserve.label}<ArrowUpRight size={16} weight="light" aria-hidden="true" /></a>
          <button ref={toggle} className="menu-toggle" type="button" aria-expanded={open} aria-controls="mobile-menu" aria-label={open ? data.close : data.open} onClick={() => setOpen(!open)}>{open ? <X size={25} weight="light" /> : <List size={25} weight="light" />}</button>
        </div>
        {open && <div id="mobile-menu" className="mobile-menu" ref={menu}><nav aria-label={data.mobileLabel}>{data.links.map((link) => <a key={link.href} href={link.href} onClick={() => setOpen(false)}>{link.label}<ArrowUpRight size={24} weight="light" aria-hidden="true" /></a>)}</nav></div>}
      </header>
    </>
  )
}
