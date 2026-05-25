interface HeroBlok {
  title: string
  subtitle: string
  image?: { filename: string; alt?: string }
  cta_text?: string
  cta_url?: string
}

export function Hero({ blok }: { blok: HeroBlok }) {
  return (
    <section className="relative h-[80vh] flex items-center justify-center text-white overflow-hidden">
      {/* Achtergrond afbeelding */}
      {blok.image?.filename ? (
        <img
          src={blok.image.filename + '/m/1920x1080'}
          alt={blok.image.alt ?? blok.title}
          className="absolute inset-0 w-full h-full object-cover"
        />
      ) : (
        <div className="absolute inset-0 bg-gradient-to-br from-gray-700 to-gray-900" />
      )}

      {/* Overlay */}
      <div className="absolute inset-0 bg-black/45" />

      {/* Content */}
      <div className="relative z-10 text-center px-4 max-w-3xl">
        <h1 className="text-5xl md:text-6xl font-bold mb-4 leading-tight">
          {blok.title}
        </h1>
        {blok.subtitle && (
          <p className="text-xl md:text-2xl text-white/85 mb-8">
            {blok.subtitle}
          </p>
        )}
        {blok.cta_url && blok.cta_text && (
          <a
            href={blok.cta_url}
            className="inline-block px-8 py-3 rounded-lg font-semibold text-white transition hover:opacity-90 hover:scale-105"
            style={{ backgroundColor: 'var(--color-primary)' }}
          >
            {blok.cta_text}
          </a>
        )}
      </div>
    </section>
  )
}
