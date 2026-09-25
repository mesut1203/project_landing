import { useEffect, useRef, useState } from 'react'
import { Icon } from './Icon'
const links = [{ href: '#story', name: 'Our story' }, { href: '#menu', name: 'Menu' }, { href: '#visit', name: 'Visit' }]

export function Header() {
  const [open, setOpen] = useState(false)
  const [active, setActive] = useState(() => window.location.hash)
  const header = useRef<HTMLElement>(null)
  const inner = useRef<HTMLDivElement>(null)
  const toggle = useRef<HTMLButtonElement>(null)
  useEffect(() => {
    const updateOffset = () => {
      if (inner.current) document.documentElement.style.setProperty('--header-offset', `${inner.current.getBoundingClientRect().height}px`)
    }
    const observer = 'ResizeObserver' in window ? new ResizeObserver(updateOffset) : null
    if (inner.current) observer?.observe(inner.current)
    updateOffset()
    window.addEventListener('resize', updateOffset, { passive: true })
    return () => {
      observer?.disconnect()
      window.removeEventListener('resize', updateOffset)
      document.documentElement.style.removeProperty('--header-offset')
    }
  }, [])
  useEffect(() => {
    const hashChange = () => { setActive(window.location.hash); setOpen(false) }
    window.addEventListener('hashchange', hashChange)
    return () => window.removeEventListener('hashchange', hashChange)
  }, [])
  useEffect(() => {
    if (!open) return
    const keydown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') { setOpen(false); toggle.current?.focus() }
      if (event.key === 'Tab') {
        const items = Array.from(header.current?.querySelectorAll<HTMLElement>('a, button') ?? []).filter(item => item.getClientRects().length)
        const first = items[0], last = items[items.length - 1]
        if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last?.focus() }
        if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first?.focus() }
      }
    }
    const outside = (event: PointerEvent) => {
      if (!header.current?.contains(event.target as Node)) setOpen(false)
    }
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const background = Array.from(document.querySelectorAll<HTMLElement>('main, footer'))
    background.forEach(element => { element.inert = true })
    const desktop = matchMedia('(min-width: 768px)')
    const resize = () => { if (desktop.matches) setOpen(false) }
    document.addEventListener('keydown', keydown)
    document.addEventListener('pointerdown', outside)
    desktop.addEventListener('change', resize)
    return () => {
      document.removeEventListener('keydown', keydown)
      document.removeEventListener('pointerdown', outside)
      desktop.removeEventListener('change', resize)
      document.body.style.overflow = previousOverflow
      background.forEach(element => { element.inert = false })
    }
  }, [open])
  return <header className={`site-header${open ? ' is-open' : ''}`} ref={header} role={open ? 'dialog' : undefined} aria-modal={open ? true : undefined} aria-label={open ? 'Navigation' : undefined} onClick={event => { if (event.target === event.currentTarget) setOpen(false) }}>
    <div className="header-inner container" ref={inner}>
      <a className="wordmark header-logo" href="#home" aria-label="Fiamma Pizza House home" onClick={() => setOpen(false)}>fiamma.</a>
      <span className="header-note">Wood-fired pizza. Good company.</span>
      <nav className="main-nav" aria-label="Main navigation">
        {links.map(link => <a className="nav-link" key={link.href} href={link.href} aria-current={active === link.href ? 'location' : undefined}>{link.name}</a>)}
      </nav>
      <div className="header-actions">
        <a className="button header-book" href="#visit" onClick={() => setOpen(false)}>Book a table <Icon name="arrow" className="button-arrow" /></a>
        <button ref={toggle} className="menu-toggle" type="button" aria-label={open ? 'Close navigation' : 'Open navigation'} aria-expanded={open} aria-controls="mobile-navigation" onClick={() => setOpen(!open)}><span className="hamburger-lines" aria-hidden="true"><span /><span /></span></button>
      </div>
    </div>
    <nav id="mobile-navigation" className="mobile-nav container" aria-label="Mobile navigation" hidden={!open}>
      {links.map((link, index) => <a key={link.href} href={link.href} aria-current={active === link.href ? 'location' : undefined} onClick={() => setOpen(false)}><span className="nav-number">0{index + 1}</span>{link.name}<Icon name="arrow" /></a>)}
      <p>A good night starts here.</p>
    </nav>
  </header>
}
