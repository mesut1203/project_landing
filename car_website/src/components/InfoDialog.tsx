import { useEffect, useRef } from 'react'
import type { ReactNode } from 'react'
import { XIcon } from '@phosphor-icons/react'

interface InfoDialogProps {
  id: string
  open: boolean
  onClose: () => void
  title: string
  description: string
  closeLabel: string
  children?: ReactNode
}

export function InfoDialog({ id, open, onClose, title, description, closeLabel, children }: InfoDialogProps) {
  const ref = useRef<HTMLDialogElement>(null)
  useEffect(() => {
    const dialog = ref.current
    if (!dialog || !open) return
    const previousFocus = document.activeElement as HTMLElement | null
    const previousOverflow = document.body.style.overflow
    dialog.showModal()
    document.body.style.overflow = 'hidden'
    return () => { dialog.close(); document.body.style.overflow = previousOverflow; previousFocus?.focus({ preventScroll: true }) }
  }, [open])
  return <dialog ref={ref} id={id} className="info-dialog" aria-labelledby={`${id}-heading`} aria-describedby={`${id}-description`}
    onCancel={(event) => { event.preventDefault(); onClose() }}
    onClick={(event) => { if (event.target === event.currentTarget) onClose() }}>
    <div className="info-dialog-inner">
      <button type="button" className="icon-button dialog-close" aria-label={closeLabel} onClick={onClose}><XIcon size={24} /></button>
      <h2 id={`${id}-heading`} className="display-heading">{title}</h2>
      <p id={`${id}-description`} className="body-copy">{description}</p>
      {children}
    </div>
  </dialog>
}
