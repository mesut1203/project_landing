import { useEffect, useRef } from 'react'
import type { RefObject } from 'react'
import { ArrowUpRightIcon } from '@phosphor-icons/react'
import { brand, navigation, ctas } from '../data/content'
import { focusAnchor } from '../lib/anchors'

interface MobileMenuProps {
  open: boolean
  onClose: () => void
  triggerRef: RefObject<HTMLButtonElement | null>
}

export function MobileMenu({ open, onClose, triggerRef }: MobileMenuProps) {
  const dialogRef = useRef<HTMLDialogElement>(null)
  const closeRef = useRef<HTMLButtonElement>(null)
  const destination = useRef<string | null>(null)

  useEffect(() => {
    const dialog = dialogRef.current
    if (!dialog || !open) return
    destination.current = null
    const previousOverflow = document.body.style.overflow
    const trigger = triggerRef.current
    dialog.showModal()
    document.body.style.overflow = 'hidden'
    closeRef.current?.focus()
    return () => {
      dialog.close()
      document.body.style.overflow = previousOverflow
      if (destination.current) focusAnchor(destination.current)
      else trigger?.focus({ preventScroll: true })
    }
  }, [open, triggerRef])

  return (
    <dialog ref={dialogRef} id="mobile-navigation" className="mobile-menu" aria-labelledby="menu-heading"
      onCancel={(event) => { event.preventDefault(); onClose() }}
      onKeyDown={(event) => {
        if (event.key !== 'Tab') return
        const items = dialogRef.current?.querySelectorAll<HTMLElement>('a[href], button')
        if (!items?.length) return
        const first = items[0], last = items[items.length - 1]
        if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus() }
        if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus() }
      }}>
      <div className="menu-header"><span className="wordmark">{brand.logo}</span>
        <button ref={closeRef} type="button" className="icon-button" onClick={onClose} aria-label={navigation.closeLabel}><span className="morph-lines is-open" aria-hidden="true"><span /><span /></span></button>
      </div>
      <h2 id="menu-heading" className="sr-only">{navigation.menuLabel}</h2>
      <nav aria-label={navigation.label} className="menu-links">
        {[...navigation.links, ctas.book].map((link) => (
          <a key={link.href} href={link.href} onClick={(event) => {
            event.preventDefault(); destination.current = link.href; onClose()
          }}><span>{link.label}</span><ArrowUpRightIcon weight="light" size={30} aria-hidden="true" /></a>
        ))}
      </nav>
      <p className="menu-signoff">{storyLine}</p>
    </dialog>
  )
}

const storyLine = brand.description
