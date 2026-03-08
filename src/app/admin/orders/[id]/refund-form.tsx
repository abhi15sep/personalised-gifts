"use client"

import { useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { RotateCcw } from "lucide-react"
import { refundOrder } from "@/lib/actions/admin-orders"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export function RefundForm({
  orderId,
  totalAmount,
  paymentMethod,
  hasStripePaymentIntent,
}: {
  orderId: string
  totalAmount: number
  paymentMethod: string
  hasStripePaymentIntent: boolean
}) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [refundType, setRefundType] = useState<"full" | "partial">("full")
  const [amount, setAmount] = useState("")
  const [reason, setReason] = useState("")

  function handleSubmit() {
    if (!reason.trim()) {
      toast.error("Please provide a reason for the refund")
      return
    }

    const refundAmount =
      refundType === "full" ? undefined : parseFloat(amount)

    if (refundType === "partial") {
      if (!refundAmount || refundAmount <= 0 || refundAmount > totalAmount) {
        toast.error(
          `Refund amount must be between £0.01 and £${totalAmount.toFixed(2)}`
        )
        return
      }
    }

    startTransition(async () => {
      const result = await refundOrder(orderId, {
        amount: refundAmount,
        reason: reason.trim(),
      })

      if (result.success) {
        toast.success("Refund processed successfully")
        setReason("")
        setAmount("")
        router.refresh()
      } else {
        toast.error(result.error || "Failed to process refund")
      }
    })
  }

  return (
    <Card className="border-orange-200 bg-orange-50/50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <RotateCcw className="size-4" />
          Process Refund
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {paymentMethod === "phonepe" && (
          <div className="rounded-md border border-yellow-300 bg-yellow-50 p-3 text-sm text-yellow-800">
            PhonePe refunds must be processed manually via the PhonePe
            dashboard. This form will update the order status and record the
            refund.
          </div>
        )}

        {paymentMethod === "stripe" && !hasStripePaymentIntent && (
          <div className="rounded-md border border-yellow-300 bg-yellow-50 p-3 text-sm text-yellow-800">
            No Stripe payment intent found for this order. The refund will be
            recorded but not automatically processed via Stripe.
          </div>
        )}

        <div className="space-y-2">
          <Label>Refund Type</Label>
          <Select
            value={refundType}
            onValueChange={(v) => setRefundType(v as "full" | "partial")}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="full">
                Full Refund (£{totalAmount.toFixed(2)})
              </SelectItem>
              <SelectItem value="partial">Partial Refund</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {refundType === "partial" && (
          <div className="space-y-2">
            <Label>Refund Amount (£)</Label>
            <Input
              type="number"
              step="0.01"
              min="0.01"
              max={totalAmount}
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder={`Max £${totalAmount.toFixed(2)}`}
            />
          </div>
        )}

        <div className="space-y-2">
          <Label>Reason for Refund</Label>
          <Textarea
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="e.g. Customer returned the product, item damaged in transit..."
            rows={3}
          />
        </div>

        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button
              variant="destructive"
              disabled={isPending || !reason.trim()}
              className="w-full"
            >
              {isPending ? "Processing..." : "Process Refund"}
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Confirm Refund</AlertDialogTitle>
              <AlertDialogDescription>
                {refundType === "full" ? (
                  <>
                    You are about to issue a{" "}
                    <strong>full refund of £{totalAmount.toFixed(2)}</strong>.
                  </>
                ) : (
                  <>
                    You are about to issue a{" "}
                    <strong>
                      partial refund of £{parseFloat(amount || "0").toFixed(2)}
                    </strong>{" "}
                    out of £{totalAmount.toFixed(2)}.
                  </>
                )}
                {paymentMethod === "stripe" && hasStripePaymentIntent && (
                  <> The refund will be processed via Stripe.</>
                )}
                <br />
                <br />
                This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={handleSubmit}
                className="bg-destructive text-white hover:bg-destructive/90"
              >
                Confirm Refund
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </CardContent>
    </Card>
  )
}
