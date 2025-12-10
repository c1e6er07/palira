export default async function AdminPedidosPage() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL ?? ''}/api/orders`, { cache: 'no-store' }).catch(() => undefined)
  const data = res && res.ok ? await res.json() : { persisted: false, orders: [] }
  const orders: Array<{ id: string; total: number; payment_method: string; status: string; created_at?: string }> = data.orders ?? []

  return (
    <div className="flex min-h-screen items-start justify-center kids-gradient-bg font-sans pb-20">
      <main className="container w-full py-16">
        <h1 className="text-4xl font-black text-[var(--foreground)] mb-8">Pedidos</h1>

        {orders.length === 0 ? (
          <div className="card p-10 text-center">
            <div className="text-6xl mb-4">📭</div>
            <p className="text-xl font-bold text-[var(--foreground)]">Nenhum pedido encontrado</p>
            <p className="text-[var(--foreground)]/60">Finalize um pagamento para aparecer aqui.</p>
          </div>
        ) : (
          <div className="card p-0 overflow-hidden">
            <div className="grid grid-cols-5 gap-0 text-sm font-bold bg-white/80">
              <div className="px-4 py-3">ID</div>
              <div className="px-4 py-3">Total</div>
              <div className="px-4 py-3">Método</div>
              <div className="px-4 py-3">Status</div>
              <div className="px-4 py-3">Criado</div>
            </div>
            <div>
              {orders.map((o) => (
                <div key={o.id} className="grid grid-cols-5 items-center border-t border-[var(--brand-2)]/10 text-sm">
                  <div className="px-4 py-3 font-mono">{o.id}</div>
                  <div className="px-4 py-3 font-bold text-[var(--brand-1)]">R$ {o.total.toFixed(2)}</div>
                  <div className="px-4 py-3">{o.payment_method?.toUpperCase?.()}</div>
                  <div className="px-4 py-3">{o.status}</div>
                  <div className="px-4 py-3">{o.created_at ? new Date(o.created_at).toLocaleString() : '-'}</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  )
}

