import { headers } from 'next/headers'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Hotel Chain Demo',
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const headersList = await headers()
  const locale = headersList.get('x-hotel-locale') ?? 'nl'

  return (
    <html lang={locale}>
      <body>{children}</body>
    </html>
  )
}
