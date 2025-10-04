"use client"

import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { useCart } from "@/store/cart-store"

type Product = {
  id: string
  handle: string
  title: string
  featuredImage?: { url: string; altText?: string; width?: number; height?: number }
  priceRange: { minVariantPrice: { amount: string; currencyCode: string } }
  variants?: {
    edges: Array<{
      node: { id: string; availableForSale: boolean; title: string; price: { amount: string; currencyCode: string } }
    }>
  }
}

export function ProductCard({ product }: { product: Product }) {
  const add = useCart((s) => s.addItem)
  const firstVariant = product.variants?.edges?.[0]?.node
  const price = firstVariant?.price || product.priceRange.minVariantPrice

  return (
    <div className="rounded-lg border bg-card text-card-foreground p-4 flex flex-col gap-3">
      <Link href={`/products/${product.handle}`} className="block">
        <div className="aspect-square w-full overflow-hidden rounded-md bg-muted">
          {product.featuredImage?.url ? (
            <Image
              src={product.featuredImage.url || "/placeholder.svg"}
              alt={product.featuredImage.altText || product.title}
              width={600}
              height={600}
              className="h-full w-full object-cover"
            />
          ) : (
            <img src="/product-image-placeholder.png" alt="" className="h-full w-full object-cover" />
          )}
        </div>
        <h3 className="mt-2 text-pretty font-medium">{product.title}</h3>
      </Link>
      <div className="flex items-center justify-between">
        <span className="font-semibold">
          {Number(price.amount).toLocaleString(undefined, {
            style: "currency",
            currency: price.currencyCode,
          })}
        </span>
        <Button
          size="sm"
          onClick={() => {
            if (!firstVariant) return
            add(
              {
                productId: product.id,
                handle: product.handle,
                title: product.title,
                image: product.featuredImage
                  ? { url: product.featuredImage.url, alt: product.featuredImage.altText || "" }
                  : undefined,
                variantId: firstVariant.id,
                variantTitle: firstVariant.title,
                price: price,
              },
              1,
            )
          }}
        >
          Add to cart
        </Button>
      </div>
    </div>
  )
}
