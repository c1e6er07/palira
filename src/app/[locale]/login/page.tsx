'use client'
import { useState } from 'react'
import { supabase } from '@/lib/supabaseClient'
import { useRouter, useParams } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'

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
      setError('E-mail ou senha incorretos. Tente novamente.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center kids-gradient-bg px-4 py-12">
      {/* Decorative Elements */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-40 -right-40 w-96 h-96 rounded-full bg-[var(--brand-2)]/20 blur-[100px] animate-float-complex" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 rounded-full bg-[var(--brand-1)]/20 blur-[80px] animate-float-complex" style={{ animationDelay: '2s' }} />
        <div className="absolute top-1/4 left-10 text-4xl animate-bounce opacity-30" style={{ animationDuration: '4s' }}>✨</div>
        <div className="absolute bottom-1/4 right-10 text-3xl animate-bounce opacity-30" style={{ animationDuration: '5s', animationDelay: '1s' }}>⭐</div>
      </div>

      <main className="relative z-10 w-full max-w-md">
        {/* Card Container */}
        <div className="card p-8 md:p-10 relative overflow-hidden">
          {/* Top Gradient Bar */}
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[var(--brand-1)] via-[var(--brand-2)] to-[var(--brand-3)]" />
          
          {/* Logo & Title */}
          <div className="flex flex-col items-center mb-8">
            <Link href={`/${locale}`} className="group">
              <div className="relative">
                <div className="absolute inset-0 rounded-full bg-gradient-to-br from-[var(--brand-1)]/20 to-[var(--brand-2)]/20 blur-xl scale-150 group-hover:scale-175 transition-transform" />
                <Image 
                  src="/logo.svg" 
                  alt="PALIRA IMPORTS" 
                  width={80} 
                  height={80} 
                  className="relative drop-shadow-lg transition-transform group-hover:scale-110"
                />
              </div>
            </Link>
            <h1 className="mt-6 text-3xl font-black text-[var(--foreground)] tracking-tight">
              Bem-vindo de volta!
            </h1>
            <p className="mt-2 text-[var(--foreground)]/60 text-center">
              Entre na sua conta para continuar
            </p>
          </div>

          {/* Login Form */}
          <form onSubmit={onSubmit} className="flex flex-col gap-5">
            {/* Email Field */}
            <div className="relative group">
              <label className="block text-sm font-bold text-[var(--foreground)]/70 mb-2">
                📧 E-mail
              </label>
              <input 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
                type="email" 
                placeholder="seu@email.com"
                required
                className="w-full rounded-xl border-2 border-[var(--brand-2)]/20 bg-white/80 px-4 py-3.5 text-[var(--foreground)] placeholder:text-[var(--foreground)]/40 outline-none transition-all duration-300 focus:border-[var(--brand-2)] focus:bg-white focus:shadow-lg focus:shadow-[var(--brand-2)]/10" 
              />
            </div>

            {/* Password Field */}
            <div className="relative group">
              <label className="block text-sm font-bold text-[var(--foreground)]/70 mb-2">
                🔐 Senha
              </label>
              <input 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                type="password" 
                placeholder="••••••••"
                required
                className="w-full rounded-xl border-2 border-[var(--brand-2)]/20 bg-white/80 px-4 py-3.5 text-[var(--foreground)] placeholder:text-[var(--foreground)]/40 outline-none transition-all duration-300 focus:border-[var(--brand-2)] focus:bg-white focus:shadow-lg focus:shadow-[var(--brand-2)]/10" 
              />
            </div>

            {/* Error Message */}
            {error && (
              <div className="flex items-center gap-2 rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-600">
                <span>⚠️</span>
                <span>{error}</span>
              </div>
            )}

            {/* Submit Button */}
            <button 
              disabled={loading} 
              className="relative mt-2 w-full rounded-xl bg-gradient-to-r from-[var(--brand-1)] to-[var(--brand-2)] px-6 py-4 text-lg font-bold text-white shadow-lg transition-all duration-300 hover:shadow-xl hover:shadow-[var(--brand-1)]/30 hover:-translate-y-0.5 disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:translate-y-0 overflow-hidden group"
            >
              <span className="relative z-10 flex items-center justify-center gap-2">
                {loading ? (
                  <>
                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    <span>Autenticando...</span>
                  </>
                ) : (
                  <>
                    <span>Entrar</span>
                    <span className="transition-transform group-hover:translate-x-1">→</span>
                  </>
                )}
              </span>
              <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
            </button>
          </form>

          {/* Footer */}
          <div className="mt-8 pt-6 border-t border-[var(--brand-2)]/10 text-center">
            <Link 
              href={`/${locale}`} 
              className="inline-flex items-center gap-2 text-sm text-[var(--foreground)]/60 hover:text-[var(--brand-2)] transition-colors"
            >
              <span>←</span>
              <span>Voltar para a loja</span>
            </Link>
          </div>
        </div>

        {/* Bottom Decoration */}
        <div className="mt-8 flex justify-center gap-4 text-sm text-[var(--foreground)]/40">
          <span>🛡️ Conexão segura</span>
          <span>•</span>
          <span>🔒 Dados protegidos</span>
        </div>
      </main>
    </div>
  )
}
