import { type NextRequest, NextResponse } from "next/server"
import { dbConnect } from "@/lib/mongodb"
import { Review } from "@/models/review"
import { getTokenFromCookie, verifyToken } from "@/lib/auth"

export async function GET(_req: NextRequest, { params }: { params: { productId: string } }) {
  try {
    await dbConnect()
    const reviews = await Review.find({ productShopifyId: params.productId })
      .populate("user", "name")
      .sort({ createdAt: -1 })
      .lean()
    return NextResponse.json({ reviews })
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 })
  }
}

export async function POST(req: NextRequest, { params }: { params: { productId: string } }) {
  try {
    const token = getTokenFromCookie()
    const decoded = token ? verifyToken<{ sub: string }>(token) : null
    if (!decoded) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    const { rating, comment } = await req.json()
    if (!rating) return NextResponse.json({ error: "Missing rating" }, { status: 400 })
    await dbConnect()
    const review = await Review.create({
      user: decoded.sub,
      productShopifyId: params.productId,
      rating,
      comment: comment || "",
    })
    return NextResponse.json({ review })
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 })
  }
}
