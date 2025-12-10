import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabaseClient'
import { createClient } from '@supabase/supabase-js'

export const revalidate = 0

function generateId(prefix = 'ord') {
  return `${prefix}_${Math.random().toString(36).slice(2, 10)}`
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({})) as { items?: Array<{ id: string; title: string; price: number; qty: number }>; total?: number; method?: 'pix' | 'card'; intentId?: string }
    const items = Array.isArray(body.items) ? body.items : []
    const total = typeof body.total === 'number' ? body.total : items.reduce((a, i) => a + i.price * i.qty, 0)
    const method = body.method || 'pix'
    const intentId = body.intentId || null
    if (!items.length) return NextResponse.json({ error: 'empty_items' }, { status: 400 })

    const id = generateId()
    const payload = { id, total, method, items, status: 'paid', intent_id: intentId }

    const url = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
    const serverClient = url && serviceKey ? createClient(url, serviceKey) : undefined

    if (!supabase && !serverClient) {
      return NextResponse.json({ ...payload, persisted: false })
    }

    const client = serverClient ?? supabase!
    const { error } = await client.from('orders').insert({ id, total, payment_method: method, items, status: 'paid', intent_id: intentId }).single()
    if (error) {
      return NextResponse.json({ ...payload, persisted: false, error: error.message }, { status: 200 })
    }
    return NextResponse.json({ ...payload, persisted: true })
  } catch (err) {
    const message = typeof err === 'object' && err && 'message' in err ? String((err as { message: unknown }).message) : String(err)
    return NextResponse.json({ error: 'internal', message }, { status: 500 })
  }
}

export async function GET() {
  try {
    if (!supabase) return NextResponse.json({ persisted: false, orders: [] }, { status: 200 })
    const { data, error } = await supabase
      .from('orders')
      .select('id,total,payment_method,items,status,intent_id,created_at')
      .order('created_at', { ascending: false })
      .limit(50)
    if (error) return NextResponse.json({ persisted: true, orders: [], error: error.message }, { status: 200 })
    return NextResponse.json({ persisted: true, orders: data ?? [] }, { status: 200 })
  } catch (err) {
    const message = typeof err === 'object' && err && 'message' in err ? String((err as { message: unknown }).message) : String(err)
    return NextResponse.json({ error: 'internal', message }, { status: 500 })
  }
}
