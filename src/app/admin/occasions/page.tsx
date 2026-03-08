"use client"

import { useState, useEffect, useTransition } from "react"
import Image from "next/image"
import { ImageIcon, Save } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  getAdminOccasions,
  updateOccasion,
} from "@/lib/actions/admin-occasions"

interface OccasionRow {
  id: number
  name: string
  slug: string
  icon: string | null
  bannerUrl: string | null
  tagline: string | null
  productCount: number
}

function OccasionEditDialog({
  occasion,
  onSaved,
}: {
  occasion: OccasionRow
  onSaved: () => void
}) {
  const [open, setOpen] = useState(false)
  const [isPending, startTransition] = useTransition()
  const [bannerUrl, setBannerUrl] = useState(occasion.bannerUrl || "")
  const [tagline, setTagline] = useState(occasion.tagline || "")
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
        setBannerUrl(data.url)
      }
    } finally {
      setUploading(false)
    }
  }

  function handleSave() {
    startTransition(async () => {
      await updateOccasion(occasion.id, {
        bannerUrl: bannerUrl || null,
        tagline: tagline || null,
      })
      setOpen(false)
      onSaved()
    })
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          Edit Banner
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>
            {occasion.icon} {occasion.name} — Banner Settings
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4 pt-2">
          <div className="space-y-2">
            <Label>Banner Image</Label>
            {bannerUrl && (
              <div className="relative h-40 overflow-hidden rounded-lg">
                <Image
                  src={bannerUrl}
                  alt="Banner preview"
                  fill
                  className="object-cover"
                />
              </div>
            )}
            <Input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              disabled={uploading}
            />
            <p className="text-xs text-muted-foreground">
              Or paste an image URL directly:
            </p>
            <Input
              value={bannerUrl}
              onChange={(e) => setBannerUrl(e.target.value)}
              placeholder="/images/banners/occasion.jpg or https://..."
            />
          </div>

          <div className="space-y-2">
            <Label>Tagline</Label>
            <Textarea
              value={tagline}
              onChange={(e) => setTagline(e.target.value)}
              placeholder="e.g. Show them how much you care with a gift made just for them"
              rows={2}
            />
          </div>

          <div className="flex gap-2 justify-end">
            <Button
              variant="outline"
              onClick={() => setOpen(false)}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              disabled={isPending || uploading}
            >
              <Save className="mr-2 size-4" />
              {isPending ? "Saving..." : "Save"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default function AdminOccasionsPage() {
  const [occasions, setOccasions] = useState<OccasionRow[]>([])
  const [isPending, startTransition] = useTransition()

  const loadOccasions = () => {
    startTransition(async () => {
      const data = await getAdminOccasions()
      setOccasions(data)
    })
  }

  useEffect(() => {
    loadOccasions()
  }, [])

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Occasions</h2>
        <p className="text-muted-foreground">
          Manage occasion banners and taglines displayed on occasion pages.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {occasions.map((occasion) => (
          <Card key={occasion.id}>
            <div className="relative h-36 overflow-hidden rounded-t-lg bg-muted">
              {occasion.bannerUrl ? (
                <Image
                  src={occasion.bannerUrl}
                  alt={occasion.name}
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="flex h-full items-center justify-center text-muted-foreground">
                  <ImageIcon className="size-8" />
                </div>
              )}
            </div>
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center justify-between text-base">
                <span>
                  {occasion.icon} {occasion.name}
                </span>
                <span className="text-xs font-normal text-muted-foreground">
                  {occasion.productCount} products
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {occasion.tagline ? (
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {occasion.tagline}
                </p>
              ) : (
                <p className="text-sm text-muted-foreground italic">
                  No tagline set — using default
                </p>
              )}
              <OccasionEditDialog
                occasion={occasion}
                onSaved={loadOccasions}
              />
            </CardContent>
          </Card>
        ))}
      </div>

      {isPending && occasions.length === 0 && (
        <p className="text-center text-muted-foreground py-8">Loading...</p>
      )}
    </div>
  )
}
