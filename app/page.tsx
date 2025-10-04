import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function HomePage() {
  return (
    <main className="max-w-6xl mx-auto px-4 py-10">
      <div className="flex flex-col items-center text-center gap-4">
        <h1 className="text-3xl md:text-4xl font-semibold text-balance">Headless Shopify Store</h1>
        <p className="text-muted-foreground max-w-prose">
          Explore products, add to cart, and checkout securely on Shopify. Accounts, reviews, and wishlists are powered
          by MongoDB.
        </p>
        <Button asChild>
          <Link href="/products">Browse products</Link>
        </Button>
      </div>
    </main>
  )
}
