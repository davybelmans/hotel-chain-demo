import { headers } from 'next/headers'
import { getHotelByFolder } from '@/lib/storyblok/resolve-hotel'
import type { Metadata } from 'next'

interface Props {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const headersList = await headers()
  const folder = headersList.get('x-hotel-folder') ?? 'hotel-alfa'
  const hotel = await getHotelByFolder(folder)

  return {
    title: {
      default: hotel?.hotel_name ?? 'Hotel',
      template: `%s | ${hotel?.hotel_name ?? 'Hotel'}`,
    },
  }
}

export default async function LocaleLayout({ children, params }: Props) {
  const { locale } = await params
  const headersList = await headers()
  const folder = headersList.get('x-hotel-folder') ?? 'hotel-alfa'
  const localesHeader = headersList.get('x-hotel-locales') ?? 'nl'
  const locales = localesHeader.split(',')

  const hotel = await getHotelByFolder(folder)
  const primaryColor = hotel?.primary_color ?? '#1a4f6e'

  return (
    <div
      style={{ '--color-primary': primaryColor } as React.CSSProperties}
      className="min-h-screen bg-white text-gray-900"
    >
      {/* Header */}
      <header
        className="sticky top-0 z-50 shadow-md"
        style={{ backgroundColor: 'var(--color-primary)' }}
      >
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <a href={`/${locale}`} className="text-white text-2xl font-bold tracking-tight">
            {hotel?.hotel_name ?? 'Hotel'}
          </a>

          <nav className="flex items-center gap-6">
            <a href={`/${locale}`} className="text-white/80 hover:text-white text-sm transition">
              Home
            </a>
            <a href={`/${locale}/rooms`} className="text-white/80 hover:text-white text-sm transition">
              {locale === 'fr' ? 'Chambres' : locale === 'en' ? 'Rooms' : 'Kamers'}
            </a>
            <a href={`/${locale}/contact`} className="text-white/80 hover:text-white text-sm transition">
              Contact
            </a>

            {/* Taalwisselaar */}
            <div className="flex gap-2 ml-4 border-l border-white/30 pl-4">
              {locales.map((l) => (
                <a
                  key={l}
                  href={`/${l}`}
                  className={`text-xs uppercase font-semibold px-2 py-1 rounded transition ${
                    l === locale
                      ? 'bg-white text-gray-900'
                      : 'text-white/70 hover:text-white'
                  }`}
                >
                  {l}
                </a>
              ))}
            </div>
          </nav>
        </div>
      </header>

      {/* Main content */}
      <main>{children}</main>

      {/* Footer */}
      <footer
        className="mt-16 py-8 text-white/80 text-sm"
        style={{ backgroundColor: 'var(--color-primary)' }}
      >
        <div className="max-w-6xl mx-auto px-4 flex flex-col md:flex-row justify-between gap-4">
          <div>
            <p className="font-bold text-white">{hotel?.hotel_name}</p>
            <p>{hotel?.address}</p>
          </div>
          <div>
            <p>{hotel?.phone}</p>
            <p>{hotel?.email}</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
