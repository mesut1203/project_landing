export function Arrow({
  diagonal = false,
  className = '',
}: {
  diagonal?: boolean
  className?: string
}) {
  return (
    <svg
      className={className}
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      aria-hidden="true"
    >
      <path d={diagonal ? 'M5 19 19 5M5 5h14v14' : 'M4 12h15m-6-6 6 6-6 6'} />
    </svg>
  )
}
export function BrandMark() {
  return (
    <svg
      width="38"
      height="38"
      viewBox="0 0 40 40"
      fill="none"
      aria-hidden="true"
    >
      <circle cx="20" cy="20" r="18" stroke="currentColor" strokeWidth="1" />
      <path
        d="m12 28 8-20 8 20-8-5-8 5Z"
        stroke="currentColor"
        strokeWidth="1.2"
      />
      <path d="M20 8v15" stroke="currentColor" strokeWidth="1.2" />
    </svg>
  )
}
