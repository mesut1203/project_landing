import { useEffect, useRef, useState } from 'react'
import { ArrowUpRight } from '@phosphor-icons/react'
import type { NavbarContent } from '../data/content'

interface NavbarProps {
  data: NavbarContent
}

export function Navbar({ data }: NavbarProps) {
  const [open, setOpen] = useState(false)
  const [active, setActive] = useState('')
  const toggleRef = useRef<HTMLButtonElement>(null)
  const dialogRef = useRef<HTMLDialogElement>(null)
  const closeMenu = () => {
    dialogRef.current?.close()
    setOpen(false)
    requestAnimationFrame(() => toggleRef.current?.focus({ preventScroll: true }))
  }

  useEffect(() => {
    if (!open) return
    dialogRef.current?.showModal()
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = previousOverflow }
  }, [open])

  useEffect(() => {
    const desktop = window.matchMedia('(min-width: 768px)')
    const closeOnDesktop = () => {
      if (desktop.matches) setOpen(false)
    }
    desktop.addEventListener('change', closeOnDesktop)
    return () => {
      desktop.removeEventListener('change', closeOnDesktop)
    }
  }, [open])

  useEffect(() => {
    if (!('IntersectionObserver' in window)) return
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) if (entry.isIntersecting) setActive(`#${entry.target.id}`)
      },
      { rootMargin: '-15% 0px -55% 0px' },
    )
    for (const id of ['home', 'learning-paths', 'community', 'signup']) {
      const element = document.getElementById(id)
      if (element) observer.observe(element)
    }
    return () => observer.disconnect()
  }, [])

  return (
    <>
    <header className="site-nav">
      <div className="container nav-inner">
        <a href="#home" className="wordmark" aria-label={data.homeLabel}>
          <span className="brand-symbol" aria-hidden="true">
            <ArrowUpRight weight="bold" />
          </span>
          {data.brand}
        </a>
        <nav className="desktop-links" aria-label={data.navigationLabel}>
          {data.links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              aria-current={active === link.href ? 'location' : undefined}
            >
              {link.label}
            </a>
          ))}
        </nav>
        <div className="nav-actions">
          <a className="button button-sun nav-cta" href={data.cta.href}>
            {data.cta.label}
            <ArrowUpRight size={18} weight="light" />
          </a>
          <button
            ref={toggleRef}
            className="icon-button menu-toggle"
            aria-label={data.openMenuLabel}
            aria-expanded={open}
            aria-controls="mobile-navigation"
            onClick={() => setOpen(!open)}
          >
            <span className="hamburger" aria-hidden="true"><span /><span /></span>
          </button>
        </div>
      </div>
    </header>
    {open && (
      <dialog ref={dialogRef} id="mobile-navigation" className="menu-dialog" aria-label={data.mobileNavigationLabel}
        onCancel={(event) => { event.preventDefault(); closeMenu() }}
        onKeyDown={(event) => {
          if (event.key !== 'Tab') return
          const controls = Array.from(event.currentTarget.querySelectorAll<HTMLElement>('a[href], button:not([disabled])'))
          const first = controls[0]
          const last = controls[controls.length - 1]
          if (event.shiftKey && document.activeElement === first) {
            event.preventDefault()
            last?.focus()
          } else if (!event.shiftKey && document.activeElement === last) {
            event.preventDefault()
            first?.focus()
          }
        }}>
        <div className="menu-dialog-header">
          <a href="#home" className="wordmark" onClick={closeMenu}>{data.brand}</a>
          <button type="button" className="icon-button menu-close" aria-label={data.closeMenuLabel} onClick={closeMenu}>
            <span className="hamburger" aria-hidden="true"><span /><span /></span>
          </button>
        </div>
        <p className="menu-kicker">MAKE SPACE FOR WHAT’S NEXT</p>
        <nav className="menu-dialog-links" aria-label={data.mobileNavigationLabel}>
          {data.links.map((link, index) => (
            <a key={link.href} href={link.href} onClick={closeMenu}>
              <small>0{index + 1}</small><span>{link.label}</span><ArrowUpRight weight="light" />
            </a>
          ))}
          <a className="button button-navy" href={data.cta.href} onClick={closeMenu}>
            {data.cta.label}<ArrowUpRight weight="light" />
          </a>
        </nav>
        <p className="menu-footer-note">Stay curious. Keep moving.</p>
      </dialog>
    )}
    </>

  )
}
