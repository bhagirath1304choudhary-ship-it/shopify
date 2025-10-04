import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import { cookies } from "next/headers"

const JWT_SECRET = process.env.JWT_SECRET || "change-me-in-prod"
const COOKIE_NAME = "shop_token"
const COOKIE_MAX_AGE = 60 * 60 * 24 * 30 // 30 days

export async function hashPassword(password: string) {
  const salt = await bcrypt.genSalt(10)
  return bcrypt.hash(password, salt)
}

export async function comparePassword(password: string, hash: string) {
  return bcrypt.compare(password, hash)
}

export function signToken(payload: Record<string, any>) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: "30d" })
}

export function verifyToken<T = any>(token: string): T | null {
  try {
    return jwt.verify(token, JWT_SECRET) as T
  } catch {
    return null
  }
}

export function setAuthCookie(token: string) {
  cookies().set(COOKIE_NAME, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: true,
    maxAge: COOKIE_MAX_AGE,
    path: "/",
  })
}

export function clearAuthCookie() {
  cookies().set(COOKIE_NAME, "", { httpOnly: true, maxAge: 0, path: "/" })
}

export function getTokenFromCookie() {
  return cookies().get(COOKIE_NAME)?.value
}
