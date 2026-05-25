import { NextRequest, NextResponse } from 'next/server'

// Dev mapping: poort → hotel folder
const DEV_MAP: Record<string, { folder: string; locales: string[]; default_locale: string }> = {
  '3000': { folder: 'hotel-alfa', locales: ['nl', 'fr'], default_locale: 'nl' },
  '3001': { folder: 'hotel-beta', locales: ['nl', 'en'], default_locale: 'nl' },
}

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

  let folder: string
  let locales: string[]
  let defaultLocale: string

  const isDev = hostname.includes('localhost')

  if (isDev) {
    // In development: gebruik poort om hotel te bepalen
    const port = hostname.split(':')[1] ?? '3000'
    const devConfig = DEV_MAP[port] ?? DEV_MAP['3000']
    folder = devConfig.folder
    locales = devConfig.locales
    defaultLocale = devConfig.default_locale
  } else {
    // In productie: ophalen via API
    const res = await fetch(
      `${request.nextUrl.origin}/api/hotel-config?domain=${hostname.replace('www.', '')}`
    )
    if (!res.ok) {
      return NextResponse.rewrite(new URL('/not-found', request.url))
    }
    const config = await res.json()
    folder = config.folder_slug
    locales = config.locales
    defaultLocale = config.default_locale
  }

  // Controleer of de URL al een geldige locale heeft
  const firstSegment = pathname.split('/')[1]
  const hasLocale = locales.includes(firstSegment)

  if (!hasLocale) {
    // Redirect naar default locale
    return NextResponse.redirect(
      new URL(`/${defaultLocale}${pathname}`, request.url)
    )
  }

  // Injecteer hotel info via headers voor gebruik in pages/layouts
  const response = NextResponse.next()
  response.headers.set('x-hotel-folder', folder)
  response.headers.set('x-hotel-locales', locales.join(','))
  response.headers.set('x-hotel-locale', firstSegment)
  return response
}

export const config = {
  matcher: ['/((?!_next|api|favicon.ico).*)'],
}
