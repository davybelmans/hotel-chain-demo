import { RoomCard } from './RoomCard'

interface RoomCardBlok {
  _uid: string
  name: string
  description?: string | null
  price_from?: number
  image?: { filename: string; alt?: string }
}

interface RoomGridBlok {
  title?: string
  rooms: RoomCardBlok[]
}

export function RoomGrid({ blok }: { blok: RoomGridBlok }) {
  return (
    <section className="py-16 px-4 max-w-6xl mx-auto">
      {blok.title && (
        <h2 className="text-3xl font-bold mb-8 text-center">{blok.title}</h2>
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {blok.rooms?.map((room) => (
          <RoomCard key={room._uid} blok={room} />
        ))}
      </div>
    </section>
  )
}
