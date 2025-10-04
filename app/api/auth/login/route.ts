import { type NextRequest, NextResponse } from "next/server"
import { dbConnect } from "@/lib/mongodb"
import { User } from "@/models/user"
import { comparePassword, signToken, setAuthCookie } from "@/lib/auth"

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json()
    if (!email || !password) return NextResponse.json({ error: "Missing fields" }, { status: 400 })
    await dbConnect()
    const user = await User.findOne({ email })
    if (!user) return NextResponse.json({ error: "Invalid credentials" }, { status: 401 })
    const ok = await comparePassword(password, user.password)
    if (!ok) return NextResponse.json({ error: "Invalid credentials" }, { status: 401 })
    const token = signToken({ sub: user._id.toString(), email: user.email, name: user.name })
    setAuthCookie(token)
    return NextResponse.json({ user: { _id: user._id, name: user.name, email: user.email } })
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 })
  }
}
