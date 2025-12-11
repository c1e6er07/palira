import { describe, it, expect, vi, beforeEach } from 'vitest'
import { POST } from '@/app/api/marketing/events/route'
import type { NextRequest } from 'next/server'

vi.mock('@/lib/supabaseClient', () => ({ supabase: undefined }))

type MockReq<T> = { json: () => Promise<T> }

describe('API /api/marketing/events', () => {
  beforeEach(() => {
    Reflect.deleteProperty(process.env, 'SUPABASE_URL')
    Reflect.deleteProperty(process.env, 'SUPABASE_SERVICE_ROLE_KEY')
    Reflect.deleteProperty(process.env, 'NEXT_PUBLIC_SUPABASE_URL')
    Reflect.deleteProperty(process.env, 'NEXT_PUBLIC_SUPABASE_ANON_KEY')
  })

  it('POST sem supabase persiste=false', async () => {
    const req: MockReq<{ type: string }> = { json: async () => ({ type: 'visit' }) }
    const res = await POST(req as unknown as NextRequest)
    expect(res.status).toBe(200)
    const data = await res.json()
    expect(data.persisted).toBe(false)
  })
})

