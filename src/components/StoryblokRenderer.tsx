import { Hero } from './blocks/Hero'
import { RoomCard } from './blocks/RoomCard'
import { RoomGrid } from './blocks/RoomGrid'

type StoryblokBlok = { component: string; _uid: string; [key: string]: unknown }

// Voeg hier nieuwe blokken toe naarmate je ze aanmaakt
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const components: Record<string, React.ComponentType<any>> = {
  hero: Hero,
  room_card: RoomCard,
  room_grid: RoomGrid,
}

interface Props {
  bloks: StoryblokBlok[]
}

export function StoryblokRenderer({ bloks }: Props) {
  if (!bloks?.length) {
    return (
      <div className="p-12 text-center text-gray-400">
        Geen content gevonden. Voeg blokken toe in Storyblok.
      </div>
    )
  }

  return (
    <>
      {bloks.map((blok) => {
        const Component = components[blok.component]

        if (!Component) {
          return (
            <div key={blok._uid} className="p-4 m-4 bg-yellow-50 border border-yellow-200 rounded text-sm text-yellow-800">
              ⚠️ Onbekend blok: <code>{blok.component}</code> — voeg het toe in StoryblokRenderer.tsx
            </div>
          )
        }

        return <Component key={blok._uid} blok={blok} />
      })}
    </>
  )
}
