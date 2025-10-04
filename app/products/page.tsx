import { getAllProducts } from "@/lib/shopify"
import { ProductGrid } from "@/components/product-grid"

export const dynamic = "force-static"

export default async function ProductsPage() {
  const products = await getAllProducts()
  return (
    <main className="max-w-6xl mx-auto px-4 py-8 space-y-6">
      <header className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">All Products</h1>
      </header>
      <ProductGrid products={products} />
    </main>
  )
}
