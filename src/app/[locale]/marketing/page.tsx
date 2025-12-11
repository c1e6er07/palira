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
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <div className="rounded-xl border bg-white/90 p-6 shadow">Campanhas</div>
          <div className="rounded-xl border bg-white/90 p-6 shadow">Landing Pages</div>
          <div className="rounded-xl border bg-white/90 p-6 shadow">Newsletter</div>
          <div className="rounded-xl border bg-white/90 p-6 shadow">Eventos</div>
          <div className="rounded-xl border bg-white/90 p-6 shadow">Cupons</div>
          <div className="rounded-xl border bg-white/90 p-6 shadow">Assets</div>
        </div>
      </main>
    </div>
  )
}
