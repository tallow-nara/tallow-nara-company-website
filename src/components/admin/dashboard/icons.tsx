import type { ReactNode } from 'react'

function Svg({ children, size = 24 }: { children: ReactNode; size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      {children}
    </svg>
  )
}

export const IconWallet = () => (
  <Svg>
    <path d="M4 7.5A2.5 2.5 0 0 1 6.5 5H18v3" />
    <rect x="4" y="8" width="16" height="11" rx="2.5" />
    <path d="M16 13.5h.01" />
  </Svg>
)

export const IconBag = () => (
  <Svg>
    <path d="M5 8h14l-1 11.5a1.5 1.5 0 0 1-1.5 1.5h-9A1.5 1.5 0 0 1 6 19.5z" />
    <path d="M9 8V6.5a3 3 0 0 1 6 0V8" />
  </Svg>
)

export const IconUsers = () => (
  <Svg>
    <circle cx="9" cy="8.5" r="3.5" />
    <path d="M2.5 20a6.5 6.5 0 0 1 13 0" />
    <path d="M16 5.2a3.5 3.5 0 0 1 0 6.6M18 14.5a6.5 6.5 0 0 1 3.5 5.5" />
  </Svg>
)

export const IconBox = () => (
  <Svg>
    <path d="M3.5 7.5 12 3l8.5 4.5v9L12 21l-8.5-4.5z" />
    <path d="M3.5 7.5 12 12l8.5-4.5M12 12v9" />
  </Svg>
)

export const IconArrowUp = () => (
  <Svg size={16}>
    <path d="M12 19V5M6 11l6-6 6 6" />
  </Svg>
)

export const IconArrowDown = () => (
  <Svg size={16}>
    <path d="M12 5v14M6 13l6 6 6-6" />
  </Svg>
)

export const IconChevronRight = () => (
  <Svg size={16}>
    <path d="m9 6 6 6-6 6" />
  </Svg>
)

export const IconPlus = () => (
  <Svg size={18}>
    <path d="M12 5v14M5 12h14" />
  </Svg>
)

export const IconExternal = () => (
  <Svg size={18}>
    <path d="M14 4h6v6M20 4l-9 9" />
    <path d="M18 14v4.5a1.5 1.5 0 0 1-1.5 1.5h-11A1.5 1.5 0 0 1 4 18.5v-11A1.5 1.5 0 0 1 5.5 6H10" />
  </Svg>
)

export const IconAlert = () => (
  <Svg size={16}>
    <path d="M12 4 2.5 20h19z" />
    <path d="M12 10v4M12 17h.01" />
  </Svg>
)

export const IconHome = () => (
  <Svg size={20}>
    <path d="M4 10.5 12 4l8 6.5V19a1 1 0 0 1-1 1h-4.5v-6h-5v6H5a1 1 0 0 1-1-1z" />
  </Svg>
)

export const IconImages = () => (
  <Svg size={20}>
    <rect x="3" y="5" width="18" height="14" rx="2.5" />
    <circle cx="9" cy="10" r="1.5" />
    <path d="m21 16-5-5-8 8" />
  </Svg>
)

export const IconHelp = () => (
  <Svg size={20}>
    <circle cx="12" cy="12" r="9" />
    <path d="M9.5 9.5a2.5 2.5 0 1 1 3.5 2.3c-.6.3-1 .8-1 1.5v.2M12 17h.01" />
  </Svg>
)

export const IconInfo = () => (
  <Svg size={20}>
    <circle cx="12" cy="12" r="9" />
    <path d="M12 11v5M12 8h.01" />
  </Svg>
)
