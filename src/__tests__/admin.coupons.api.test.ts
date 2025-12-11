import { describe, it, expect, vi, beforeEach } from 'vitest'
import { GET, POST } from '@/app/api/admin/coupons/route'
import type { NextRequest } from 'next/server'

vi.mock('@/lib/supabaseClient', () => ({ supabase: undefined }))

type MockReq<T> = { json: () => Promise<T> }

describe('API /api/admin/coupons', () => {
  beforeEach(() => {
    Reflect.deleteProperty(process.env, 'SUPABASE_URL')
    Reflect.deleteProperty(process.env, 'SUPABASE_SERVICE_ROLE_KEY')
    Reflect.deleteProperty(process.env, 'NEXT_PUBLIC_SUPABASE_URL')
    Reflect.deleteProperty(process.env, 'NEXT_PUBLIC_SUPABASE_ANON_KEY')
  })

  it('GET sem supabase retorna lista vazia', async () => {
    const res = await GET()
    expect(res.status).toBe(200)
    const data = await res.json()
    expect(data.persisted).toBe(false)
    expect(Array.isArray(data.coupons)).toBe(true)
  })

  it('POST sem supabase persiste=false', async () => {
    const req: MockReq<{ code: string }> = { json: async () => ({ code: 'PROMO10' }) }
    const res = await POST(req as unknown as NextRequest)
    expect(res.status).toBe(200)
    const data = await res.json()
    expect(data.persisted).toBe(false)
  })
})

