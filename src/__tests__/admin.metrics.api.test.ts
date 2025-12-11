import { describe, it, expect, vi, beforeEach } from 'vitest'
import { GET } from '@/app/api/admin/metrics/route'

vi.mock('@/lib/supabaseClient', () => ({ supabase: undefined }))

describe('API /api/admin/metrics', () => {
  beforeEach(() => {
    Reflect.deleteProperty(process.env, 'SUPABASE_URL')
    Reflect.deleteProperty(process.env, 'SUPABASE_SERVICE_ROLE_KEY')
    Reflect.deleteProperty(process.env, 'NEXT_PUBLIC_SUPABASE_URL')
    Reflect.deleteProperty(process.env, 'NEXT_PUBLIC_SUPABASE_ANON_KEY')
  })

  it('retorna métricas com persisted=false quando sem supabase', async () => {
    const res = await GET()
    expect(res.status).toBe(200)
    const data = await res.json()
    expect(data.persisted).toBe(false)
    expect(typeof data.ordersCount).toBe('number')
    expect(typeof data.revenueTotal).toBe('number')
    expect(typeof data.subscriptionsCount).toBe('number')
    expect(typeof data.eventsCount).toBe('number')
  })
})

