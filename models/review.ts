import mongoose, { Schema, models } from "mongoose"

const ReviewSchema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    productShopifyId: { type: String, required: true, index: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String },
  },
  { timestamps: { createdAt: true, updatedAt: false } },
)

export const Review = models.Review || mongoose.model("Review", ReviewSchema)
