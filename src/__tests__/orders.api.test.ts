import { describe, it, expect, vi, beforeEach } from 'vitest'

vi.mock('@/lib/supabaseClient', () => ({ supabase: undefined }))

import { POST, GET } from '@/app/api/orders/route'

type MockReq<T> = { json: () => Promise<T> }

describe('API /api/orders', () => {
  beforeEach(() => {
    Reflect.deleteProperty(process.env, 'SUPABASE_URL')
    Reflect.deleteProperty(process.env, 'SUPABASE_SERVICE_ROLE_KEY')
    Reflect.deleteProperty(process.env, 'NEXT_PUBLIC_SUPABASE_URL')
    Reflect.deleteProperty(process.env, 'NEXT_PUBLIC_SUPABASE_ANON_KEY')
  })

  it('POST sem supabase persiste=false', async () => {
    const req: MockReq<{ items: Array<{ id: string; title: string; price: number; qty: number }> }> = {
      json: async () => ({ items: [{ id: 'x', title: 't', price: 5, qty: 3 }] }),
    }
    const res = await POST(req as any)
    expect(res.status).toBe(200)
    const data = await res.json()
    expect(data.persisted).toBe(false)
    expect(Array.isArray(data.items)).toBe(true)
  })

  it('GET sem supabase retorna lista vazia', async () => {
    const res = await GET()
    expect(res.status).toBe(200)
    const data = await res.json()
    expect(data.persisted).toBe(false)
    expect(Array.isArray(data.orders)).toBe(true)
  })
})
