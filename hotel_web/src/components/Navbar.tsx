import { useEffect, useRef, useState } from 'react'
import { ArrowUpRight } from '@phosphor-icons/react'
import { content } from '../data/content'

interface NavbarProps { data: typeof content.nav; brand: typeof content.brand }
export function Navbar({ data, brand }: NavbarProps) {
  const [open, setOpen] = useState(false)
  const toggle = useRef<HTMLButtonElement>(null)
  const menu = useRef<HTMLDialogElement>(null)

  useEffect(() => {
    const dialog = menu.current
    if (!dialog) return
    if (!open) { dialog.close(); return }
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    dialog.showModal()
    dialog.querySelector<HTMLAnchorElement>('nav a')?.focus()
    const desktop = window.matchMedia('(min-width: 768px)')
    const resize = () => { if (desktop.matches) setOpen(false) }
    desktop.addEventListener('change', resize)
    return () => { dialog.close(); document.body.style.overflow = previousOverflow; desktop.removeEventListener('change', resize) }
  }, [open])

  const close = () => { setOpen(false); requestAnimationFrame(() => toggle.current?.focus()) }
  return <>
    <a className="skip-link" href="#rooms">{data.skip}</a>
    <header className="navbar">
      <a href="#top" className="wordmark" aria-label={brand.homeLabel}><span className="hotel-monogram" aria-hidden="true">a.</span><span className="hotel-brand-name">{brand.logo}<small>HOTEL & RETREAT</small></span></a>
      <nav className="desktop-nav" aria-label={data.label}>{data.links.map(link => <a key={link.href} href={link.href}>{link.label}</a>)}</nav>
      <div className="nav-actions">
        <a href={data.reserve.href} className="nav-reserve">{data.reserve.label}<ArrowUpRight size={16} weight="light" aria-hidden="true" /></a>
        <button ref={toggle} className={`menu-toggle ${open ? 'is-open' : ''}`} type="button" aria-expanded={open} aria-controls="mobile-menu" aria-haspopup="dialog" aria-label={open ? data.close : data.open} onClick={() => setOpen(!open)}><span className="menu-lines" aria-hidden="true"><i /><i /></span></button>
      </div>
    </header>
    <dialog id="mobile-menu" className="mobile-menu" ref={menu} aria-label={data.mobileLabel} onCancel={close}>
      <div className="menu-heading"><a className="wordmark" href="#top" onClick={close}>{brand.logo}</a><button className="menu-toggle is-open" aria-label={data.close} onClick={close}><span className="menu-lines" aria-hidden="true"><i /><i /></span></button></div>
      <p className="eyebrow">A slower world awaits</p>
      <nav aria-label={data.mobileLabel}>{data.links.map((link, index) => <a key={link.href} href={link.href} onClick={close}><span className="menu-number">0{index + 1}</span>{link.label}<ArrowUpRight size={24} weight="light" aria-hidden="true" /></a>)}</nav>
      <a className="nav-reserve menu-reserve" href={data.reserve.href} onClick={close}>{data.reserve.label}<ArrowUpRight size={18} weight="light" aria-hidden="true" /></a>
      <p className="menu-signature">The art of a slower stay.</p>
    </dialog>
  </>
}
