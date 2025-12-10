import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabaseClient'

export const revalidate = 0

type Item = { id: string; title: string; price: number; qty: number }

function calcTotal(items: Item[]) {
  return items.reduce((acc, i) => acc + i.price * i.qty, 0)
}

function generateId(prefix = 'pi') {
  return `${prefix}_${Math.random().toString(36).slice(2, 10)}`
}

function buildPixCode(amount: number) {
  const value = amount.toFixed(2)
  const parts = [
    '000201',
    '26580014BR.GOV.BCB.PIX',
    '0114palira-imports',
    `5407${value}`,
    '5802BR',
    '5909PALIRA K',
    '6009SAO PAULO',
    '62070503***',
    '6304ABCD'
  ]
  return parts.join('')
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({})) as { items?: Item[]; method?: 'pix' | 'card'; action?: 'create' | 'confirm'; intentId?: string; card?: { number?: string; name?: string; exp?: string; cvc?: string } }
    const items = Array.isArray(body.items) ? body.items : []
    const method = body.method || 'pix'
    const action = body.action || 'create'

    if (action === 'confirm' && body.intentId) {
      return NextResponse.json({ status: 'succeeded', intentId: body.intentId })
    }

    if (!items.length) return NextResponse.json({ error: 'empty_cart' }, { status: 400 })
    const amount = calcTotal(items)
    const intentId = generateId('pi')

    if (method === 'pix') {
      const expiresAt = new Date(Date.now() + 15 * 60 * 1000).toISOString()
      const copyPaste = buildPixCode(amount)
      return NextResponse.json({ intentId, method, amount, pix: { copyPaste, expiresAt } })
    }

    if (method === 'card') {
      const card = body.card || {}
      const valid = Boolean(card.number && card.name && card.exp && card.cvc)
      if (!valid) return NextResponse.json({ error: 'invalid_card' }, { status: 400 })
      return NextResponse.json({ intentId, method, amount, status: 'authorized' })
    }

    return NextResponse.json({ error: 'unsupported_method' }, { status: 400 })
  } catch (err) {
    const message = typeof err === 'object' && err && 'message' in err ? String((err as { message: unknown }).message) : String(err)
    return NextResponse.json({ error: 'internal', message }, { status: 500 })
  }
}

