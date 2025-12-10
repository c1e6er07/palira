'use client'
import { useEffect, useState } from 'react'
import ProductCard from '@/components/ProductCard'
import type { Product } from '@/data/products'
import { products as mock } from '@/data/products'

export default function ProdutosPage() {
  const [items, setItems] = useState<Product[]>(mock)
  const [category, setCategory] = useState<string | null>(null)
  const [sort, setSort] = useState<string | null>(null)
  const [min, setMin] = useState<string>('')
  const [max, setMax] = useState<string>('')
  const [age, setAge] = useState<string | null>(null)
  
  useEffect(() => {
    const url = (() => {
      const base = new URL('/api/products', window.location.origin)
      if (category) base.searchParams.set('category', category)
      if (min) base.searchParams.set('min', min)
      if (max) base.searchParams.set('max', max)
      if (age) base.searchParams.set('age', age)
      return base.toString()
    })()
    fetch(url).then(r => r.json()).then(setItems).catch(() => setItems(mock))
  }, [category, min, max, age])
  
  return (
    <div className="flex min-h-screen items-start justify-center kids-gradient-bg font-sans pb-20">
      <main className="container w-full pt-28 pb-16">
        <h1 className="text-4xl font-black text-[var(--foreground)] mb-8 flex items-center gap-3">
          <span className="text-5xl">🧸</span>
          Todos os Produtos
        </h1>
        
        <div className="flex flex-col gap-6">
          {/* Filters Section */}
          <div className="card p-6 bg-white/80">
            <h3 className="text-lg font-bold text-[var(--foreground)] mb-3 flex items-center gap-2">🎯 Filtros Mágicos</h3>
            
            <div className="flex flex-wrap gap-3 mb-4">
              {['Brinquedos','Roupas','Educativo','Acessórios','Pelúcias','Jogos','Decoração'].map((c) => (
                <button key={c} onClick={() => setCategory(category===c?null:c)} className={`bubble-link ${category===c?'bg-[var(--brand-1)] text-white border-[var(--brand-1)] shadow-lg scale-105':''}`}>
                  {c}
                </button>
              ))}
            </div>
            
            <div className="flex flex-wrap items-center gap-3 border-t border-[var(--brand-2)]/10 pt-4">
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-[var(--foreground)]/70">Preço:</span>
                <input value={min} onChange={(e)=>setMin(e.target.value)} type="number" placeholder="Mín" className="chip w-20 text-sm" />
                <span className="text-[var(--foreground)]/50">-</span>
                <input value={max} onChange={(e)=>setMax(e.target.value)} type="number" placeholder="Máx" className="chip w-20 text-sm" />
              </div>
              
              <div className="h-6 w-px bg-[var(--brand-2)]/20 mx-2 hidden sm:block"></div>
              
              <div className="flex flex-wrap gap-2">
                {['2–5 anos','3–6 anos','4–7 anos','5–8 anos','6–10 anos'].map((g) => (
                  <button key={g} onClick={() => setAge(age===g?null:g)} className={`px-3 py-1 rounded-full text-xs font-bold transition-all border ${age===g?'bg-[var(--brand-3)] text-white border-[var(--brand-3)]':'bg-white text-[var(--foreground)] border-transparent hover:border-[var(--brand-3)]'}`}>
                    {g}
                  </button>
                ))}
              </div>
            </div>
          </div>
          
          {/* Sort Section */}
          <div className="flex justify-end gap-3">
            <span className="text-sm font-bold text-[var(--foreground)]/70 self-center">Ordenar por:</span>
            {['Menor preço','Maior preço','Melhor avaliação'].map((s) => (
              <button key={s} onClick={() => setSort(sort===s?null:s)} className={`text-sm font-bold transition-colors ${sort===s?'text-[var(--brand-2)] underline decoration-2':'text-[var(--foreground)]/60 hover:text-[var(--brand-2)]'}`}>
                {s}
              </button>
            ))}
          </div>
          
          {/* Products Grid */}
          {items.length > 0 ? (
            <div className="mt-2 grid w-full grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {[...items].sort((a,b)=>{
                if (sort==='Menor preço') return a.price - b.price
                if (sort==='Maior preço') return b.price - a.price
                if (sort==='Melhor avaliação') return (b.rating??0) - (a.rating??0)
                return 0
              }).map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <div className="text-6xl mb-4">🤔</div>
              <h3 className="text-2xl font-bold text-[var(--foreground)]">Nenhum tesouro encontrado!</h3>
              <p className="text-[var(--foreground)]/70">Tente ajustar os filtros mágicos.</p>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
