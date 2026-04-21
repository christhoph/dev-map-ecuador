import { NextRequest } from 'next/server'

export async function POST(_req: NextRequest) {
  return Response.json({ message: 'ok' }, { status: 200 })
}
