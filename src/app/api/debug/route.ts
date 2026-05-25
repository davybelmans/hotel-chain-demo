import { headers } from 'next/headers'
import { NextRequest } from 'next/server'

export async function GET(request: NextRequest) {
  const headersList = headers()
  
  return Response.json({
    host: request.headers.get('host'),
    url: request.url,
    'x-hotel-folder': headersList.get('x-hotel-folder'),
    'x-hotel-locale': headersList.get('x-hotel-locale'),
    env_token_set: !!process.env.STORYBLOK_PREVIEW_TOKEN,
  })
}