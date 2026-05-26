import { NextRequest, NextResponse } from 'next/server'
import { getHotelByFolder } from '@/lib/storyblok/resolve-hotel'

/**
 * Storyblok Visual Editor preview redirect.
 *
 * Storyblok appends the story slug to the preview URL, e.g.:
 *   preview URL:  https://project-f2kx6.vercel.app/api/storyblok-preview/
 *   story slug:   hotels/hotel-beta/pages/home
 *   → GET /api/storyblok-preview/hotels/hotel-beta/pages/home
 *
 * We extract the folder + page and redirect to the real URL.
 */
export async function GET(request: NextRequest) {
  const pathname = request.nextUrl.pathname
  // pathname = /api/storyblok-preview/hotels/hotel-beta/pages/home
  const afterPrefix = pathname.replace('/api/storyblok-preview/', '')
  const parts = afterPrefix.split('/')
  // parts = ['hotels', 'hotel-beta', 'pages', 'home']

  const folder = parts[1] // hotel-beta
  const pageSlug = parts[3] // home, rooms, contact, …

  const hotel = await getHotelByFolder(folder)
  const locale = hotel?.default_locale ?? 'nl'

  // Map Storyblok page slugs to real URL paths
  let targetPath: string
  if (!pageSlug || pageSlug === 'home') {
    targetPath = `/${locale}`
  } else {
    targetPath = `/${locale}/${pageSlug}`
  }

  const base = `${request.nextUrl.protocol}//${request.nextUrl.host}`
  return NextResponse.redirect(new URL(targetPath, base))
}
