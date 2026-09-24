import { useEffect, useRef, useState } from 'react'
import { content } from '../data/content'
import { Arrow, BrandMark } from './Icon'

export function Navbar() {
  const [open, setOpen] = useState(false)
  const toggleRef = useRef<HTMLButtonElement>(null)
  const dialogRef = useRef<HTMLDialogElement>(null)
  const closeMenu = () => {
    dialogRef.current?.close()
    setOpen(false)
    requestAnimationFrame(() =>
      toggleRef.current?.focus({ preventScroll: true }),
    )
  }
  useEffect(() => {
    if (!open) return
    dialogRef.current?.showModal()
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = previousOverflow
    }
  }, [open])
  useEffect(() => {
    if (!open) return
    const onResize = () => {
      if (
        toggleRef.current &&
        getComputedStyle(toggleRef.current).display === 'none'
      )
        setOpen(false)
    }
    window.addEventListener('resize', onResize)
    return () => {
      window.removeEventListener('resize', onResize)
    }
  }, [open])
  return (
    <>
      <header className="header">
        <nav className="shell nav-row" aria-label={content.a11y.navigation}>
          <a className="brand" href="#top" aria-label={content.a11y.home}>
            <BrandMark />
            <span>
              {content.brand.name}
              <small>{content.brand.country}</small>
            </span>
          </a>
          <div className="desktop-nav">
            {content.nav.slice(0, 2).map((item) => (
              <a className="nav-link" key={item.href} href={item.href}>
                {item.label}
              </a>
            ))}
          </div>
          <a className="nav-cta desktop-cta" href="#plan-trip">
            {content.nav[2].label}
            <Arrow diagonal />
          </a>
          <button
            ref={toggleRef}
            type="button"
            className="menu-toggle"
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={content.a11y.openMenu}
            onClick={() => setOpen(!open)}
          >
            <span className="hamburger" aria-hidden="true">
              <span />
              <span />
            </span>
          </button>
        </nav>
      </header>
      {open && (
        <dialog
          ref={dialogRef}
          id="mobile-menu"
          className="menu-dialog"
          aria-label={content.a11y.navigation}
          onCancel={(event) => {
            event.preventDefault()
            closeMenu()
          }}
          onKeyDown={(event) => {
            if (event.key !== 'Tab') return
            const controls = Array.from(
              event.currentTarget.querySelectorAll<HTMLElement>(
                'a[href], button:not([disabled])',
              ),
            )
            const first = controls[0]
            const last = controls[controls.length - 1]
            if (event.shiftKey && document.activeElement === first) {
              event.preventDefault()
              last?.focus()
            } else if (!event.shiftKey && document.activeElement === last) {
              event.preventDefault()
              first?.focus()
            }
          }}
        >
          <div className="menu-dialog-header">
            <a className="brand" href="#top" onClick={closeMenu}>
              <BrandMark />
              <span>
                Nomad<small>VIETNAM</small>
              </span>
            </a>
            <button
              type="button"
              className="menu-close"
              aria-label={content.a11y.closeMenu}
              onClick={closeMenu}
            >
              <span className="hamburger" aria-hidden="true">
                <span />
                <span />
              </span>
            </button>
          </div>
          <p className="menu-kicker">THE ART OF GETTING LOST</p>
          <nav
            className="menu-dialog-links"
            aria-label={content.a11y.navigation}
          >
            {content.nav.map((item, index) => (
              <a key={item.href} href={item.href} onClick={closeMenu}>
                <small>0{index + 1}</small>
                <span>{item.label}</span>
                <Arrow diagonal />
              </a>
            ))}
          </nav>
          <p className="menu-footer-note">Đi xa hơn. Sống chậm lại.</p>
        </dialog>
      )}
    </>
  )
}
