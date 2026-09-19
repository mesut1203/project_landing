export function focusAnchor(href: string): void {
  const target = document.getElementById(href.replace(/^#/, ''))
  if (!target) return
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  target.scrollIntoView({ behavior: reduced ? 'instant' : 'smooth', block: 'start' })
  target.focus({ preventScroll: true })
  history.replaceState(null, '', href)
}
