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
  const { data, error } = await supabase.from('products').select('id,title,price,image,description,brand,age_group,stock,category,slug,created_at,rating').eq('slug', slug).limit(1).single()
  if (error && error.code !== 'PGRST116') return NextResponse.json({ error: error.message }, { status: 500 })
  if (!data) return NextResponse.json(null, { status: 404 })
  return NextResponse.json(data, { status: 200 })
}
