import mongoose, { Schema, models } from "mongoose"

const UserSchema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, index: true },
    password: { type: String, required: true },
  },
  { timestamps: { createdAt: true, updatedAt: true } },
)

export type IUser = {
  _id: string
  name: string
  email: string
  password: string
}

export const User = models.User || mongoose.model("User", UserSchema)
