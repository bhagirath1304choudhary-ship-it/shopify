import { type NextRequest, NextResponse } from "next/server"
import { dbConnect } from "@/lib/mongodb"
import { User } from "@/models/user"
import { hashPassword, signToken, setAuthCookie } from "@/lib/auth"

export async function POST(req: NextRequest) {
  try {
    const { name, email, password } = await req.json()
    if (!name || !email || !password) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 })
    }
    await dbConnect()
    const exists = await User.findOne({ email })
    if (exists) return NextResponse.json({ error: "Email already in use" }, { status: 409 })
    const hashed = await hashPassword(password)
    const user = await User.create({ name, email, password: hashed })
    const token = signToken({ sub: user._id.toString(), email: user.email, name: user.name })
    setAuthCookie(token)
    return NextResponse.json({ user: { _id: user._id, name: user.name, email: user.email } })
  } catch (e) {
    return NextResponse.json({ error: "Server error" }, { status: 500 })
  }
}
