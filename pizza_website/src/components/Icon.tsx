type IconName = 'arrow' | 'down' | 'menu' | 'close' | 'pause' | 'play'
const paths: Record<IconName, string> = {
  arrow: 'M5 19 19 5M5 5h14v14', down: 'M12 4v16M5 13l7 7 7-7',
  menu: 'M4 8h16M4 16h16', close: 'm6 6 12 12M6 18 18 6',
  pause: 'M8 5v14M16 5v14', play: 'm8 4 12 8-12 8Z',
}
export function Icon({ name, className = '' }: { name: IconName; className?: string }) {
  return <svg className={`icon ${className}`} width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d={paths[name]} /></svg>
}
