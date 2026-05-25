interface RoomCardBlok {
  name: string
  description?: string | null
  price_from?: number
  image?: { filename: string; alt?: string }
}

export function RoomCard({ blok }: { blok: RoomCardBlok }) {
  return (
    <div className="rounded-xl overflow-hidden shadow-lg border border-gray-100 bg-white">
      {blok.image?.filename && (
        <img
          src={blok.image.filename + '/m/800x500'}
          alt={blok.image.alt ?? blok.name}
          className="w-full h-56 object-cover"
        />
      )}
      <div className="p-6">
        <h3 className="text-xl font-bold mb-2">{blok.name}</h3>
        {blok.price_from && (
          <p className="text-sm font-semibold mb-3" style={{ color: 'var(--color-primary)' }}>
            Vanaf €{blok.price_from} / nacht
          </p>
        )}
        <a
          href="#"
          className="inline-block mt-2 px-5 py-2 rounded-lg text-sm font-semibold text-white transition hover:opacity-90"
          style={{ backgroundColor: 'var(--color-primary)' }}
        >
          Boek nu
        </a>
      </div>
    </div>
  )
}
