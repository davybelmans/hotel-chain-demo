import { revalidatePath } from 'next/cache'
import { NextRequest } from 'next/server'

export async function POST(request: NextRequest) {
  const secret = request.nextUrl.searchParams.get('secret')

  if (secret !== process.env.REVALIDATE_SECRET) {
    return Response.json({ error: 'Ongeldig secret' }, { status: 401 })
  }

  try {
    const body = await request.json()
    console.log('Revalidatie aangevraagd voor:', body.full_slug)

    // Revalideer alle pagina's (eenvoudigste aanpak voor demo)
    revalidatePath('/', 'layout')

    return Response.json({ revalidated: true, slug: body.full_slug })
  } catch {
    return Response.json({ error: 'Revalidatie mislukt' }, { status: 500 })
  }
}
