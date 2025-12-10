import { describe, it, expect, vi } from 'vitest'

vi.mock('@/lib/supabaseClient', () => ({ supabase: undefined }))

import { getProductImageUrl } from '@/lib/images'

describe('getProductImageUrl', () => {
  it('retorna caminho local para imagens kids/', () => {
    expect(getProductImageUrl('kids/hero.svg')).toBe('/kids/hero.svg')
  })

  it('mantém URLs remotas inalteradas', () => {
    const url = 'https://example.com/path/img.png'
    expect(getProductImageUrl(url)).toBe(url)
  })
})

