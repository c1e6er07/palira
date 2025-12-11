import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const WEB_HOST = 'palira.onrender.com'
const MOBILE_HOST = 'palira-mobile.onrender.com'

function isMobile(req: NextRequest): boolean {
  const ch = req.headers.get('sec-ch-ua-mobile')
  if (ch && (ch.includes('1') || ch.includes('?1'))) return true
  const ua = req.headers.get('user-agent') || ''
  return /Android|iPhone|iPad|iPod|Mobile/i.test(ua)
}

export default function middleware(req: NextRequest) {
  const url = req.nextUrl
  const hostname = url.hostname
  const path = url.pathname

  if (hostname === WEB_HOST && isMobile(req)) {
    if (path.startsWith('/api') || path.startsWith('/_next')) {
      return NextResponse.next()
    }
    const redirectUrl = new URL(url)
    redirectUrl.protocol = 'https'
    redirectUrl.hostname = MOBILE_HOST
    return NextResponse.redirect(redirectUrl, 302)
  }
  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!_next|api|favicon.ico).*)']
}
