'use client'
import Image from 'next/image'
import Link from 'next/link'
import { formatBRL } from '@/utils/format'
import type { Product } from '@/data/products'
import { useCart } from '@/store/cart'
import { getProductImageUrl } from '@/lib/images'

export default function ProductCard({ product }: { product: Product }) {
  const { add } = useCart()
  return (
    <div className="card p-5 group flex flex-col h-full">
      <div className="relative flex aspect-square w-full items-center justify-center rounded-2xl bg-gradient-to-br from-white to-[var(--brand-5)]/30 p-4 shadow-inner overflow-hidden">
        {/* Background glow on hover */}
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-[radial-gradient(circle_at_center,rgba(255,255,0,0.2),transparent)]" />
        
        <Image 
          src={getProductImageUrl(product.image)} 
          alt={product.title} 
          width={160} 
          height={160} 
          className="object-contain drop-shadow-md transition-transform duration-500 group-hover:scale-110 group-hover:rotate-3 z-10" 
        />
      </div>
      
      <div className="mt-4 flex-1">
        <h3 className="text-lg font-bold text-[var(--foreground)] line-clamp-2 leading-tight">{product.title}</h3>
        
        {typeof product.rating === 'number' && (
          <div className="mt-2 flex text-[14px] text-[var(--brand-3)]">
            {Array.from({length:5}).map((_,i)=> (
              <span key={i} className={i+1 <= Math.round((product.rating??0)*2)/2 ? 'text-yellow-400' : 'text-gray-200'}>★</span>
            ))}
          </div>
        )}
        
        <div className="mt-2 flex flex-wrap gap-2">
          {product.category && <span className="inline-block rounded-full bg-[var(--brand-2)]/20 px-2 py-1 text-[10px] font-bold text-[var(--brand-2)] uppercase tracking-wide">{product.category}</span>}
          {product.age_group && <span className="inline-block rounded-full bg-[var(--brand-4)]/20 px-2 py-1 text-[10px] font-bold text-[var(--brand-4)] uppercase tracking-wide">{product.age_group}</span>}
        </div>
      </div>
      
      <div className="mt-4 flex items-end justify-between border-t border-[var(--brand-2)]/10 pt-4">
        <div className="text-xl font-black text-[var(--brand-1)]">{formatBRL(product.price)}</div>
      </div>
      
      <div className="mt-4 flex gap-2">
        <Link href={`produto/${product.slug ?? product.id}`} className="btn-outline flex-1 text-xs py-2">Ver</Link>
        <button onClick={() => add(product, 1)} className="btn-primary flex-1 text-xs py-2 shadow-lg shadow-[var(--brand-1)]/30">
          Adicionar
        </button>
      </div>
    </div>
  )
}
