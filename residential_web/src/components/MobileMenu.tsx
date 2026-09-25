import { useEffect, useRef } from 'react'
import { ArrowTopRightIcon } from '@radix-ui/react-icons'
import { content } from '../data/content'
import { Brand } from './Brand'

interface MobileMenuProps { open: boolean; onClose: () => void }

export function MobileMenu({ open, onClose }: MobileMenuProps) {
  const dialog = useRef<HTMLDialogElement>(null)
  const firstLink = useRef<HTMLAnchorElement>(null)

  useEffect(() => {
    const element = dialog.current
    if (!element) return
    if (!open) { element.close(); return }
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    element.showModal()
    firstLink.current?.focus()
    return () => {
      element.close()
      document.body.style.overflow = previousOverflow
    }
  }, [open])

  const navigate = (href: string) => {
    onClose()
    requestAnimationFrame(() => requestAnimationFrame(() => {
      document.querySelector<HTMLElement>(href)?.focus({ preventScroll: true })
    }))
  }

  return <dialog ref={dialog} id="mobile-menu" className="mobile-menu" aria-labelledby="menu-title"
    onCancel={onClose} onClick={event => { if (event.target === event.currentTarget) onClose() }}
    onKeyDown={event => {
      if (event.key !== 'Tab') return
      const focusable = Array.from(event.currentTarget.querySelectorAll<HTMLElement>('a[href], button:not([disabled])'))
      const first = focusable[0]
      const last = focusable[focusable.length - 1]
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last?.focus() }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first?.focus() }
    }}>
    <div className="menu-inner">
      <div className="flex items-center justify-between">
        <div onClick={onClose}><Brand /></div>
        <button className="icon-button menu-toggle is-open" aria-label={content.navigation.close} onClick={onClose}><span className="menu-lines" aria-hidden="true"><i /><i /></span></button>
      </div>
      <p id="menu-title" className="mt-14 text-sm text-muted">{content.navigation.menuTitle}</p>
      <nav className="menu-links" aria-label={content.navigation.label} onKeyDown={event => {
        if (!['ArrowDown', 'ArrowUp', 'Home', 'End'].includes(event.key)) return
        const links = Array.from(event.currentTarget.querySelectorAll('a'))
        const index = links.indexOf(document.activeElement as HTMLAnchorElement)
        const next = event.key === 'Home' ? 0 : event.key === 'End' ? links.length - 1 : (index + (event.key === 'ArrowDown' ? 1 : -1) + links.length) % links.length
        event.preventDefault()
        links[next]?.focus()
      }}>
        {content.navigation.links.map((link, index) => <a key={link.href} ref={index === 0 ? firstLink : undefined}
          href={link.href} onClick={() => navigate(link.href)}>{link.label}<ArrowTopRightIcon /></a>)}
      </nav>
      <a className="button button-gold mt-12" href={content.actions.viewing.href} onClick={() => navigate(content.actions.viewing.href)}>
        {content.actions.viewing.label}<ArrowTopRightIcon />
      </a>
    </div>
  </dialog>
}
