import { useEffect, useRef, useState } from 'react'
import { content } from '../data/content'
import { Arrow, BrandMark } from './Icon'

export function Navbar() {
  const [open, setOpen] = useState(false)
  const toggleRef = useRef<HTMLButtonElement>(null)
  useEffect(() => {
    if (!open) return
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setOpen(false)
        toggleRef.current?.focus()
      }
    }
    const onResize = () => {
      if (window.innerWidth >= 768) setOpen(false)
    }
    window.addEventListener('keydown', onKey)
    window.addEventListener('resize', onResize)
    return () => {
      window.removeEventListener('keydown', onKey)
      window.removeEventListener('resize', onResize)
    }
  }, [open])
  return (
    <header className="header">
      <nav className="shell nav-row" aria-label={content.a11y.navigation}>
        <a className="brand" href="#top" aria-label={content.a11y.home}>
          <BrandMark />
          <span>
            {content.brand.name}
            <small>{content.brand.country}</small>
          </span>
        </a>
        <div className="hidden items-center gap-10 md:flex">
          {content.nav.slice(0, 2).map((item) => (
            <a className="nav-link" key={item.href} href={item.href}>
              {item.label}
            </a>
          ))}
        </div>
        <a className="nav-cta hidden md:inline-flex" href="#plan-trip">
          {content.nav[2].label}
          <Arrow diagonal />
        </a>
        <button
          ref={toggleRef}
          type="button"
          className="menu-toggle md:hidden"
          aria-expanded={open}
          aria-controls="mobile-menu"
          aria-label={open ? content.a11y.closeMenu : content.a11y.openMenu}
          onClick={() => setOpen(!open)}
        >
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            aria-hidden="true"
          >
            <path d={open ? 'm6 6 12 12M6 18 18 6' : 'M4 8h16M4 16h16'} />
          </svg>
        </button>
        {open && (
          <div className="mobile-menu" id="mobile-menu">
            {content.nav.map((item) => (
              <a
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
              >
                {item.label}
                <Arrow />
              </a>
            ))}
          </div>
        )}
      </nav>
    </header>
  )
}
