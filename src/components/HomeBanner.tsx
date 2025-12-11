import Image from 'next/image'

export default function HomeBanner() {
  return (
    <section className="container relative mt-24 md:mt-32 mb-24 md:mb-32 w-full overflow-hidden rounded-[40px] border-[6px] border-white bg-gradient-to-br from-[var(--brand-5)]/30 via-white to-[var(--brand-2)]/30 p-8 shadow-2xl md:p-20">
      
      {/* Dynamic Background Elements */}
      <div className="absolute -right-32 -top-32 h-96 w-96 rounded-full bg-[var(--brand-3)]/40 blur-[80px] animate-float-complex" />
      <div className="absolute -bottom-32 -left-32 h-80 w-80 rounded-full bg-[var(--brand-1)]/40 blur-[70px] animate-float-complex" style={{ animationDelay: '2s', animationDuration: '10s' }} />
      <div className="absolute top-1/2 right-10 h-40 w-40 rounded-full bg-[var(--brand-4)]/30 blur-[50px] animate-pulse-slow" />
      
      {/* Decorative Sparkles */}
      <div className="absolute top-20 right-1/3 text-[var(--brand-5)] text-4xl animate-bounce" style={{ animationDuration: '3s' }}>✨</div>
      <div className="absolute bottom-20 left-1/3 text-[var(--brand-2)] text-3xl animate-bounce" style={{ animationDuration: '4s', animationDelay: '1s' }}>⭐</div>
      <div className="absolute top-10 left-10 text-[var(--brand-1)] text-2xl animate-spin" style={{ animationDuration: '8s' }}>★</div>

      <div className="relative z-10 flex flex-col items-start gap-8">
        <div className="inline-flex items-center gap-2 rounded-full bg-white/80 px-4 py-1.5 text-sm font-bold uppercase tracking-widest text-[var(--brand-4)] shadow-sm backdrop-blur-sm border border-[var(--brand-4)]/20">
          <span className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[var(--brand-1)] opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-[var(--brand-1)]"></span>
          </span>
          Novidades Mágicas
        </div>

        <h2 className="max-w-3xl text-6xl font-black leading-[0.9] tracking-tight text-[var(--foreground)] md:text-8xl drop-shadow-sm">
          <span className="brand-gradient block mb-4">Aventuras</span>
          Inesquecíveis
        </h2>
        
        <p className="max-w-xl text-xl font-medium text-[var(--foreground)]/80 md:text-2xl leading-relaxed">
          Transforme cada momento em uma <span className="text-[var(--brand-1)] font-bold">festa de cores</span> e aprendizado com nossa seleção especial.
        </p>
        
        <div className="flex flex-wrap gap-4 mt-2">
          <a href="#produtos" className="btn-primary text-xl px-12 py-5 shadow-xl hover:shadow-[0_20px_50px_rgba(255,64,129,0.5)] hover:-translate-y-1 transition-all group relative overflow-hidden">
            <span className="relative z-10">Ver Coleção 🚀</span>
            <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/30 to-transparent" />
          </a>
        </div>
      </div>
      
      <div className="hidden lg:block absolute right-10 top-1/2 -translate-y-1/2 w-[420px] h-[420px] pointer-events-none">
        <div className="relative w-full h-full">
          <div className="absolute inset-0 rounded-full blur-[70px] opacity-70 bg-[radial-gradient(circle_at_center,rgba(255,64,129,0.18),transparent_60%)]" />
          <div className="absolute inset-0 rounded-full blur-[80px] opacity-60 bg-[radial-gradient(circle_at_center,rgba(0,176,255,0.18),transparent_65%)]" />

          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 animate-float-complex">
            <Image src="/logo.svg" alt="PALIRA IMPORTS" width={300} height={300} priority sizes="(max-width: 1024px) 220px, 300px" className="drop-shadow-2xl saturate-110" />
          </div>

          <div className="absolute left-6 top-6 text-5xl text-[var(--brand-3)] animate-sparkle">★</div>
          <div className="absolute right-8 top-8 text-5xl text-yellow-400 animate-bounce">☀️</div>
          <div className="absolute left-8 bottom-8 text-5xl text-[var(--brand-4)] animate-float">🌙</div>
          <div className="absolute right-6 bottom-6 w-16 h-16 rounded-full bg-[var(--brand-5)]/40 shadow-md animate-float" />
          <div className="absolute left-1/2 -translate-x-1/2 -top-2 w-14 h-14 rounded-xl bg-[var(--brand-2)]/30 rotate-12 shadow-md animate-bounce" />
          <div className="absolute left-20 top-1/2 -translate-y-1/2 w-10 h-10 rounded-lg bg-[var(--brand-1)]/40 rotate-6 shadow-sm animate-float" />
        </div>
      </div>

      <div className="block lg:hidden absolute right-4 bottom-6 w-[240px] h-[240px] pointer-events-none">
        <div className="relative w-full h-full">
          <div className="absolute inset-0 rounded-full blur-[50px] opacity-70 bg-[radial-gradient(circle_at_center,rgba(255,64,129,0.2),transparent_60%)]" />
          <div className="absolute inset-0 rounded-full blur-[60px] opacity-60 bg-[radial-gradient(circle_at_center,rgba(0,176,255,0.18),transparent_65%)]" />

          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 animate-float-complex">
            <Image src="/logo.svg" alt="PALIRA IMPORTS" width={220} height={220} priority sizes="(max-width: 768px) 220px, 220px" className="drop-shadow-2xl saturate-110" />
          </div>

          <div className="absolute left-4 top-4 text-3xl text-[var(--brand-3)] animate-sparkle">★</div>
          <div className="absolute right-4 top-4 text-3xl text-yellow-400 animate-bounce">☀️</div>
          <div className="absolute left-4 bottom-4 text-3xl text-[var(--brand-4)] animate-float">🌙</div>
          <div className="absolute right-4 bottom-4 w-10 h-10 rounded-full bg-[var(--brand-5)]/40 shadow-md animate-float" />
          <div className="absolute left-1/2 -translate-x-1/2 -top-1 w-10 h-10 rounded-xl bg-[var(--brand-2)]/30 rotate-12 shadow-md animate-bounce" />
        </div>
      </div>
    </section>
  )
}
