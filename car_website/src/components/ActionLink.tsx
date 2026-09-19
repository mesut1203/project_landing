import { ArrowUpRightIcon } from '@phosphor-icons/react'
import type { LinkContent } from '../data/content'
import { focusAnchor } from '../lib/anchors'

interface ActionLinkProps { action: LinkContent; variant?: 'primary' | 'outline' | 'text'; className?: string }

export function ActionLink({ action, variant = 'primary', className = '' }: ActionLinkProps) {
  return (
    <a href={action.href} className={`action action--${variant} ${className}`}
      onClick={(event) => {
        if (action.href.startsWith('#')) { event.preventDefault(); focusAnchor(action.href) }
      }}>
      <span>{action.label}</span><ArrowUpRightIcon size={18} aria-hidden="true" />
    </a>
  )
}
