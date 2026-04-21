import { NextRequest } from 'next/server'
import { createServiceRoleClient } from '@/lib/supabase/server'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const username = searchParams.get('username')

  if (!username) {
    return Response.json({ error: 'Username requerido' }, { status: 400 })
  }

  const supabase = createServiceRoleClient()

  const { data, error } = await supabase
    .from('profiles')
    .select('username')
    .eq('username', username)
    .maybeSingle()

  if (error) {
    return Response.json({ error: 'Error al verificar username' }, { status: 500 })
  }

  return Response.json({ available: data === null }, { status: 200 })
}
