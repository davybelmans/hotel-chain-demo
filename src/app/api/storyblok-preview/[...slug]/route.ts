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
 * slug param = ['hotels', 'hotel-beta', 'pages', 'home']
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string[] }> }
) {
  const { slug } = await params
  // slug = ['hotels', 'hotel-beta', 'pages', 'home']

  const folder = slug[1]   // hotel-beta
  const pageSlug = slug[3] // home, rooms, contact, …

  const hotel = await getHotelByFolder(folder)
  const locale = hotel?.default_locale ?? 'nl'

  let targetPath: string
  if (!pageSlug || pageSlug === 'home') {
    targetPath = `/${locale}`
  } else {
    targetPath = `/${locale}/${pageSlug}`
  }

  const base = `${request.nextUrl.protocol}//${request.nextUrl.host}`
  return NextResponse.redirect(new URL(targetPath, base))
}
