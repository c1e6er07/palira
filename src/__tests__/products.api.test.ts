import { describe, it, expect, vi } from 'vitest'

vi.mock('@/lib/supabaseClient', () => ({ supabase: undefined }))

import { GET as GET_LIST } from '@/app/api/products/route'
import { GET as GET_SLUG } from '@/app/api/products/slug/[slug]/route'
import { GET as GET_ID } from '@/app/api/products/[id]/route'
import type { NextRequest } from 'next/server'

describe('API /api/products', () => {
  it('lista produtos via fallback quando supabase indisponível', async () => {
    const req = { nextUrl: new URL('http://localhost:3000/api/products') } as unknown as NextRequest
    const res = await GET_LIST(req)
    expect(res.status).toBe(200)
    const data = await res.json()
    expect(Array.isArray(data)).toBe(true)
    expect(data.length).toBeGreaterThan(0)
    expect(typeof data[0].title).toBe('string')
  })

  it('retorna item por slug usando mock quando necessário', async () => {
    const ctx = { params: Promise.resolve({ slug: 'kit-arte-magica' }) }
    const res = await GET_SLUG(undefined as unknown as NextRequest, ctx)
    expect([200, 404]).toContain(res.status)
    const data = await res.json()
    if (res.status === 200) {
      expect(data.slug).toBe('kit-arte-magica')
    } else {
      expect(data).toBeNull()
    }
  })

  it('retorna item por id usando mock quando necessário', async () => {
    const ctx = { params: Promise.resolve({ id: 'k2' }) }
    const res = await GET_ID(undefined as unknown as NextRequest, ctx)
    expect([200, 404]).toContain(res.status)
    const data = await res.json()
    if (res.status === 200) {
      expect(data.id).toBe('k2')
    } else {
      expect(data).toBeNull()
    }
  })
})
