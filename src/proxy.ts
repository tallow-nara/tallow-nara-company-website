import { NextResponse, type NextRequest } from 'next/server'

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl
  const adminPath = process.env.ADMIN_PATH

  const isInternal = pathname === '/admin' || pathname.startsWith('/admin/')
  if (isInternal) {
    return NextResponse.rewrite(new URL('/halaman-tidak-ditemukan', request.url))
  }

  if (adminPath && (pathname === adminPath || pathname.startsWith(`${adminPath}/`))) {
    const target = request.nextUrl.clone()
    target.pathname = `/admin${pathname.slice(adminPath.length)}`
    const response = NextResponse.rewrite(target)
    response.headers.set('X-Robots-Tag', 'noindex, nofollow')
    response.headers.set('Cache-Control', 'no-store')
    return response
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!_next/|api/|.*\\..*).*)'],
}
