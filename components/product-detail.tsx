"use client"

import { useMemo, useState } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { useCart } from "@/store/cart-store"

type Variant = {
  id: string
  availableForSale: boolean
  title: string
  price: { amount: string; currencyCode: string }
  selectedOptions: { name: string; value: string }[]
}

export function ProductDetail({ product }: { product: any }) {
  const add = useCart((s) => s.addItem)
  const images = product.images?.edges?.map((e: any) => e.node) || []
  const variants: Variant[] = (product.variants?.edges || []).map((e: any) => e.node)
  const options: { name: string; values: string[] }[] = product.options || []

  const [selected, setSelected] = useState<Record<string, string>>(() =>
    Object.fromEntries(options.map((o) => [o.name, o.values?.[0]])),
  )

  const activeVariant = useMemo(() => {
    if (!variants.length) return null
    return variants.find((v) => v.selectedOptions.every((opt) => selected[opt.name] === opt.value)) || variants[0]
  }, [selected, variants])

  return (
    <div className="grid md:grid-cols-2 gap-6">
      <div className="space-y-3">
        <div className="aspect-square w-full overflow-hidden rounded-md bg-muted">
          {images[0]?.url ? (
            <Image
              src={images[0].url || "/placeholder.svg"}
              alt={images[0].altText || product.title}
              width={800}
              height={800}
              className="h-full w-full object-cover"
            />
          ) : (
            <img src="/product-detail-showcase.png" alt="" className="h-full w-full object-cover" />
          )}
        </div>
        <div className="grid grid-cols-4 gap-2">
          {images.slice(1).map((img: any, idx: number) => (
            <Image
              key={idx}
              src={img.url || "/placeholder.svg"}
              alt={img.altText || product.title}
              width={200}
              height={200}
              className="h-20 w-full object-cover rounded-md"
            />
          ))}
        </div>
      </div>
      <div className="space-y-4">
        <h1 className="text-2xl font-semibold text-pretty">{product.title}</h1>
        <div
          className="prose prose-sm max-w-none text-foreground/80"
          dangerouslySetInnerHTML={{ __html: product.descriptionHtml || "" }}
        />
        {options.length > 0 && (
          <div className="space-y-3">
            {options.map((o) => (
              <div key={o.name} className="space-y-2">
                <div className="text-sm font-medium">{o.name}</div>
                <div className="flex flex-wrap gap-2">
                  {o.values.map((v) => {
                    const isActive = selected[o.name] === v
                    return (
                      <button
                        key={v}
                        onClick={() => setSelected((s) => ({ ...s, [o.name]: v }))}
                        className={`px-3 py-1 rounded-md border ${
                          isActive ? "bg-primary text-primary-foreground" : "bg-card"
                        }`}
                      >
                        {v}
                      </button>
                    )
                  })}
                </div>
              </div>
            ))}
          </div>
        )}
        <div className="flex items-center justify-between">
          <div className="text-xl font-semibold">
            {activeVariant
              ? Number(activeVariant.price.amount).toLocaleString(undefined, {
                  style: "currency",
                  currency: activeVariant.price.currencyCode,
                })
              : ""}
          </div>
          <Button
            disabled={!activeVariant?.availableForSale}
            onClick={() => {
              if (!activeVariant) return
              const featured = product.featuredImage
              add(
                {
                  productId: product.id,
                  handle: product.handle,
                  title: product.title,
                  image: featured ? { url: featured.url, alt: featured.altText || "" } : undefined,
                  variantId: activeVariant.id,
                  variantTitle: activeVariant.title,
                  price: activeVariant.price,
                },
                1,
              )
            }}
          >
            {activeVariant?.availableForSale ? "Add to cart" : "Out of stock"}
          </Button>
        </div>
      </div>
    </div>
  )
}
