import { useEffect, useRef, useState } from 'react'
import { ArrowLeftIcon, ArrowRightIcon, ArrowUpRightIcon, XIcon } from '@phosphor-icons/react'
import { gallery } from '../data/content'
import { MediaImage } from './MediaImage'

export function Gallery() {
  const [selected, setSelected] = useState<number | null>(null)
  const ref = useRef<HTMLDialogElement>(null)
  const closeRef = useRef<HTMLButtonElement>(null)
  const open = selected !== null
  const navigate = (direction: number) => setSelected((current) => ((current ?? 0) + direction + gallery.images.length) % gallery.images.length)

  useEffect(() => {
    const dialog = ref.current
    if (!dialog || !open) return
    const previousFocus = document.activeElement as HTMLElement | null
    const previousOverflow = document.body.style.overflow
    dialog.showModal()
    document.body.style.overflow = 'hidden'
    closeRef.current?.focus()
    return () => { dialog.close(); document.body.style.overflow = previousOverflow; previousFocus?.focus({ preventScroll: true }) }
  }, [open])

  return (
    <section id={gallery.id} className="gallery-section section-shell" tabIndex={-1} aria-labelledby="gallery-title">
      <div className="gallery-header"><p className="eyebrow">{gallery.label}</p><h2 id="gallery-title" className="display-heading">{gallery.heading}</h2></div>
      <div className="gallery-grid">
        {gallery.images.map((image, index) => (
          <figure key={image.id} className={`gallery-item gallery-item--${index}`}>
            <button type="button" className="gallery-image-button" onClick={() => setSelected(index)} aria-haspopup="dialog" aria-label={`${gallery.openLabel} ${image.caption}`}>
              <MediaImage image={image} /><span className="gallery-open" aria-hidden="true"><ArrowUpRightIcon size={22} /></span>
            </button>
            <figcaption>{image.caption}</figcaption>
          </figure>
        ))}
      </div>
      <dialog ref={ref} className="lightbox" aria-label={gallery.label} onCancel={(event) => { event.preventDefault(); setSelected(null) }}
        onKeyDown={(event) => {
          if (event.key === 'ArrowRight') { event.preventDefault(); navigate(1) }
          if (event.key === 'ArrowLeft') { event.preventDefault(); navigate(-1) }
        }}>
        <button ref={closeRef} type="button" className="icon-button lightbox-close" aria-label={gallery.closeLabel} onClick={() => setSelected(null)}><XIcon size={28} /></button>
        {selected !== null && <figure className="lightbox-figure">
          <MediaImage key={selected} image={gallery.images[selected]} eager />
          <figcaption aria-live="polite">{gallery.images[selected].caption}</figcaption>
        </figure>}
        <div className="lightbox-controls">
          <button type="button" className="icon-button" onClick={() => navigate(-1)} aria-label={gallery.previousLabel}><ArrowLeftIcon size={24} /></button>
          <button type="button" className="icon-button" onClick={() => navigate(1)} aria-label={gallery.nextLabel}><ArrowRightIcon size={24} /></button>
        </div>
      </dialog>
    </section>
  )
}
