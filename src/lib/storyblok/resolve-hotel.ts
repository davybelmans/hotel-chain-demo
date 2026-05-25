import client from './client'

export interface HotelConfig {
  hotel_name: string
  domain: string
  folder_slug: string
  locales: string[]
  default_locale: string
  primary_color: string
  booking_id: string
  address: string
  phone: string
  email: string
}

let cache: HotelConfig[] | null = null
let cacheTime = 0
const CACHE_TTL = 5 * 60 * 1000 // 5 minuten

export async function getAllHotelConfigs(): Promise<HotelConfig[]> {
  const now = Date.now()
  if (cache && now - cacheTime < CACHE_TTL) return cache

  try {
    const { data } = await client.getStories({
      starts_with: 'hotels/',
      content_type: 'hotel_config',
      per_page: 100,
      version: 'draft',
    })

    interface StoryblokStory {
      content: { locales?: string; [key: string]: unknown }
    }
    cache = data.stories.map((s: StoryblokStory) => ({
      ...s.content,
      locales: s.content.locales?.split(',').map((l: string) => l.trim()) ?? ['nl'],
    })) as HotelConfig[]
    cacheTime = now
  } catch (err) {
    console.error('[Storyblok] Fout bij ophalen hotel configs:', err)
    cache = []
  }

  return cache ?? []
}

export async function getHotelByDomain(hostname: string): Promise<HotelConfig | null> {
  const clean = hostname.replace('www.', '').split(':')[0]
  const configs = await getAllHotelConfigs()
  return configs.find((c) => c.domain === clean) ?? null
}

export async function getHotelByFolder(folder: string): Promise<HotelConfig | null> {
  const configs = await getAllHotelConfigs()
  return configs.find((c) => c.folder_slug === folder) ?? null
}
