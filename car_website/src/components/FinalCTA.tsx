import { useState } from 'react'
import { ArrowUpRightIcon } from '@phosphor-icons/react'
import { booking, ctas } from '../data/content'
import { ActionLink } from './ActionLink'
import { MediaImage } from './MediaImage'
import { InfoDialog } from './InfoDialog'

export function FinalCTA() {
  const [open, setOpen] = useState(false)
  return (
    <section id={booking.id} className="final-cta" tabIndex={-1} aria-labelledby="drive-title">
      <MediaImage image={booking.image} className="final-visual" />
      <div className="final-shade" aria-hidden="true" />
      <div className="final-copy section-shell">
        <h2 id="drive-title" className="display-heading">{booking.heading}</h2>
        <p>{booking.description}</p>
        {booking.url ? <ActionLink action={{ ...ctas.book, href: booking.url }} /> :
          <button type="button" className="action action--primary" onClick={() => setOpen(true)} aria-haspopup="dialog"><span>{ctas.book.label}</span><ArrowUpRightIcon size={18} aria-hidden="true" /></button>}
      </div>
      <InfoDialog id="booking-info" open={open} onClose={() => setOpen(false)} title={booking.dialogTitle} description={booking.dialogDescription} closeLabel={booking.closeLabel} />
    </section>
  )
}
