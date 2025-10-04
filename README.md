# Headless Shopify Store (Next.js + MongoDB)

A headless e-commerce app using:
- Next.js App Router
- Shopify Storefront API for products and checkout
- MongoDB (Mongoose) for users, reviews, and wishlist
- Zustand for cart state (persisted)
- Tailwind + shadcn/ui for UI

## Environment Variables (Project Settings → Environment Variables)

Set these server-side variables:
- SHOPIFY_STORE_DOMAIN (e.g. myshop.myshopify.com)
- SHOPIFY_STOREFRONT_ACCESS_TOKEN
- MONGODB_URI (MongoDB Atlas connection string)
- JWT_SECRET

## Key Pages

- `/` — Landing
- `/products` — PLP (SSG)
- `/products/[handle]` — PDP (ISR: 5 min)
- `/cart` — Cart page with redirect to Shopify checkout

## API Routes

- `POST /api/auth/register` — { name, email, password }
- `POST /api/auth/login` — { email, password }
- `GET /api/auth/me`
- `GET /api/reviews/:productId`, `POST /api/reviews/:productId`
- `GET /api/wishlist`, `POST /api/wishlist` — { productShopifyId, action: "add"|"remove" }
- `POST /api/shopify/cart` — { items: [{ variantId, quantity }] } → { checkoutUrl }

## Development Notes

- Cart is stored client-side and sent to the server only at checkout to create a Shopify cart and redirect to Shopify’s secure checkout.
- Reviews and wishlists require login (JWT cookie is set on register/login).
- You can deploy to Vercel from v0. Use the shadcn CLI or download ZIP to install locally.
