import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Hotel Chain Demo',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
