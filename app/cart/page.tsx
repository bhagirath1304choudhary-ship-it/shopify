"use client"

import { useCart } from "@/store/cart-store"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useMemo, useState } from "react"

export default function CartPage() {
  const { items, updateQuantity, removeItem, clear } = useCart()
  const [loading, setLoading] = useState(false)
  const total = useMemo(() => {
    return items.reduce((sum, i) => sum + Number(i.price.amount) * i.quantity, 0)
  }, [items])

  const checkout = async () => {
    setLoading(true)
    try {
      const res = await fetch("/api/shopify/cart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: items.map((i) => ({ variantId: i.variantId, quantity: i.quantity })),
        }),
      })
      const j = await res.json()
      if (j.checkoutUrl) {
        clear()
        window.location.href = j.checkoutUrl
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="max-w-4xl mx-auto px-4 py-8 space-y-6">
      <h1 className="text-2xl font-semibold">Your Cart</h1>
      {items.length === 0 ? (
        <div className="text-muted-foreground">Your cart is empty.</div>
      ) : (
        <>
          <ul className="space-y-4">
            {items.map((i) => (
              <li key={i.variantId} className="flex gap-3 items-center rounded-md border p-3">
                <div className="h-16 w-16 overflow-hidden rounded bg-muted">
                  {i.image?.url ? (
                    <Image
                      src={i.image.url || "/placeholder.svg"}
                      alt={i.image.alt || i.title}
                      width={64}
                      height={64}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <img src="/cart-image.jpg" alt="" />
                  )}
                </div>
                <div className="flex-1">
                  <div className="font-medium">{i.title}</div>
                  <div className="text-sm text-muted-foreground">{i.variantTitle}</div>
                </div>
                <div className="w-24">
                  <Input
                    type="number"
                    min={1}
                    value={i.quantity}
                    onChange={(e) => updateQuantity(i.variantId, Number(e.target.value))}
                  />
                </div>
                <div className="w-28 text-right">
                  {(Number(i.price.amount) * i.quantity).toLocaleString(undefined, {
                    style: "currency",
                    currency: i.price.currencyCode,
                  })}
                </div>
                <Button variant="ghost" onClick={() => removeItem(i.variantId)}>
                  Remove
                </Button>
              </li>
            ))}
          </ul>
          <div className="flex items-center justify-between pt-4 border-t">
            <div className="text-lg font-semibold">
              {total.toLocaleString(undefined, {
                style: "currency",
                currency: items[0]?.price.currencyCode || "USD",
              })}
            </div>
            <Button onClick={checkout} disabled={loading}>
              {loading ? "Redirecting..." : "Proceed to Checkout"}
            </Button>
          </div>
        </>
      )}
    </main>
  )
}
