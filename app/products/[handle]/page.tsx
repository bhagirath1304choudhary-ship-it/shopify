import { getProductByHandle } from "@/lib/shopify"
import { ProductDetail } from "@/components/product-detail"
import { Reviews } from "@/components/reviews"

export const revalidate = 300

export default async function ProductPage({ params }: { params: { handle: string } }) {
  const product = await getProductByHandle(params.handle)
  if (!product) {
    return (
      <main className="max-w-4xl mx-auto px-4 py-10">
        <h1 className="text-2xl font-semibold">Product not found</h1>
      </main>
    )
  }

  return (
    <main className="max-w-6xl mx-auto px-4 py-8">
      <ProductDetail product={product} />
      <Reviews productShopifyId={product.id} />
    </main>
  )
}
