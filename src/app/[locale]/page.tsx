'use client'
import ProductCard from "@/components/ProductCard"
import { products } from "@/data/products"
import { useEffect, useState } from "react"
import type { Product } from "@/data/products"
import HomeBanner from "@/components/HomeBanner"

export default function Home() {
  const [items, setItems] = useState<Product[]>(products)

  useEffect(() => {
    fetch("/api/products")
      .then((r) => r.json())
      .then((data: Product[]) => setItems(data))
      .catch(() => setItems(products))
  }, [])

  return (
    <div className="flex min-h-screen flex-col items-center kids-gradient-bg pt-28 pb-20">
      <main className="w-full flex flex-col items-center justify-between gap-y-16 md:gap-y-24">
        <HomeBanner />
        
        <div id="produtos" className="container mt-48 md:mt-64 scroll-mt-32 md:scroll-mt-40 flex flex-col gap-8">
          <div className="flex flex-col items-center text-center gap-2">
            <span className="text-sm font-bold uppercase tracking-widest text-[var(--brand-2)]">Nossa Coleção</span>
            <h2 className="text-3xl font-black text-[var(--foreground)] md:text-4xl">Brinquedos Favoritos</h2>
            <div className="h-1.5 w-20 rounded-full bg-[var(--brand-3)]"></div>
          </div>
          
          <div className="grid w-full grid-cols-2 gap-4 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4">
            {items.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      </main>
    </div>
  )
}
