import { NextRequest, NextResponse } from 'next/server'

// Dev mapping: poort → hotel folder
const DEV_MAP: Record<string, { folder: string; locales: string[]; default_locale: string }> = {
  '3000': { folder: 'hotel-alfa', locales: ['nl', 'fr'], default_locale: 'nl' },
  '3001': { folder: 'hotel-beta', locales: ['nl', 'en'], default_locale: 'nl' },
}

// Productie mapping: domein → hotel folder
const PROD_MAP: Record<string, { folder: string; locales: string[]; default_locale: string }> = {
  'hotel-chain-demo-git-main-standingout.vercel.app': { folder: 'hotel-alfa', locales: ['nl', 'fr'], default_locale: 'nl' },
  'hotel-chain-demo.vercel.app': { folder: 'hotel-alfa', locales: ['nl', 'fr'], default_locale: 'nl' },
  'project-f2kx6.vercel.app':{ folder: 'hotel-beta', locales: ['nl', 'en'], default_locale: 'nl' }
}

const FALLBACK = { folder: 'hotel-alfa', locales: ['nl', 'fr'], default_locale: 'nl' }

export async function middleware(request: NextRequest) {
  const hostname = request.headers.get('host') ?? ''
  const pathname = request.nextUrl.pathname

  // Skip API routes en statische bestanden
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname.includes('favicon')
  ) {
    return NextResponse.next()
  }

  let config

  const isDev = hostname.includes('localhost')

  if (isDev) {
    const port = hostname.split(':')[1] ?? '3000'
    config = DEV_MAP[port] ?? FALLBACK
  } else {
    const clean = hostname.replace('www.', '')
    config = PROD_MAP[clean] ?? FALLBACK
  }

  const { folder, locales, default_locale } = config

  // Controleer of de URL al een geldige locale heeft
  const firstSegment = pathname.split('/')[1]
  const hasLocale = locales.includes(firstSegment)

  if (!hasLocale) {
    return NextResponse.redirect(
      new URL(`/${default_locale}${pathname}`, request.url)
    )
  }

  // Injecteer hotel info via headers
  const response = NextResponse.next()
  response.headers.set('x-hotel-folder', folder)
  response.headers.set('x-hotel-locales', locales.join(','))
  response.headers.set('x-hotel-locale', firstSegment)
  return response
}

export const config = {
  matcher: ['/((?!_next|api|favicon.ico).*)'],
}