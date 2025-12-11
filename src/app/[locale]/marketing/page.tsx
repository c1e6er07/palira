'use client'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'
import type { User } from '@supabase/supabase-js'
import { useParams, useRouter } from 'next/navigation'

export default function Marketing() {
  const [ready, setReady] = useState(false)
  const [user, setUser] = useState<User | null>(null)
  const params = useParams() as { locale?: string }
  const locale = params?.locale || 'pt-BR'
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [name, setName] = useState('')
  const [subscribed, setSubscribed] = useState<null | boolean>(null)
  const [eventOk, setEventOk] = useState<null | boolean>(null)
  const [loading, setLoading] = useState(false)

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
          <p className="mb-6">Faça login para acessar o módulo de marketing.</p>
          <button className="bubble-link" onClick={() => router.replace(`/${locale}/login`)}>Ir para Login</button>
        </main>
      </div>
    )

  return (
    <div className="flex min-h-screen flex-col items-center kids-gradient-bg pt-28 pb-20">
      <main className="container flex flex-col gap-8">
        <h1 className="text-3xl font-black text-[var(--foreground)]">Marketing Hub</h1>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div className="rounded-xl border bg-white/90 p-6 shadow">
            <h2 className="text-xl font-bold text-[var(--foreground)] mb-4">Newsletter</h2>
            <div className="grid gap-3 max-w-md">
              <input className="rounded-md border px-3 py-2" placeholder="Seu nome" value={name} onChange={(e) => setName(e.target.value)} />
              <input className="rounded-md border px-3 py-2" placeholder="Seu e-mail" value={email} onChange={(e) => setEmail(e.target.value)} />
              <button className="btn-primary" disabled={loading} onClick={async () => {
                setLoading(true)
                try {
                  const res = await fetch('/api/marketing/subscribe', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email, name, source: 'admin' }) })
                  setSubscribed(res.ok)
                  if (res.ok) {
                    setEmail('')
                    setName('')
                  }
                } finally {
                  setLoading(false)
                }
              }}>Assinar Newsletter</button>
              {subscribed !== null && (
                <div className={`text-sm ${subscribed ? 'text-green-600' : 'text-red-600'}`}>{subscribed ? 'Inscrição registrada' : 'Falha ao registrar'}</div>
              )}
            </div>
          </div>

          <div className="rounded-xl border bg-white/90 p-6 shadow">
            <h2 className="text-xl font-bold text-[var(--foreground)] mb-4">Eventos</h2>
            <div className="grid gap-3 max-w-md">
              <button className="btn-primary" disabled={loading} onClick={async () => {
                setLoading(true)
                try {
                  const res = await fetch('/api/marketing/events', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ type: 'visit', payload: { page: 'marketing' } }) })
                  setEventOk(res.ok)
                } finally {
                  setLoading(false)
                }
              }}>Registrar evento de visita</button>
              {eventOk !== null && (
                <div className={`text-sm ${eventOk ? 'text-green-600' : 'text-red-600'}`}>{eventOk ? 'Evento registrado' : 'Falha ao registrar'}</div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
