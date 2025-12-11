'use client'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'
import type { User } from '@supabase/supabase-js'
import { useParams, useRouter } from 'next/navigation'

export default function Admin() {
  const [ready, setReady] = useState(false)
  const [user, setUser] = useState<User | null>(null)
  const params = useParams() as { locale?: string }
  const locale = params?.locale || 'pt-BR'
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [metrics, setMetrics] = useState<{ ordersCount: number; revenueTotal: number; subscriptionsCount: number; eventsCount: number } | null>(null)
  const [campaigns, setCampaigns] = useState<Array<{ id: string; name: string; slug: string; status: string }>>([])
  const [coupons, setCoupons] = useState<Array<{ code: string; description?: string; discount_percent?: number; discount_value?: number; active?: boolean }>>([])
  const [newCamp, setNewCamp] = useState<{ name: string; slug: string }>({ name: '', slug: '' })
  const [newCoupon, setNewCoupon] = useState<{ code: string; discount_percent: string }>({ code: '', discount_percent: '' })
  type Campaign = { id: string; name: string; slug: string; status: string }
  type Coupon = { code: string; description?: string; discount_percent?: number; discount_value?: number; active?: boolean }

  useEffect(() => {
    let mounted = true
    ;(async () => {
      try {
        const u = supabase ? await supabase.auth.getUser() : { data: { user: null } }
        if (!mounted) return
        setUser(u.data.user)
      } finally {
        setReady(true)
      }
    })()
    return () => {
      mounted = false
    }
  }, [])

  if (!ready) return <div className="flex min-h-screen items-center justify-center">Carregando...</div>
  if (!user)
    return (
      <div className="flex min-h-screen flex-col items-center kids-gradient-bg pt-28 pb-20">
        <main className="container max-w-md text-center">
          <h1 className="text-2xl font-black text-[var(--foreground)] mb-4">Acesso restrito</h1>
          <p className="mb-6">Faça login para acessar o painel administrativo.</p>
          <button className="bubble-link" onClick={() => router.replace(`/${locale}/login`)}>Ir para Login</button>
        </main>
      </div>
    )

  return (
    <div className="flex min-h-screen flex-col items-center kids-gradient-bg pt-28 pb-20">
      <main className="container flex flex-col gap-8">
        <h1 className="text-3xl font-black text-[var(--foreground)]">Painel Administrativo</h1>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
          <div className="rounded-xl border bg-white/90 p-6 shadow">
            <div className="text-sm font-bold text-[var(--foreground)]/70">Pedidos</div>
            <div className="mt-2 text-3xl font-black text-[var(--brand-1)]">{metrics?.ordersCount ?? '-'}</div>
          </div>
          <div className="rounded-xl border bg-white/90 p-6 shadow">
            <div className="text-sm font-bold text-[var(--foreground)]/70">Receita</div>
            <div className="mt-2 text-3xl font-black text-[var(--brand-1)]">{typeof metrics?.revenueTotal === 'number' ? `R$ ${metrics!.revenueTotal.toFixed(2)}` : '-'}</div>
          </div>
          <div className="rounded-xl border bg-white/90 p-6 shadow">
            <div className="text-sm font-bold text-[var(--foreground)]/70">Newsletter</div>
            <div className="mt-2 text-3xl font-black text-[var(--brand-1)]">{metrics?.subscriptionsCount ?? '-'}</div>
          </div>
          <div className="rounded-xl border bg-white/90 p-6 shadow">
            <div className="text-sm font-bold text-[var(--foreground)]/70">Eventos</div>
            <div className="mt-2 text-3xl font-black text-[var(--brand-1)]">{metrics?.eventsCount ?? '-'}</div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div className="rounded-xl border bg-white/90 p-6 shadow">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-[var(--foreground)]">Campanhas</h2>
              <button className="bubble-link" onClick={async () => {
                setLoading(true)
                try {
                  const res = await fetch('/api/admin/campaigns', { cache: 'no-store' })
                  const data = await res.json()
                  setCampaigns(Array.isArray(data.campaigns) ? (data.campaigns as Campaign[]).map((c) => ({ id: c.id, name: c.name, slug: c.slug, status: c.status })) : [])
                } finally {
                  setLoading(false)
                }
              }}>Atualizar</button>
            </div>
            <div className="mt-4 grid grid-cols-3 text-xs font-bold">
              <div>Nome</div>
              <div>Slug</div>
              <div>Status</div>
            </div>
            <div>
              {campaigns.map((c) => (
                <div key={c.id} className="grid grid-cols-3 items-center border-t border-[var(--brand-2)]/10 text-sm">
                  <div className="px-2 py-2">{c.name}</div>
                  <div className="px-2 py-2 font-mono">{c.slug}</div>
                  <div className="px-2 py-2">{c.status}</div>
                </div>
              ))}
              {campaigns.length === 0 && (
                <div className="text-sm text-[var(--foreground)]/70 mt-2">Nenhuma campanha</div>
              )}
            </div>
            <div className="mt-6 grid gap-3">
              <input className="rounded-md border px-3 py-2" placeholder="Nome" value={newCamp.name} onChange={(e) => setNewCamp((s) => ({ ...s, name: e.target.value }))} />
              <input className="rounded-md border px-3 py-2" placeholder="Slug" value={newCamp.slug} onChange={(e) => setNewCamp((s) => ({ ...s, slug: e.target.value }))} />
              <button className="btn-primary" disabled={loading} onClick={async () => {
                if (!newCamp.name || !newCamp.slug) return
                setLoading(true)
                try {
                  const res = await fetch('/api/admin/campaigns', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(newCamp) })
                  if (res.ok) {
                    setNewCamp({ name: '', slug: '' })
                    const r = await fetch('/api/admin/campaigns', { cache: 'no-store' })
                    const d = await r.json()
                    setCampaigns(Array.isArray(d.campaigns) ? (d.campaigns as Campaign[]).map((c) => ({ id: c.id, name: c.name, slug: c.slug, status: c.status })) : [])
                  }
                } finally {
                  setLoading(false)
                }
              }}>Criar campanha</button>
            </div>
          </div>

          <div className="rounded-xl border bg-white/90 p-6 shadow">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-[var(--foreground)]">Cupons</h2>
              <button className="bubble-link" onClick={async () => {
                setLoading(true)
                try {
                  const res = await fetch('/api/admin/coupons', { cache: 'no-store' })
                  const data = await res.json()
                  setCoupons(Array.isArray(data.coupons) ? (data.coupons as Coupon[]).map((c) => ({ code: c.code, description: c.description, discount_percent: c.discount_percent, discount_value: c.discount_value, active: c.active })) : [])
                } finally {
                  setLoading(false)
                }
              }}>Atualizar</button>
            </div>
            <div className="mt-4 grid grid-cols-4 text-xs font-bold">
              <div>Código</div>
              <div>Descrição</div>
              <div>Desconto</div>
              <div>Status</div>
            </div>
            <div>
              {coupons.map((c) => (
                <div key={c.code} className="grid grid-cols-4 items-center border-t border-[var(--brand-2)]/10 text-sm">
                  <div className="px-2 py-2 font-mono">{c.code}</div>
                  <div className="px-2 py-2">{c.description || '-'}</div>
                  <div className="px-2 py-2">{typeof c.discount_percent === 'number' ? `${c.discount_percent}%` : typeof c.discount_value === 'number' ? `R$ ${c.discount_value?.toFixed?.(2)}` : '-'}</div>
                  <div className="px-2 py-2">{c.active ? 'Ativo' : 'Inativo'}</div>
                </div>
              ))}
              {coupons.length === 0 && (
                <div className="text-sm text-[var(--foreground)]/70 mt-2">Nenhum cupom</div>
              )}
            </div>
            <div className="mt-6 grid gap-3">
              <input className="rounded-md border px-3 py-2" placeholder="Código" value={newCoupon.code} onChange={(e) => setNewCoupon((s) => ({ ...s, code: e.target.value }))} />
              <input className="rounded-md border px-3 py-2" placeholder="% Desconto" value={newCoupon.discount_percent} onChange={(e) => setNewCoupon((s) => ({ ...s, discount_percent: e.target.value }))} />
              <button className="btn-primary" disabled={loading} onClick={async () => {
                if (!newCoupon.code) return
                setLoading(true)
                try {
                  const body: { code: string; discount_percent?: number } = { code: newCoupon.code }
                  const pct = Number(newCoupon.discount_percent)
                  if (!Number.isNaN(pct) && pct > 0) body.discount_percent = pct
                  const res = await fetch('/api/admin/coupons', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) })
                  if (res.ok) {
                    setNewCoupon({ code: '', discount_percent: '' })
                    const r = await fetch('/api/admin/coupons', { cache: 'no-store' })
                    const d = await r.json()
                    setCoupons(Array.isArray(d.coupons) ? (d.coupons as Coupon[]).map((c) => ({ code: c.code, description: c.description, discount_percent: c.discount_percent, discount_value: c.discount_value, active: c.active })) : [])
                  }
                } finally {
                  setLoading(false)
                }
              }}>Criar cupom</button>
            </div>
          </div>
        </div>

        <div className="rounded-xl border bg-white/90 p-6 shadow">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-[var(--foreground)]">Ações Rápidas</h2>
            <button className="bubble-link" onClick={() => router.replace(`/${locale}/admin/pedidos`)}>Ver pedidos</button>
          </div>
          <button className="mt-4 btn-primary" onClick={async () => {
            setLoading(true)
            try {
              const res = await fetch('/api/admin/metrics', { cache: 'no-store' })
              if (res.ok) setMetrics(await res.json())
            } finally {
              setLoading(false)
            }
          }}>Atualizar métricas</button>
        </div>
      </main>
    </div>
  )
}
