const SHOPIFY_STORE_DOMAIN = process.env.SHOPIFY_STORE_DOMAIN
const SHOPIFY_STOREFRONT_ACCESS_TOKEN = process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN

if (!SHOPIFY_STORE_DOMAIN || !SHOPIFY_STOREFRONT_ACCESS_TOKEN) {
  console.warn(
    "[v0] Missing Shopify env vars. Set SHOPIFY_STORE_DOMAIN and SHOPIFY_STOREFRONT_ACCESS_TOKEN in Project Settings.",
  )
}

const API_VERSION = "2024-07"
const endpoint = SHOPIFY_STORE_DOMAIN ? `https://${SHOPIFY_STORE_DOMAIN}/api/${API_VERSION}/graphql.json` : ""

type FetchOptions = {
  query: string
  variables?: Record<string, any>
  cache?: RequestCache
  next?: { revalidate?: number }
}

export async function shopifyFetch<T>({ query, variables, cache = "force-cache", next }: FetchOptions): Promise<T> {
  const res = await fetch(endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Shopify-Storefront-Access-Token": SHOPIFY_STOREFRONT_ACCESS_TOKEN || "",
    },
    body: JSON.stringify({ query, variables }),
    cache,
    next,
  })

  if (!res.ok) {
    const text = await res.text()
    console.error("[v0] Shopify error:", text)
    throw new Error("Shopify request failed")
  }

  const json = await res.json()
  if (json.errors) {
    console.error("[v0] Shopify GraphQL errors:", json.errors)
    throw new Error("Shopify GraphQL errors")
  }
  return json.data
}

const PRODUCT_CARD_FIELDS = `
  id
  handle
  title
  featuredImage { url altText width height }
  priceRange {
    minVariantPrice { amount currencyCode }
    maxVariantPrice { amount currencyCode }
  }
  variants(first: 20) {
    edges {
      node {
        id
        availableForSale
        title
        price { amount currencyCode }
        selectedOptions { name value }
      }
    }
  }
`

export async function getAllProducts() {
  const query = `
    query GetProducts($first: Int!) {
      products(first: $first) {
        edges {
          node {
            ${PRODUCT_CARD_FIELDS}
          }
        }
      }
    }
  `
  const data = await shopifyFetch<{ products: { edges: Array<{ node: any }> } }>({
    query,
    variables: { first: 24 },
    cache: "force-cache",
  })
  return data.products.edges.map((e) => e.node)
}

export async function getProductByHandle(handle: string) {
  const query = `
    query GetProduct($handle: String!) {
      product(handle: $handle) {
        id
        handle
        title
        descriptionHtml
        images(first: 10) { edges { node { url altText width height } } }
        ${PRODUCT_CARD_FIELDS}
        options { name values }
      }
    }
  `
  const data = await shopifyFetch<{ product: any }>({
    query,
    variables: { handle },
    cache: "force-cache",
    next: { revalidate: 300 },
  })
  return data.product
}

export type CartLine = { merchandiseId: string; quantity: number }

export async function createCartAndGetCheckoutUrl(lines: CartLine[]) {
  const mutation = `
    mutation CreateCart($lines: [CartLineInput!]!) {
      cartCreate(input: { lines: $lines }) {
        cart {
          checkoutUrl
          id
        }
        userErrors { field message }
      }
    }
  `
  const data = await shopifyFetch<{
    cartCreate: { cart: { checkoutUrl: string } | null; userErrors: Array<{ message: string }> }
  }>({
    query: mutation,
    variables: { lines },
    cache: "no-store",
  })
  const errs = data.cartCreate?.userErrors
  if (errs && errs.length) {
    throw new Error(errs.map((e) => e.message).join(", "))
  }
  return data.cartCreate.cart?.checkoutUrl
}
