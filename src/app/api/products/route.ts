import { NextResponse, type NextRequest } from 'next/server'
import { supabase } from '@/lib/supabaseClient'
import { products as mock } from '@/data/products'

export const revalidate = 0

export async function GET(req: NextRequest) {
  try {
    const category = req.nextUrl.searchParams.get('category')
    const min = req.nextUrl.searchParams.get('min')
    const max = req.nextUrl.searchParams.get('max')
    const age = req.nextUrl.searchParams.get('age')
    if (!supabase) return NextResponse.json(mock)
    let query = supabase.from('products').select('*')
    if (category) {
      try {
        query = query.eq('category', category)
      } catch {}
    }
    if (min) {
      const n = Number(min)
      if (!Number.isNaN(n)) query = query.gte('price', n)
    }
    if (max) {
      const n = Number(max)
      if (!Number.isNaN(n)) query = query.lte('price', n)
    }
    if (age) {
      query = query.eq('age_group', age)
    }
    const { data, error } = await query.limit(24)
    if (error || !data) return NextResponse.json(mock)
    return NextResponse.json(data)
  } catch {
    return NextResponse.json(mock, { status: 200 })
  }
}
