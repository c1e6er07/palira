import { describe, it, expect } from 'vitest'
import { POST } from '@/app/api/checkout/route'

type MockReq<T> = { json: () => Promise<T> }

describe('API /api/checkout', () => {
  it('retorna 400 quando carrinho vazio', async () => {
    const req: MockReq<{ items: unknown[] }> = { json: async () => ({ items: [] }) }
    const res = await POST(req)
    expect(res.status).toBe(400)
  })

  it('cria intenção PIX com código copia-e-cola', async () => {
    const req: MockReq<{ method: 'pix'; items: Array<{ id: string; title: string; price: number; qty: number }> }> = {
      json: async () => ({ method: 'pix', items: [{ id: 'a', title: 't', price: 10, qty: 2 }] }),
    }
    const res = await POST(req)
    expect(res.status).toBe(200)
    const data = await res.json()
    expect(data.method).toBe('pix')
    expect(data.pix).toBeDefined()
    expect(typeof data.pix.copyPaste).toBe('string')
    expect(typeof data.pix.expiresAt).toBe('string')
  })

  it('confirma intenção PIX e retorna succeeded', async () => {
    const req: MockReq<{ action: 'confirm'; intentId: string }> = { json: async () => ({ action: 'confirm', intentId: 'pi_123' }) }
    const res = await POST(req)
    expect(res.status).toBe(200)
    const data = await res.json()
    expect(data.status).toBe('succeeded')
  })
})
