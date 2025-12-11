import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabaseClient'
import { createClient } from '@supabase/supabase-js'

export const revalidate = 0

function generateId(prefix = 'evt') {
  return `${prefix}_${Math.random().toString(36).slice(2, 10)}`
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({})) as { type?: string; payload?: Record<string, unknown>; campaignId?: string }
    const type = typeof body.type === 'string' ? body.type.trim() : ''
    const payload = body.payload && typeof body.payload === 'object' ? body.payload : {}
    const campaignId = typeof body.campaignId === 'string' ? body.campaignId : null
    if (!type) return NextResponse.json({ error: 'invalid_input' }, { status: 400 })

    const sessionId = (req as unknown as { headers?: { get?: (k: string) => string | null } }).headers?.get?.('x-session-id') || null
    const userId = null

    const record = {
      id: generateId(),
      type,
      payload,
      campaign_id: campaignId,
      session_id: sessionId,
      user_id: userId
    }

    const url = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
    const serverClient = url && serviceKey ? createClient(url, serviceKey) : undefined
    if (!serverClient && !supabase) return NextResponse.json({ persisted: false, type }, { status: 200 })
    const client = serverClient ?? supabase!
    const { error } = await client.from('marketing_events').insert(record).single()
    if (error) return NextResponse.json({ persisted: false, type, error: error.message }, { status: 200 })
    return NextResponse.json({ persisted: true, type }, { status: 200 })
  } catch (err) {
    const message = typeof err === 'object' && err && 'message' in err ? String((err as { message: unknown }).message) : String(err)
    return NextResponse.json({ error: 'internal', message }, { status: 500 })
  }
}
