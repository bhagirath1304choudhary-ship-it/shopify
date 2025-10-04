import { type NextRequest, NextResponse } from "next/server"
import { createCartAndGetCheckoutUrl, type CartLine } from "@/lib/shopify"

export async function POST(req: NextRequest) {
  try {
    const { items } = await req.json()
    if (!Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ error: "No items" }, { status: 400 })
    }
    const lines: CartLine[] = items.map((i: any) => ({
      merchandiseId: i.variantId,
      quantity: i.quantity || 1,
    }))
    const url = await createCartAndGetCheckoutUrl(lines)
    if (!url) return NextResponse.json({ error: "Failed to create checkout" }, { status: 500 })
    return NextResponse.json({ checkoutUrl: url })
  } catch (e) {
    return NextResponse.json({ error: "Server error" }, { status: 500 })
  }
}
