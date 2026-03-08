"use client"

import { useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import { OrderStatus } from "@prisma/client"
import { updateOrderStatus } from "@/lib/actions/admin-orders"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

const STATUS_OPTIONS: OrderStatus[] = [
  "PENDING",
  "PAID",
  "PROCESSING",
  "SHIPPED",
  "DELIVERED",
  "CANCELLED",
  "REFUNDED",
]

export function StatusUpdateForm({
  orderId,
  currentStatus,
}: {
  orderId: string
  currentStatus: OrderStatus
}) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [status, setStatus] = useState<OrderStatus>(currentStatus)
  const [comment, setComment] = useState("")
  const [imageUrl, setImageUrl] = useState("")
  const [uploading, setUploading] = useState(false)

  async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return

    setUploading(true)
    try {
      const formData = new FormData()
      formData.append("file", file)

      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      })

      if (res.ok) {
        const data = await res.json()
        setImageUrl(data.url)
      }
    } finally {
      setUploading(false)
    }
  }

  function handleSubmit() {
    if (status === currentStatus && !comment) return

    startTransition(async () => {
      await updateOrderStatus(orderId, status, comment, imageUrl)
      setComment("")
      setImageUrl("")
      router.refresh()
    })
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Update Status</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label>New Status</Label>
          <Select
            value={status}
            onValueChange={(v) => setStatus(v as OrderStatus)}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {STATUS_OPTIONS.map((s) => (
                <SelectItem key={s} value={s}>
                  {s}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Comment (optional)</Label>
          <Textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Add a note about this status change..."
            rows={3}
          />
        </div>

        <div className="space-y-2">
          <Label>Attach Image (optional)</Label>
          <Input
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            disabled={uploading}
          />
          {imageUrl && (
            <p className="text-xs text-muted-foreground">
              Image uploaded successfully
            </p>
          )}
        </div>

        <Button
          onClick={handleSubmit}
          disabled={isPending || uploading || (status === currentStatus && !comment)}
        >
          {isPending ? "Updating..." : "Update Order Status"}
        </Button>
      </CardContent>
    </Card>
  )
}
