'use client'
import Image from 'next/image'
import { formatBRL } from '@/utils/format'
import type { Product } from '@/data/products'
import { useCart } from '@/store/cart'
import { getProductImageUrl } from '@/lib/images'

export default function ProductCard({ product }: { product: Product }) {
  const { add } = useCart()
  return (
    <div className="card p-4 md:p-5 group flex flex-col h-full">
      <div className="relative flex aspect-square w-full items-center justify-center rounded-xl bg-gradient-to-br from-white to-[var(--brand-5)]/30 p-3 md:p-4 shadow-inner overflow-hidden">
        
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-[radial-gradient(circle_at_center,rgba(255,255,0,0.2),transparent)]" />
        
        <Image src={getProductImageUrl(product.image)} alt={product.title} width={176} height={176} sizes="(max-width: 480px) 48vw, (max-width: 768px) 44vw, (max-width: 1024px) 30vw, 176px" className="object-contain drop-shadow-md transition-transform duration-500 group-hover:scale-110 group-hover:rotate-3 z-10" />
      </div>
      
      <div className="mt-4 flex-1">
        <h3 className="text-base md:text-lg font-bold text-[var(--foreground)] line-clamp-2 leading-tight">{product.title}</h3>
        
        {typeof product.rating === 'number' && (
          <div className="mt-1 md:mt-2 flex text-xs md:text-[14px] text-[var(--brand-3)]">
            {Array.from({length:5}).map((_,i)=> (
              <span key={i} className={i+1 <= Math.round((product.rating??0)*2)/2 ? 'text-yellow-400' : 'text-gray-200'}>★</span>
            ))}
          </div>
        )}
        
        <div className="mt-2 flex flex-wrap gap-2">
          <span className="text-xl font-black brand-gradient">{formatBRL(product.price)}</span>
          <button onClick={() => add(product, 1)} className="bubble-link">Adicionar</button>
        </div>
      </div>
    </div>
  )
}
