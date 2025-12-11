import { NextResponse, type NextRequest } from 'next/server'
import { supabase } from '@/lib/supabaseClient'
import { products as mock } from '@/data/products'

export const revalidate = 0

export async function GET(_: NextRequest, ctx: { params: Promise<{ slug: string }> }) {
  const { slug } = await ctx.params
  if (!supabase) {
    const item = mock.find((p) => p.slug === slug)
    return NextResponse.json(item ?? null, { status: item ? 200 : 404 })
  }
  const { data, error } = await supabase.from('products').select('*').eq('slug', slug).limit(1).single()
  if (error || !data) {
    const item = mock.find((p) => p.slug === slug)
    return NextResponse.json(item ?? null, { status: item ? 200 : 404 })
  }
  return NextResponse.json(data, { status: 200 })
}
