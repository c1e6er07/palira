import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabaseClient'
import { createClient } from '@supabase/supabase-js'

export const revalidate = 0

function generateId(prefix = 'cmp') {
  return `${prefix}_${Math.random().toString(36).slice(2, 10)}`
}

export async function GET() {
  try {
    const url = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
    const serverClient = url && serviceKey ? createClient(url, serviceKey) : undefined
    if (!supabase && !serverClient) {
      return NextResponse.json({ persisted: false, campaigns: [] }, { status: 200 })
    }
    const client = serverClient ?? supabase!
    const { data, error } = await client
      .from('campaigns')
      .select('id,name,slug,status,description,assets,budget,starts_at,ends_at,created_at')
      .order('created_at', { ascending: false })
      .limit(100)
    if (error) return NextResponse.json({ persisted: true, campaigns: [], error: error.message }, { status: 200 })
    return NextResponse.json({ persisted: true, campaigns: data ?? [] }, { status: 200 })
  } catch (err) {
    const message = typeof err === 'object' && err && 'message' in err ? String((err as { message: unknown }).message) : String(err)
    return NextResponse.json({ error: 'internal', message }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({})) as {
      name?: string
      slug?: string
      status?: string
      description?: string
      assets?: Record<string, unknown>
      budget?: number
      starts_at?: string
      ends_at?: string
    }
    const name = typeof body.name === 'string' ? body.name.trim() : ''
    const slug = typeof body.slug === 'string' ? body.slug.trim().toLowerCase() : ''
    if (!name || !slug) return NextResponse.json({ error: 'invalid_input' }, { status: 400 })
    const payload = {
      id: generateId(),
      name,
      slug,
      status: body.status && typeof body.status === 'string' ? body.status : 'draft',
      description: body.description && typeof body.description === 'string' ? body.description : null,
      assets: body.assets && typeof body.assets === 'object' ? body.assets : null,
      budget: typeof body.budget === 'number' ? body.budget : null,
      starts_at: body.starts_at && typeof body.starts_at === 'string' ? body.starts_at : null,
      ends_at: body.ends_at && typeof body.ends_at === 'string' ? body.ends_at : null
    }

    const url = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
    const serverClient = url && serviceKey ? createClient(url, serviceKey) : undefined
    if (!serverClient && !supabase) return NextResponse.json({ ...payload, persisted: false }, { status: 200 })
    const client = serverClient ?? supabase!
    const { error } = await client.from('campaigns').insert(payload).single()
    if (error) return NextResponse.json({ ...payload, persisted: false, error: error.message }, { status: 200 })
    return NextResponse.json({ ...payload, persisted: true }, { status: 200 })
  } catch (err) {
    const message = typeof err === 'object' && err && 'message' in err ? String((err as { message: unknown }).message) : String(err)
    return NextResponse.json({ error: 'internal', message }, { status: 500 })
  }
}

