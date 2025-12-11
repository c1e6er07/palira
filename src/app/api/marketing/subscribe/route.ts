import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabaseClient'
import { createClient } from '@supabase/supabase-js'

export const revalidate = 0

function generateId(prefix = 'ns') {
  return `${prefix}_${Math.random().toString(36).slice(2, 10)}`
}

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({})) as { email?: string; name?: string; source?: string }
    const email = typeof body.email === 'string' ? body.email.trim().toLowerCase() : ''
    const name = typeof body.name === 'string' ? body.name.trim() : ''
    const source = typeof body.source === 'string' ? body.source.trim() : 'web'
    if (!email || !isValidEmail(email)) return NextResponse.json({ error: 'invalid_email' }, { status: 400 })

    const payload = {
      email,
      name: name || null,
      confirmed: false,
      source,
      unsubscribe_token: generateId('unsub'),
      unsubscribed_at: null
    }

    const url = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
    const serverClient = url && serviceKey ? createClient(url, serviceKey) : undefined
    if (!serverClient && !supabase) return NextResponse.json({ persisted: false, email }, { status: 200 })
    const client = serverClient ?? supabase!
    const { error } = await client.from('newsletter_subscriptions').insert(payload).single()
    if (error) return NextResponse.json({ persisted: false, email, error: error.message }, { status: 200 })
    return NextResponse.json({ persisted: true, email }, { status: 200 })
  } catch (err) {
    const message = typeof err === 'object' && err && 'message' in err ? String((err as { message: unknown }).message) : String(err)
    return NextResponse.json({ error: 'internal', message }, { status: 500 })
  }
}

