import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabaseClient'
import { createClient } from '@supabase/supabase-js'

export const revalidate = 0

export async function GET() {
  try {
    const url = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
    const serverClient = url && serviceKey ? createClient(url, serviceKey) : undefined
    if (!supabase && !serverClient) {
      return NextResponse.json({ persisted: false, ordersCount: 0, revenueTotal: 0, subscriptionsCount: 0, eventsCount: 0 }, { status: 200 })
    }
    const client = serverClient ?? supabase!

    let ordersCount = 0
    let revenueTotal = 0
    let subscriptionsCount = 0
    let eventsCount = 0

    try {
      const { count } = await client.from('orders').select('id', { count: 'estimated', head: true })
      ordersCount = count ?? 0
      const { data: totals } = await client.from('orders').select('total').limit(1000)
      revenueTotal = Array.isArray(totals) ? totals.reduce((a, r) => a + (typeof (r as { total: number }).total === 'number' ? (r as { total: number }).total : 0), 0) : 0
    } catch {}

    try {
      const { count } = await client.from('newsletter_subscriptions').select('email', { count: 'estimated', head: true })
      subscriptionsCount = count ?? 0
    } catch {}

    try {
      const { count } = await client.from('marketing_events').select('id', { count: 'estimated', head: true })
      eventsCount = count ?? 0
    } catch {}

    return NextResponse.json({ persisted: true, ordersCount, revenueTotal, subscriptionsCount, eventsCount }, { status: 200 })
  } catch (err) {
    const message = typeof err === 'object' && err && 'message' in err ? String((err as { message: unknown }).message) : String(err)
    return NextResponse.json({ error: 'internal', message }, { status: 500 })
  }
}

