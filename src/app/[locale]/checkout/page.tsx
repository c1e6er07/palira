"use client"
import { useCart } from '@/store/cart'
import { formatBRL } from '@/utils/format'
import { useParams } from 'next/navigation'
import { useMemo, useState } from 'react'

type PixIntent = { intentId: string; method: 'pix'; amount: number; pix: { copyPaste: string; expiresAt: string } }
type CardIntent = { intentId: string; method: 'card'; amount: number; status: 'authorized' | 'succeeded' }

export default function CheckoutPage() {
  const { items, total, clear } = useCart()
  const { locale } = useParams()
  const [method, setMethod] = useState<'pix' | 'card'>('pix')
  const [loading, setLoading] = useState(false)
  const [pix, setPix] = useState<PixIntent | null>(null)
  const [card, setCard] = useState<CardIntent | null>(null)
  const [success, setSuccess] = useState(false)

  const summary = useMemo(() => ({
    count: items.reduce((a, i) => a + i.qty, 0),
    total,
  }), [items, total])

  const generatePix = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          method: 'pix',
          items: items.map(i => ({ id: i.id, title: i.title, price: i.price, qty: i.qty })),
        })
      })
      const data = await res.json()
      if (res.ok) setPix(data as PixIntent)
    } finally {
      setLoading(false)
    }
  }

  const confirmPix = async () => {
    if (!pix) return
    setLoading(true)
    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'confirm', intentId: pix.intentId })
      })
      if (res.ok) {
        await fetch('/api/orders', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ items: items.map(i => ({ id: i.id, title: i.title, price: i.price, qty: i.qty })), total, method: 'pix', intentId: pix.intentId })
        })
        setSuccess(true)
        clear()
      }
    } finally {
      setLoading(false)
    }
  }

  const payCard = async (form: { number: string; name: string; exp: string; cvc: string }) => {
    setLoading(true)
    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          method: 'card',
          items: items.map(i => ({ id: i.id, title: i.title, price: i.price, qty: i.qty })),
          card: form,
        })
      })
      const data = await res.json()
      if (res.ok) {
        setCard(data as CardIntent)
        await fetch('/api/orders', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ items: items.map(i => ({ id: i.id, title: i.title, price: i.price, qty: i.qty })), total, method: 'card' })
        })
        setSuccess(true)
        clear()
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-start justify-center kids-gradient-bg font-sans pb-20">
      <main className="container max-w-4xl py-16 px-6">
        <h1 className="text-4xl font-black brand-gradient mb-6">Pagamento</h1>

        {items.length === 0 && !success ? (
          <div className="card p-10 text-center">
            <div className="text-6xl mb-4">🎈</div>
            <p className="text-xl font-bold text-[var(--foreground)]">Seu carrinho está vazio.</p>
            <a href={`/${locale}/produtos`} className="btn-primary mt-6">Explorar Loja</a>
          </div>
        ) : success ? (
          <div className="card p-10 text-center">
            <div className="text-6xl mb-4">✅</div>
            <h2 className="text-2xl font-black text-[var(--foreground)] mb-2">Pagamento confirmado!</h2>
            <p className="text-[var(--foreground)]/70">Recebemos seu pedido com sucesso.</p>
            <a href={`/${locale}`} className="btn-primary mt-6">Voltar à Home</a>
          </div>
        ) : (
          <div className="grid gap-8 lg:grid-cols-3">
            <div className="lg:col-span-2 flex flex-col gap-6">
              <div className="card p-6">
                <h3 className="text-lg font-bold text-[var(--foreground)] mb-4">Resumo do Pedido</h3>
                <div className="flex items-center justify-between">
                  <span className="text-[var(--foreground)]/70">Itens</span>
                  <span className="font-bold">{summary.count}</span>
                </div>
                <div className="flex items-center justify-between mt-2">
                  <span className="text-[var(--foreground)]/70">Total</span>
                  <span className="text-2xl font-black brand-gradient">{formatBRL(summary.total)}</span>
                </div>
              </div>

              <div className="card p-6">
                <div className="flex gap-2 mb-6">
                  <button onClick={() => setMethod('pix')} className={`bubble-link ${method==='pix'?'ring-2 ring-[var(--brand-1)]':''}`}>PIX</button>
                  <button onClick={() => setMethod('card')} className={`bubble-link ${method==='card'?'ring-2 ring-[var(--brand-2)]':''}`}>Cartão</button>
                </div>

                {method === 'pix' ? (
                  <div>
                    {!pix ? (
                      <button onClick={generatePix} disabled={loading} className="btn-primary">
                        Gerar Pix
                      </button>
                    ) : (
                      <div className="flex flex-col gap-4">
                        <div className="p-4 bg-white rounded-xl border-2 border-[var(--brand-2)]/20">
                          <p className="text-sm font-bold text-[var(--foreground)]/70 mb-2">Código copia-e-cola</p>
                          <div className="text-xs break-all font-mono bg-[var(--brand-5)]/20 p-3 rounded">
                            {pix.pix.copyPaste}
                          </div>
                          <p className="text-xs text-[var(--foreground)]/50 mt-2">Expira em: {new Date(pix.pix.expiresAt).toLocaleString()}</p>
                        </div>
                        <div className="flex gap-2">
                          <button onClick={() => navigator.clipboard.writeText(pix.pix.copyPaste)} className="btn-outline">Copiar Código</button>
                          <button onClick={confirmPix} disabled={loading} className="btn-primary">Marcar como Pago</button>
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <CardForm onSubmit={payCard} loading={loading} />
                )}
              </div>
            </div>

            <div className="lg:col-span-1">
              <div className="card p-6 sticky top-24">
                <h3 className="text-lg font-bold text-[var(--foreground)] mb-4">Suporte</h3>
                <p className="text-sm text-[var(--foreground)]/70">Dúvidas? Nosso time mágico está aqui para ajudar.</p>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}

function CardForm({ onSubmit, loading }: { onSubmit: (form: { number: string; name: string; exp: string; cvc: string }) => void; loading: boolean }) {
  const [number, setNumber] = useState('')
  const [name, setName] = useState('')
  const [exp, setExp] = useState('')
  const [cvc, setCvc] = useState('')
  const disabled = !number || !name || !exp || !cvc

  return (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <input value={name} onChange={(e)=>setName(e.target.value)} placeholder="Nome impresso no cartão" className="chip w-full" />
        <input value={number} onChange={(e)=>setNumber(e.target.value)} placeholder="Número do cartão" className="chip w-full" />
        <input value={exp} onChange={(e)=>setExp(e.target.value)} placeholder="Validade (MM/AA)" className="chip w-full" />
        <input value={cvc} onChange={(e)=>setCvc(e.target.value)} placeholder="CVC" className="chip w-full" />
      </div>
      <button onClick={()=>onSubmit({ number, name, exp, cvc })} disabled={disabled || loading} className="btn-primary">
        Pagar com Cartão
      </button>
      <p className="text-xs text-[var(--foreground)]/50">Simulação segura. Nenhum dado real é enviado.</p>
    </div>
  )
}

