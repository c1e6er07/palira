// @vitest-environment jsdom
import { describe, it, expect } from 'vitest'
import React from 'react'
import { render } from '@testing-library/react'
import { CartProvider, useCart } from '@/store/cart'

type ProductLike = { id: string; title: string; price: number }
type CartApi = {
  items: Array<{ id: string; price: number; qty: number }>
  add: (p: ProductLike, qty?: number) => void
  remove: (id: string) => void
  updateQty: (id: string, qty: number) => void
  clear: () => void
  count: number
  total: number
}

function Host({ capture }: { capture: (api: CartApi) => void }) {
  const api = useCart() as unknown as CartApi
  React.useEffect(() => capture(api), [api, capture])
  return null
}

describe('Cart store', () => {
  it('add/update/remove/clear atualiza count e total', () => {
    let api: CartApi | null = null
    render(
      <CartProvider>
        <Host capture={(a) => (api = a)} />
      </CartProvider>
    )
    expect(api).toBeTruthy()
    const cart = api!

    const a: ProductLike = { id: 'a', title: 'A', price: 10 }
    const b: ProductLike = { id: 'b', title: 'B', price: 5 }

    // add items
    cart.add(a, 2)
    cart.add(b, 1)
    expect(cart.count).toBe(3)
    expect(cart.total).toBe(25)

    // update qty
    cart.updateQty('b', 3)
    expect(cart.count).toBe(5)
    expect(cart.total).toBe(35)

    // remove
    cart.remove('a')
    expect(cart.count).toBe(3)
    expect(cart.total).toBe(15)

    // clear
    cart.clear()
    expect(cart.count).toBe(0)
    expect(cart.total).toBe(0)
  })
})

