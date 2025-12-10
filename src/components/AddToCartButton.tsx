'use client'
import { useCart } from '@/store/cart'
import type { Product } from '@/data/products'

export default function AddToCartButton({ product, disabled }: { product: Product; disabled?: boolean }) {
  const { add } = useCart()
  return (
    <button
      disabled={disabled}
      onClick={() => !disabled && add(product, 1)}
      className={`w-full py-4 text-lg font-bold shadow-xl transition-all ${
        disabled 
          ? 'bg-zinc-200 text-zinc-400 cursor-not-allowed rounded-full' 
          : 'btn-primary shadow-[var(--brand-1)]/30 hover:shadow-[var(--brand-1)]/50'
      }`}
    >
      {disabled ? 'Indisponível' : 'Adicionar ao Carrinho ✨'}
    </button>
  )
}
