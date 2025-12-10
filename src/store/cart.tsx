'use client'
import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import type { Product } from '@/data/products'

type CartItem = Product & { qty: number }
type CartContextValue = {
  items: CartItem[]
  add: (product: Product, qty?: number) => void
  remove: (id: string) => void
  updateQty: (id: string, qty: number) => void
  clear: () => void
  count: number
  total: number
}

const CartContext = createContext<CartContextValue | undefined>(undefined)
const STORAGE_KEY = 'palira_cart'

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>(() => {
    try {
      const raw = typeof window !== 'undefined' ? localStorage.getItem(STORAGE_KEY) : null
      return raw ? JSON.parse(raw) : []
    } catch {
      return []
    }
  })

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
    } catch {}
  }, [items])

  const add = (product: Product, qty = 1) => {
    setItems((prev) => {
      const existing = prev.find((i) => i.id === product.id)
      if (existing) {
        return prev.map((i) => (i.id === product.id ? { ...i, qty: i.qty + qty } : i))
      }
      return [...prev, { ...product, qty }]
    })
  }

  const remove = (id: string) => setItems((prev) => prev.filter((i) => i.id !== id))
  const updateQty = (id: string, qty: number) => setItems((prev) => prev.map((i) => (i.id === id ? { ...i, qty: Math.max(1, qty) } : i)))
  const clear = () => setItems([])

  const { count, total } = useMemo(() => {
    const count = items.reduce((acc, i) => acc + i.qty, 0)
    const total = items.reduce((acc, i) => acc + i.price * i.qty, 0)
    return { count, total }
  }, [items])

  const value: CartContextValue = { items, add, remove, updateQty, clear, count, total }
  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('CartProvider is missing')
  return ctx
}
