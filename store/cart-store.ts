"use client"

import { create } from "zustand"
import { persist } from "zustand/middleware"

export type CartItem = {
  productId: string
  handle: string
  title: string
  image?: { url: string; alt?: string }
  variantId: string
  variantTitle?: string
  price: { amount: string; currencyCode: string }
  quantity: number
}

type CartState = {
  items: CartItem[]
  addItem: (item: Omit<CartItem, "quantity">, qty?: number) => void
  removeItem: (variantId: string) => void
  updateQuantity: (variantId: string, qty: number) => void
  clear: () => void
}

export const useCart = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      addItem: (item, qty = 1) => {
        const existing = get().items.find((i) => i.variantId === item.variantId)
        if (existing) {
          set({
            items: get().items.map((i) => (i.variantId === item.variantId ? { ...i, quantity: i.quantity + qty } : i)),
          })
        } else {
          set({ items: [...get().items, { ...item, quantity: qty }] })
        }
      },
      removeItem: (variantId) => set({ items: get().items.filter((i) => i.variantId !== variantId) }),
      updateQuantity: (variantId, qty) =>
        set({
          items: get().items.map((i) => (i.variantId === variantId ? { ...i, quantity: Math.max(1, qty) } : i)),
        }),
      clear: () => set({ items: [] }),
    }),
    { name: "shop-cart" },
  ),
)
