import type { Metadata } from "next"
import "../globals.css"
import { NextIntlClientProvider } from "next-intl"
import Header from "@/components/Header"
import KidsTheme from "@/components/KidsTheme"
import { CartProvider } from "@/store/cart"
import Link from "next/link"
import Image from "next/image"

export const metadata: Metadata = {
  title: "PALIRA IMPORTS",
  description: "E-commerce com design atrativo e tecnologias avançadas"
}

export default async function RootLayout({ children, params }: { children: React.ReactNode; params: Promise<{ locale: string }> }) {
  const { locale } = await params
  const messages = (await import(`../../messages/${locale}.json`)).default
  return (
    <NextIntlClientProvider locale={locale} messages={messages}>
      <CartProvider>
        <KidsTheme>
          <Header />
          {children}
          <footer className="mt-24 w-full">
            <div className="container">
              <div className="rounded-xl border-[2px] border-white/60 bg-white/90 p-8 shadow-md backdrop-blur-xl">
                <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
                  <div className="flex items-center gap-3">
                    <Image src="/logo.svg" alt="PALIRA IMPORTS" width={48} height={48} sizes="48px" className="rounded-xl border border-white/70 shadow-sm" />
                    <span className="text-2xl font-black tracking-tight brand-gradient md:text-3xl">PALIRA IMPORTS</span>
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    <Link href={`/${locale}/produtos`} className="bubble-link">🧸 Produtos</Link>
                    <Link href={`/${locale}/carrinho`} className="bubble-link">🛍️ Sacola</Link>
                    <Link href={`/${locale}/checkout`} className="bubble-link">✨ Pagamento</Link>
                    <Link href={`/${locale}/admin/pedidos`} className="bubble-link">📦 Pedidos</Link>
                  </div>
                </div>
                <div className="mt-6 grid gap-4 md:grid-cols-3">
                  <div className="text-sm text-[var(--foreground)]/70">
                    <div className="font-bold text-[var(--foreground)] mb-2">Contato</div>
                    <div className="flex flex-col gap-1">
                      <span>suporte@palira.com.br</span>
                      <span>+55 (11) 99999-9999</span>
                    </div>
                  </div>
                  <div className="text-sm text-[var(--foreground)]/70">
                    <div className="font-bold text-[var(--foreground)] mb-2">Institucional</div>
                    <div className="flex flex-col gap-1">
                      <span>Sobre</span>
                      <span>Políticas</span>
                    </div>
                  </div>
                  <div className="text-sm text-[var(--foreground)]/70">
                    <div className="font-bold text-[var(--foreground)] mb-2">Siga a gente</div>
                    <div className="flex flex-wrap gap-2">
                      <span className="bubble-link">🌈 Instagram</span>
                      <span className="bubble-link">🎵 TikTok</span>
                      <span className="bubble-link">📘 Facebook</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="mt-6 flex items-center justify-between text-xs text-[var(--foreground)]/60">
                <span>© {new Date().getFullYear()} PALIRA IMPORTS</span>
                <span>Feito com ❤️ e muita magia</span>
              </div>
            </div>
          </footer>
        </KidsTheme>
      </CartProvider>
    </NextIntlClientProvider>
  )
}
