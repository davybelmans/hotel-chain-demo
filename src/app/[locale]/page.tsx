import { headers } from 'next/headers'
import { StoryblokRenderer } from '@/components/StoryblokRenderer'
import client from '@/lib/storyblok/client'

interface Props {
  params: Promise<{ locale: string }>
}

export default async function LocalePage({ params }: Props) {
  const { locale } = await params
  const headersList = await headers()
  const folder = headersList.get('x-hotel-folder') ?? 'hotel-alfa'

  let bloks: { component: string; _uid: string; [key: string]: unknown }[] = []

  try {
    const { data } = await client.getStory(`hotels/${folder}/pages/home`, {
      version: 'published',
      language: locale,
    })
    bloks = data.story.content.body ?? []
  } catch (err) {
    console.error('[Page] Storyblok fetch error:', err)
  }

  if (bloks.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
        <h1 className="text-3xl font-bold mb-4" style={{ color: 'var(--color-primary)' }}>
          Welkom
        </h1>
        <p className="text-gray-500 max-w-md">
          Geen content gevonden. Maak een story aan in Storyblok met slug{' '}
          <code className="bg-gray-100 px-2 py-0.5 rounded text-sm">{folder}/home</code>{' '}
          en voeg blokken toe.
        </p>
      </div>
    )
  }

  return <StoryblokRenderer bloks={bloks} />
}
