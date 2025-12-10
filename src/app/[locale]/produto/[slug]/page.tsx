import { notFound } from 'next/navigation'
import { formatBRL } from '@/utils/format'
import AddToCartButton from '@/components/AddToCartButton'
import { getProductImageUrl } from '@/lib/images'
import Image from 'next/image'
import Breadcrumbs from '@/components/Breadcrumbs'
import ProductJsonLd from '@/components/ProductJsonLd'

async function getProduct(slugOrId: string) {
  const bySlug = await fetch(`/api/products/slug/${slugOrId}`, { cache: 'no-store' })
  if (bySlug.ok) return bySlug.json()
  const byId = await fetch(`/api/products/${slugOrId}`, { cache: 'no-store' })
  if (byId.ok) return byId.json()
  return null
}

export default async function ProdutoPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const product = await getProduct(slug)
  if (!product) return notFound()
  const normalized = { id: product.id, title: product.title, price: product.price, image: product.image ?? '/file.svg', brand: product.brand, age_group: product.age_group, stock: product.stock }
  const r = Math.round((product.rating ?? 0) * 2) / 2
  const stars = Array.from({length:5}).map((_,i)=> (i+1<=r? '★' : i+0.5<=r? '☆' : '☆'))
  
  return (
    <div className="flex min-h-screen items-start justify-center kids-gradient-bg font-sans pb-20">
      <main className="container max-w-5xl py-12 px-6">
        <Breadcrumbs items={[{label:'Home', href:'/pt-BR'}, {label:'Produtos', href:'/pt-BR/produtos'}, ...(product.category?[{label:product.category, href:'/pt-BR/produtos'}]:[]), {label:product.title, href:'#'}]} />
        
        <div className="mt-8 grid gap-12 lg:grid-cols-2">
          {/* Image Gallery Section */}
          <div className="flex flex-col gap-6">
            <div className="card relative flex aspect-square w-full items-center justify-center rounded-[32px] bg-white p-8 shadow-sm overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-br from-[var(--brand-5)]/10 to-[var(--brand-2)]/10 rounded-[32px]"></div>
              
              {/* Magical Sparkles Background */}
              <div className="absolute top-10 right-10 text-[var(--brand-5)] text-2xl animate-sparkle opacity-0 group-hover:opacity-100 transition-opacity duration-300">✨</div>
              <div className="absolute bottom-10 left-10 text-[var(--brand-1)] text-2xl animate-sparkle opacity-0 group-hover:opacity-100 transition-opacity duration-300" style={{animationDelay: '0.5s'}}>✨</div>
              
              <Image src={getProductImageUrl(normalized.image)} alt={product.title} width={400} height={400} className="relative z-10 object-contain drop-shadow-xl transition-transform hover:scale-110 duration-500" priority />
            </div>
            
            <div className="grid grid-cols-4 gap-4">
              {[normalized.image, normalized.image, normalized.image].map((img, idx) => (
                <div key={idx} className="card flex aspect-square cursor-pointer items-center justify-center rounded-2xl bg-white p-2 hover:border-[var(--brand-2)] hover:shadow-md transition-all group/thumb">
                  <Image src={getProductImageUrl(img)} alt={`${product.title} ${idx+1}`} width={80} height={80} className="object-contain transition-transform group-hover/thumb:scale-110" />
                </div>
              ))}
            </div>
          </div>

          {/* Product Info Section */}
          <div className="flex flex-col gap-6">
            <div>
              <div className="flex flex-wrap gap-2 mb-4">
                {product.category && <span className="inline-block rounded-full bg-[var(--brand-2)]/20 px-3 py-1 text-xs font-bold text-[var(--brand-2)] uppercase tracking-wide">{product.category}</span>}
                {product.age_group && <span className="inline-block rounded-full bg-[var(--brand-4)]/20 px-3 py-1 text-xs font-bold text-[var(--brand-4)] uppercase tracking-wide">{product.age_group}</span>}
              </div>
              
              <h1 className="text-3xl font-black leading-tight text-[var(--foreground)] md:text-4xl">{product.title}</h1>
              
              <div className="mt-3 flex items-center gap-4">
                 {typeof product.rating === 'number' && (
                   <div className="flex text-yellow-400 text-lg gap-1">
                     {stars.map((s,idx)=>(<span key={idx}>{s}</span>))}
                   </div>
                 )}
                 <span className="text-sm font-medium text-[var(--foreground)]/60">
                   (12 avaliações)
                 </span>
              </div>
            </div>

            <div className="card p-6 bg-white/60 backdrop-blur-sm border-none">
              <div className="text-4xl font-black text-[var(--brand-1)] mb-2">{formatBRL(product.price)}</div>
              <p className="text-sm text-[var(--foreground)]/70">Em até 3x sem juros</p>
            </div>

            <ProductJsonLd product={{ id: normalized.id, title: normalized.title, price: normalized.price, image: normalized.image, description: product.description }} />

            {product.description && (
              <div className="prose prose-zinc max-w-none text-[var(--foreground)]/80">
                <p>{product.description}</p>
              </div>
            )}

            <div className="grid grid-cols-2 gap-4 text-sm font-medium text-[var(--foreground)]/70">
              {product.brand && <div className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-[var(--brand-3)]"></span>Marca: {product.brand}</div>}
              {typeof product.stock === 'number' && <div className="flex items-center gap-2"><span className={`w-2 h-2 rounded-full ${product.stock > 0 ? 'bg-green-400' : 'bg-red-400'}`}></span>Estoque: {product.stock}</div>}
            </div>

            <div className="mt-4 pt-6 border-t border-[var(--brand-2)]/20">
              <AddToCartButton product={normalized} disabled={typeof product.stock === 'number' ? product.stock <= 0 : false} />
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const product = await getProduct(slug)
  if (!product) return {}
  return {
    title: `${product.title} | PALIRA IMPORTS`,
    description: `Descubra ${product.title} com preço especial para crianças`,
    openGraph: {
      title: product.title,
      description: `Encanto e diversão: ${product.title}`
    }
  }
}
