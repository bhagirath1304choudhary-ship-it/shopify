import { NextResponse } from "next/server"
import { dbConnect } from "@/lib/mongodb"
import { User } from "@/models/user"
import { getTokenFromCookie, verifyToken } from "@/lib/auth"

export async function GET() {
  try {
    const token = getTokenFromCookie()
    if (!token) return NextResponse.json({ user: null })
    const decoded = verifyToken<{ sub: string }>(token)
    if (!decoded) return NextResponse.json({ user: null })
    await dbConnect()
    const user = await User.findById(decoded.sub).select("_id name email")
    return NextResponse.json({ user })
  } catch {
    return NextResponse.json({ user: null })
  }
}
