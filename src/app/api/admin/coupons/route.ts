import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabaseClient'
import { createClient } from '@supabase/supabase-js'

export const revalidate = 0

export async function GET() {
  try {
    const url = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
    const serverClient = url && serviceKey ? createClient(url, serviceKey) : undefined
    if (!supabase && !serverClient) {
      return NextResponse.json({ persisted: false, coupons: [] }, { status: 200 })
    }
    const client = serverClient ?? supabase!
    const { data, error } = await client
      .from('coupons')
      .select('code,description,discount_percent,discount_value,active,usage_limit,used_count,min_purchase,starts_at,expires_at,created_at')
      .order('created_at', { ascending: false })
      .limit(100)
    if (error) return NextResponse.json({ persisted: true, coupons: [], error: error.message }, { status: 200 })
    return NextResponse.json({ persisted: true, coupons: data ?? [] }, { status: 200 })
  } catch (err) {
    const message = typeof err === 'object' && err && 'message' in err ? String((err as { message: unknown }).message) : String(err)
    return NextResponse.json({ error: 'internal', message }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({})) as {
      code?: string
      description?: string
      discount_percent?: number
      discount_value?: number
      active?: boolean
      usage_limit?: number
      min_purchase?: number
      starts_at?: string
      expires_at?: string
    }
    const code = typeof body.code === 'string' ? body.code.trim().toUpperCase() : ''
    if (!code) return NextResponse.json({ error: 'invalid_input' }, { status: 400 })
    const payload = {
      code,
      description: body.description && typeof body.description === 'string' ? body.description : null,
      discount_percent: typeof body.discount_percent === 'number' ? body.discount_percent : null,
      discount_value: typeof body.discount_value === 'number' ? body.discount_value : null,
      active: typeof body.active === 'boolean' ? body.active : true,
      usage_limit: typeof body.usage_limit === 'number' ? body.usage_limit : null,
      used_count: 0,
      min_purchase: typeof body.min_purchase === 'number' ? body.min_purchase : null,
      starts_at: body.starts_at && typeof body.starts_at === 'string' ? body.starts_at : null,
      expires_at: body.expires_at && typeof body.expires_at === 'string' ? body.expires_at : null
    }

    const url = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
    const serverClient = url && serviceKey ? createClient(url, serviceKey) : undefined
    if (!serverClient && !supabase) return NextResponse.json({ ...payload, persisted: false }, { status: 200 })
    const client = serverClient ?? supabase!
    const { error } = await client.from('coupons').insert(payload).single()
    if (error) return NextResponse.json({ ...payload, persisted: false, error: error.message }, { status: 200 })
    return NextResponse.json({ ...payload, persisted: true }, { status: 200 })
  } catch (err) {
    const message = typeof err === 'object' && err && 'message' in err ? String((err as { message: unknown }).message) : String(err)
    return NextResponse.json({ error: 'internal', message }, { status: 500 })
  }
}

