'use client'
import Link from 'next/link'
import Image from 'next/image'
import { useTranslations } from 'next-intl'
import { usePathname } from 'next/navigation'
import { useCart } from '@/store/cart'

export default function Header() {
  const t = useTranslations('nav')
  const pathname = usePathname()
  const locale = (pathname.split('/')[1] || 'pt-BR') as string
  const { count } = useCart()
  
  return (
    <div className="fixed top-0 z-50 w-full transition-all pt-4 px-4">
      <header className="container mx-auto flex w-full items-center justify-between rounded-xl border-[2px] border-white/60 bg-white/90 px-6 py-3 shadow-md backdrop-blur-xl md:px-8">
        <Link href={`/${locale}`} className="group flex items-center gap-2">
          <Image src="/logo.svg" alt="PALIRA IMPORTS" width={48} height={48} className="rounded-xl border border-white/70 shadow-sm" />
          <span className="text-2xl font-black tracking-tight brand-gradient drop-shadow-sm transition-transform group-hover:scale-105 md:text-3xl">
            PALIRA IMPORTS
          </span>
        </Link>
        
        <nav className="flex items-center gap-2 md:gap-4">
          <Link href={`/${locale}/produtos`} className="hidden rounded-full px-4 py-2 text-sm font-bold text-[var(--foreground)] transition-all hover:bg-[var(--brand-5)]/20 hover:text-[var(--brand-1)] md:block">
            🧸 {t('products')}
          </Link>
          
          <Link href={`/${locale}/carrinho`} className="relative flex items-center gap-2 rounded-full bg-[var(--brand-2)]/10 px-4 py-2 text-sm font-bold text-[var(--brand-2)] transition-all hover:bg-[var(--brand-2)] hover:text-white group">
            <span>🛍️ {t('cart')}</span>
            {count > 0 && (
              <span className="absolute -right-2 -top-2 inline-flex h-6 w-6 animate-bounce items-center justify-center rounded-full bg-[var(--brand-1)] text-xs font-bold text-white shadow-md border-2 border-white">
                {count}
              </span>
            )}
          </Link>
          
          <Link href={`/${locale}/checkout`} className="hidden rounded-full bg-gradient-to-r from-[var(--brand-3)] to-[var(--brand-2)] px-6 py-2 text-sm font-bold text-white shadow-md transition-all hover:-translate-y-0.5 hover:shadow-lg md:block">
            ✨ {t('checkout')}
          </Link>
        </nav>
      </header>
    </div>
  )
}
