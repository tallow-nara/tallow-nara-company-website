'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

export function NavDashboardLinkClient({ adminRoute }: { adminRoute: string }) {
  const pathname = usePathname()
  const active = pathname === adminRoute || pathname === `${adminRoute}/`

  return (
    <div className="tln-nav-top">
      <Link
        href={adminRoute}
        id="nav-tln-dashboard"
        className={`nav__link${active ? ' tln-nav-active' : ''}`}
        aria-current={active ? 'page' : undefined}
        prefetch={false}
      >
        <span className="nav__link-label">Dasbor</span>
      </Link>
      <a href="/" id="nav-tln-website" className="nav__link" target="_blank" rel="noreferrer">
        <span className="nav__link-label">Lihat website</span>
      </a>
    </div>
  )
}
