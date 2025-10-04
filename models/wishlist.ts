import mongoose, { Schema, models } from "mongoose"

const WishlistSchema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true, unique: true },
    products: [{ productShopifyId: { type: String } }],
  },
  { timestamps: { createdAt: false, updatedAt: true } },
)

export const Wishlist = models.Wishlist || mongoose.model("Wishlist", WishlistSchema)
