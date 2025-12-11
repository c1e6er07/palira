// @vitest-environment jsdom
import { describe, it, expect, vi } from 'vitest'
vi.mock('@/lib/supabaseClient', () => ({ supabase: undefined }))
vi.mock('next/navigation', async () => {
  const actual = await vi.importActual('next/navigation')
  return { ...actual, useParams: () => ({ locale: 'pt-BR' }), useRouter: () => ({ replace: vi.fn() }) }
})
import { render, screen } from '@testing-library/react'
import Marketing from '@/app/[locale]/marketing/page'

describe('Marketing page', () => {
  it('bloqueia acesso sem usuário', async () => {
    render(<Marketing />)
    expect(await screen.findByText('Acesso restrito')).toBeTruthy()
  })
})
