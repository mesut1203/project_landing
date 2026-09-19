import { useEffect, useRef, useState } from 'react'
import { ArrowUpRight, List, X } from '@phosphor-icons/react'
import type { NavbarContent } from '../data/content'

interface NavbarProps {
  data: NavbarContent
}

export function Navbar({ data }: NavbarProps) {
  const [open, setOpen] = useState(false)
  const [active, setActive] = useState('')
  const toggleRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && open) {
        setOpen(false)
        toggleRef.current?.focus()
      }
    }
    const desktop = window.matchMedia('(min-width: 768px)')
    const closeOnDesktop = () => {
      if (desktop.matches) setOpen(false)
    }
    document.addEventListener('keydown', closeOnEscape)
    desktop.addEventListener('change', closeOnDesktop)
    return () => {
      document.removeEventListener('keydown', closeOnEscape)
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
            <ArrowUpRight size={18} />
          </a>
          <button
            ref={toggleRef}
            className="icon-button menu-toggle"
            aria-label={open ? data.closeMenuLabel : data.openMenuLabel}
            aria-expanded={open}
            aria-controls="mobile-navigation"
            onClick={() => setOpen(!open)}
          >
            {open ? <X size={24} /> : <List size={24} />}
          </button>
        </div>
      </div>
      <nav
        id="mobile-navigation"
        className="mobile-links"
        aria-label={data.mobileNavigationLabel}
        hidden={!open}
      >
        {data.links.map((link) => (
          <a key={link.href} href={link.href} onClick={() => setOpen(false)}>
            {link.label}
            <ArrowUpRight size={20} />
          </a>
        ))}
        <a className="button button-sun" href={data.cta.href} onClick={() => setOpen(false)}>
          {data.cta.label}
          <ArrowUpRight size={18} />
        </a>
      </nav>
    </header>
  )
}
