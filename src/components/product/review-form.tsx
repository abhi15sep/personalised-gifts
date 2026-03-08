"use client"

import { useState } from "react"
import { useUser } from "@clerk/nextjs"
import { Star } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { submitReview } from "@/lib/actions/reviews"

interface ReviewFormProps {
  productId: number
}

export function ReviewForm({ productId }: ReviewFormProps) {
  const { isSignedIn } = useUser()
  const [open, setOpen] = useState(false)
  const [rating, setRating] = useState(0)
  const [hoveredRating, setHoveredRating] = useState(0)
  const [title, setTitle] = useState("")
  const [body, setBody] = useState("")
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  if (success) {
    return (
      <div className="rounded-lg border border-green-200 bg-green-50 p-4 text-sm text-green-800">
        Thank you for your review!
      </div>
    )
  }

  if (!isSignedIn) {
    return (
      <p className="text-sm text-gray-500">
        <a href="/sign-in" className="text-rose underline hover:no-underline">
          Sign in
        </a>{" "}
        to leave a review.
      </p>
    )
  }

  if (!open) {
    return (
      <Button
        variant="outline"
        onClick={() => setOpen(true)}
        className="text-sm"
      >
        Write a Review
      </Button>
    )
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)

    if (rating === 0) {
      setError("Please select a star rating.")
      return
    }
    if (!body.trim()) {
      setError("Please write your review.")
      return
    }

    setSubmitting(true)
    try {
      await submitReview({ productId, rating, title, body })
      setSuccess(true)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to submit review.")
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 rounded-lg border border-gray-200 p-4">
      <h4 className="text-sm font-semibold text-charcoal">Write a Review</h4>

      {error && (
        <div className="rounded border border-destructive bg-destructive/10 px-3 py-2 text-sm text-destructive">
          {error}
        </div>
      )}

      {/* Star Rating */}
      <div>
        <label className="mb-1 block text-sm font-medium text-gray-700">
          Rating
        </label>
        <div className="flex gap-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onClick={() => setRating(star)}
              onMouseEnter={() => setHoveredRating(star)}
              onMouseLeave={() => setHoveredRating(0)}
              className="p-0.5 transition-colors"
            >
              <Star
                className={`size-6 ${
                  star <= (hoveredRating || rating)
                    ? "fill-yellow-400 text-yellow-400"
                    : "text-gray-300"
                }`}
              />
            </button>
          ))}
        </div>
      </div>

      {/* Title */}
      <div>
        <label htmlFor="review-title" className="mb-1 block text-sm font-medium text-gray-700">
          Title <span className="text-gray-400">(optional)</span>
        </label>
        <Input
          id="review-title"
          placeholder="Summarise your experience"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          maxLength={100}
        />
      </div>

      {/* Body */}
      <div>
        <label htmlFor="review-body" className="mb-1 block text-sm font-medium text-gray-700">
          Your Review
        </label>
        <Textarea
          id="review-body"
          placeholder="What did you like or dislike about this product?"
          value={body}
          onChange={(e) => setBody(e.target.value)}
          rows={4}
          maxLength={1000}
        />
      </div>

      {/* Actions */}
      <div className="flex gap-3">
        <Button type="submit" disabled={submitting} size="sm">
          {submitting ? "Submitting..." : "Submit Review"}
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => setOpen(false)}
        >
          Cancel
        </Button>
      </div>
    </form>
  )
}
