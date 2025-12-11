import { NextResponse, type NextRequest } from 'next/server'
import { supabase } from '@/lib/supabaseClient'
import { products as mock } from '@/data/products'

export const revalidate = 0

export async function GET(_: NextRequest, ctx: { params: Promise<{ id: string }> }) {
  const { id } = await ctx.params
  if (!supabase) {
    const item = mock.find((p) => p.id === id)
    return NextResponse.json(item ?? null, { status: item ? 200 : 404 })
  }
  const { data, error } = await supabase.from('products').select('*').eq('id', id).limit(1).single()
  if (error || !data) {
    const item = mock.find((p) => p.id === id)
    return NextResponse.json(item ?? null, { status: item ? 200 : 404 })
  }
  return NextResponse.json(data, { status: 200 })
}
