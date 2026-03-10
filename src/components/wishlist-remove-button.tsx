"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Loader2, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { toggleWishlist } from "@/lib/actions/user"

export function WishlistRemoveButton({ productId }: { productId: number }) {
  const [isRemoving, setIsRemoving] = useState(false)
  const router = useRouter()

  async function handleRemove() {
    setIsRemoving(true)
    try {
      await toggleWishlist(productId)
      router.refresh()
    } catch (err) {
      console.error("Failed to remove from wishlist:", err)
    } finally {
      setIsRemoving(false)
    }
  }

  return (
    <Button
      variant="ghost"
      size="icon"
      className="absolute top-2 right-2 z-10 h-8 w-8 rounded-full bg-white/80 hover:bg-white text-red-500 hover:text-red-600 shadow-sm"
      onClick={handleRemove}
      disabled={isRemoving}
    >
      {isRemoving ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : (
        <X className="h-4 w-4" />
      )}
    </Button>
  )
}