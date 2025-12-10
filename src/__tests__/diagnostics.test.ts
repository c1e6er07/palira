import { describe, it, expect } from 'vitest'
import { GET } from '@/app/api/db/diagnostics/route'

describe('API diagnostics', () => {
  it('responde com chaves esperadas', async () => {
    const res = await GET()
    const data = await res.json()
    expect(data).toHaveProperty('supabaseConfigured')
    expect(data).toHaveProperty('canQueryProducts')
  })
})

