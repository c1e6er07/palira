'use client'
import { useState } from 'react'
import { supabase } from '@/lib/supabaseClient'
import { useRouter, useParams } from 'next/navigation'

export default function Login() {
  const router = useRouter()
  const params = useParams() as { locale?: string }
  const locale = params?.locale || 'pt-BR'
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(null)
    try {
      if (!supabase) throw new Error('auth')
      const { data, error } = await supabase.auth.signInWithPassword({ email, password })
      if (error || !data?.user) throw new Error('login')
      router.replace(`/${locale}/admin`)
    } catch {
      setError('Falha no login')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen flex-col items-center kids-gradient-bg pt-28 pb-20">
      <main className="container max-w-md">
        <h1 className="text-3xl font-black text-[var(--foreground)] mb-6">Entrar</h1>
        <form onSubmit={onSubmit} className="flex flex-col gap-4">
          <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" placeholder="E-mail" className="rounded-lg border p-3" />
          <input value={password} onChange={(e) => setPassword(e.target.value)} type="password" placeholder="Senha" className="rounded-lg border p-3" />
          {error ? <div className="text-red-600 text-sm">{error}</div> : null}
          <button disabled={loading} className="bubble-link w-full justify-center">{loading ? 'Autenticando...' : 'Entrar'}</button>
        </form>
      </main>
    </div>
  )
}
