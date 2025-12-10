'use client'
import { useCart } from '@/store/cart'
import { formatBRL } from '@/utils/format'
import Link from 'next/link'
import { useParams } from 'next/navigation'

export default function CarrinhoPage() {
  const { items, updateQty, remove, clear, total } = useCart()
  const { locale } = useParams()
  
  return (
    <div className="flex min-h-screen items-start justify-center kids-gradient-bg font-sans pb-20">
      <main className="container w-full py-16">
        <h1 className="text-4xl font-black text-[var(--foreground)] mb-8 flex items-center gap-3">
          <span className="text-5xl">🛒</span>
          Seu Carrinho
        </h1>
        
        {items.length === 0 ? (
          <div className="card p-12 text-center flex flex-col items-center">
            <div className="text-6xl mb-4">🎈</div>
            <p className="text-xl text-[var(--foreground)] font-medium">Seu carrinho está vazio.</p>
            <p className="text-[var(--foreground)]/60 mt-2">Que tal adicionar alguns brinquedos mágicos?</p>
            <Link href={`/${locale}/produtos`} className="btn-primary mt-6">Explorar Loja</Link>
          </div>
        ) : (
          <div className="grid gap-8 lg:grid-cols-3">
            <div className="lg:col-span-2 flex flex-col gap-6">
              {items.map((i) => (
                <div key={i.id} className="card p-6 flex flex-col sm:flex-row items-center gap-6 relative overflow-hidden group">
                  <div className="absolute top-0 left-0 w-2 h-full bg-[var(--brand-2)]"></div>
                  
                  <div className="flex-1 text-center sm:text-left">
                    <h3 className="text-xl font-bold text-[var(--foreground)]">{i.title}</h3>
                    <span className="text-lg font-bold text-[var(--brand-1)] block mt-1">{formatBRL(i.price)}</span>
                  </div>
                  
                  <div className="flex items-center gap-4 bg-[var(--brand-5)]/30 p-2 rounded-full">
                    <button onClick={() => updateQty(i.id, Math.max(1, i.qty - 1))} className="w-8 h-8 flex items-center justify-center rounded-full bg-white shadow-sm font-bold text-[var(--brand-2)] hover:scale-110 transition-transform">-</button>
                    <span className="w-8 text-center font-bold">{i.qty}</span>
                    <button onClick={() => updateQty(i.id, i.qty + 1)} className="w-8 h-8 flex items-center justify-center rounded-full bg-white shadow-sm font-bold text-[var(--brand-2)] hover:scale-110 transition-transform">+</button>
                  </div>
                  
                  <button onClick={() => remove(i.id)} className="btn-outline border-red-200 text-red-400 hover:bg-red-50 hover:border-red-300 p-2 rounded-full">
                    <span className="sr-only">Remover</span>
                    🗑️
                  </button>
                </div>
              ))}
              
              <div className="flex justify-end">
                <button onClick={clear} className="text-sm text-red-400 hover:text-red-600 font-bold underline decoration-dotted">
                  Esvaziar carrinho
                </button>
              </div>
            </div>
            
            <div className="lg:col-span-1">
              <div className="card p-8 sticky top-24">
                <h2 className="text-2xl font-bold text-[var(--foreground)] mb-6">Resumo</h2>
                
                <div className="flex items-center justify-between text-lg mb-6 pb-6 border-b border-[var(--brand-2)]/20">
                  <span className="font-medium text-[var(--foreground)]/70">Subtotal</span>
                  <span className="font-bold text-[var(--foreground)]">{formatBRL(total)}</span>
                </div>
                
                <div className="flex items-center justify-between text-2xl font-black mb-8">
                  <span className="brand-gradient">Total</span>
                  <span className="brand-gradient">{formatBRL(total)}</span>
                </div>
                
                <Link href={`/${locale}/checkout`} className="btn-primary w-full py-4 text-lg shadow-xl shadow-[var(--brand-1)]/20">
                  Finalizar Compra 🚀
                </Link>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
