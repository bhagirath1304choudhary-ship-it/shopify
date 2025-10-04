import { type NextRequest, NextResponse } from "next/server"
import { dbConnect } from "@/lib/mongodb"
import { Wishlist } from "@/models/wishlist"
import { getTokenFromCookie, verifyToken } from "@/lib/auth"

export async function GET() {
  try {
    const token = getTokenFromCookie()
    const decoded = token ? verifyToken<{ sub: string }>(token) : null
    if (!decoded) return NextResponse.json({ items: [] })
    await dbConnect()
    const wl = await Wishlist.findOne({ user: decoded.sub }).lean()
    return NextResponse.json({ items: wl?.products || [] })
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const token = getTokenFromCookie()
    const decoded = token ? verifyToken<{ sub: string }>(token) : null
    if (!decoded) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    const { productShopifyId, action } = await req.json()
    if (!productShopifyId || !["add", "remove"].includes(action)) {
      return NextResponse.json({ error: "Invalid payload" }, { status: 400 })
    }
    await dbConnect()
    let wl = await Wishlist.findOne({ user: decoded.sub })
    if (!wl) wl = await Wishlist.create({ user: decoded.sub, products: [] })
    if (action === "add") {
      if (!wl.products.some((p: any) => p.productShopifyId === productShopifyId)) {
        wl.products.push({ productShopifyId })
      }
    } else {
      wl.products = wl.products.filter((p: any) => p.productShopifyId !== productShopifyId)
    }
    await wl.save()
    return NextResponse.json({ items: wl.products })
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 })
  }
}
