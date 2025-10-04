"use client"

import useSWR from "swr"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { useToast } from "@/hooks/use-toast"

const fetcher = (url: string) => fetch(url).then((r) => r.json())

export function Reviews({ productShopifyId }: { productShopifyId: string }) {
  const { data, mutate } = useSWR<{ reviews: any[] }>(`/api/reviews/${encodeURIComponent(productShopifyId)}`, fetcher)
  const [rating, setRating] = useState(5)
  const [comment, setComment] = useState("")
  const { toast } = useToast()

  const submit = async () => {
    const res = await fetch(`/api/reviews/${encodeURIComponent(productShopifyId)}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ rating, comment }),
    })
    if (!res.ok) {
      const j = await res.json().catch(() => ({}))
      toast({ title: "Could not submit review", description: j.error || "Please login first" })
      return
    }
    setComment("")
    await mutate()
    toast({ title: "Review submitted" })
  }

  return (
    <div className="mt-10 space-y-4">
      <h2 className="text-lg font-semibold">Reviews</h2>
      <div className="space-y-2">
        {(data?.reviews || []).length === 0 && <div className="text-sm text-muted-foreground">No reviews yet.</div>}
        <ul className="space-y-3">
          {data?.reviews?.map((r) => (
            <li key={r._id} className="rounded-md border p-3">
              <div className="text-sm font-medium">{r.user?.name || "User"}</div>
              <div className="text-sm">Rating: {r.rating}/5</div>
              {r.comment && <div className="text-sm text-muted-foreground">{r.comment}</div>}
            </li>
          ))}
        </ul>
      </div>
      <div className="border-t pt-4 space-y-2">
        <div className="text-sm font-medium">Leave a review</div>
        <div className="flex items-center gap-2">
          <Input
            type="number"
            min={1}
            max={5}
            value={rating}
            onChange={(e) => setRating(Number(e.target.value))}
            className="w-24"
          />
          <Textarea value={comment} onChange={(e) => setComment(e.target.value)} placeholder="Your thoughts..." />
        </div>
        <Button onClick={submit}>Submit</Button>
      </div>
    </div>
  )
}
