import mongoose from "mongoose"

const MONGODB_URI = process.env.MONGODB_URI

if (!MONGODB_URI) {
  console.warn("[v0] Missing MONGODB_URI. Add it in Project Settings.")
}

type MongooseGlobal = typeof globalThis & {
  _mongooseConn?: { conn: typeof mongoose | null; promise: Promise<typeof mongoose> | null }
}

let cached = (global as MongooseGlobal)._mongooseConn

if (!cached) {
  cached = (global as MongooseGlobal)._mongooseConn = { conn: null, promise: null }
}

export async function dbConnect() {
  if (cached!.conn) return cached!.conn
  if (!cached!.promise) {
    cached!.promise = mongoose.connect(MONGODB_URI as string, { dbName: "shop" })
  }
  cached!.conn = await cached!.promise
  return cached!.conn
}
