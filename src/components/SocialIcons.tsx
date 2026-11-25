type IconProps = { className?: string }

const base = {
  width: 24,
  height: 24,
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.6,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
  'aria-hidden': true,
  focusable: false,
} as const

export function WhatsAppIcon({ className }: IconProps) {
  return (
    <svg {...base} className={className}>
      <path d="M3.5 20.5l1.3-4.6A8.5 8.5 0 1 1 8.2 19.3z" />
      <path d="M9 8.5c0 3.6 2.9 6.5 6.5 6.5l1.1-1.4-2.1-1-.9.8a4.4 4.4 0 0 1-2-2l.8-.9-1-2.1z" />
    </svg>
  )
}

export function InstagramIcon({ className }: IconProps) {
  return (
    <svg {...base} className={className}>
      <rect x="3.5" y="3.5" width="17" height="17" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17" cy="7" r="0.6" />
    </svg>
  )
}

export function EmailIcon({ className }: IconProps) {
  return (
    <svg {...base} className={className}>
      <rect x="3" y="5" width="18" height="14" rx="3" />
      <path d="M4 7.5l8 6 8-6" />
    </svg>
  )
}
