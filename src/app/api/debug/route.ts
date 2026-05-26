import { headers } from 'next/headers'
import { NextRequest } from 'next/server'
import client from '@/lib/storyblok/client'

export async function GET(request: NextRequest) {
  const headersList = await headers()
  const folder = headersList.get('x-hotel-folder') ?? 'hotel-alfa'

  const storySlug = `hotels/${folder}/pages/home`
  let storyResult: unknown = null
  let storyError: string | null = null

  try {
    const { data } = await client.getStory(storySlug, {
      version: 'published',
    })
    storyResult = {
      name: data.story.name,
      full_slug: data.story.full_slug,
      content_component: data.story.content?.component,
      body_blocks: data.story.content?.body?.length ?? 0,
    }
  } catch (err) {
    storyError = JSON.stringify(err, Object.getOwnPropertyNames(err instanceof Error ? err : Object(err)))
  }

  return Response.json({
    host: request.headers.get('host'),
    url: request.url,
    'x-hotel-folder': folder,
    'x-hotel-locale': headersList.get('x-hotel-locale'),
    env_token_set: !!process.env.STORYBLOK_PREVIEW_TOKEN,
    story_slug_tried: storySlug,
    story: storyResult,
    story_error: storyError,
  })
}
