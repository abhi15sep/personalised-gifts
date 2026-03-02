import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Separator } from "@/components/ui/separator"

const order = {
  id: "ORD-001",
  date: "1 March 2026",
  status: "Processing",
  customer: {
    name: "Sarah Johnson",
    email: "sarah@example.com",
    phone: "+44 7700 900123",
  },
  shippingAddress: {
    line1: "42 Oak Lane",
    line2: "",
    city: "London",
    county: "Greater London",
    postcode: "SW1A 1AA",
    country: "United Kingdom",
  },
  items: [
    {
      id: "1",
      name: "Personalised Wooden Chopping Board",
      quantity: 1,
      price: "\u00a334.99",
      personalisation: {
        name: "The Johnson Family",
        font: "Script",
      },
    },
    {
      id: "2",
      name: "Engraved Silver Necklace",
      quantity: 1,
      price: "\u00a345.00",
      personalisation: {
        text: "S + J",
        style: "Classic",
      },
    },
  ],
  subtotal: "\u00a379.99",
  shipping: "\u00a34.99",
  total: "\u00a384.98",
  paymentIntentId: "pi_3N8kQ2LkdIwHu7ix0abc1234",
  fulfillmentStatus: "in_production",
}

const fulfillmentSteps = [
  { key: "pending", label: "Pending" },
  { key: "in_production", label: "In Production" },
  { key: "quality_check", label: "Quality Check" },
  { key: "complete", label: "Complete" },
]

function getStatusColor(status: string) {
  switch (status) {
    case "Pending":
      return "bg-orange-100 text-orange-800 border-orange-200"
    case "Paid":
      return "bg-blue-100 text-blue-800 border-blue-200"
    case "Processing":
      return "bg-yellow-100 text-yellow-800 border-yellow-200"
    case "Shipped":
      return "bg-purple-100 text-purple-800 border-purple-200"
    case "Delivered":
      return "bg-green-100 text-green-800 border-green-200"
    default:
      return "bg-gray-100 text-gray-800 border-gray-200"
  }
}

function getFulfillmentStepIndex(status: string) {
  return fulfillmentSteps.findIndex((s) => s.key === status)
}

export default async function OrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const currentStepIndex = getFulfillmentStepIndex(order.fulfillmentStatus)

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/admin/orders">
            <ArrowLeft className="size-4" />
          </Link>
        </Button>
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <h2 className="text-3xl font-bold tracking-tight">
              Order {id}
            </h2>
            <Badge
              variant="outline"
              className={getStatusColor(order.status)}
            >
              {order.status}
            </Badge>
          </div>
          <p className="text-muted-foreground">Placed on {order.date}</p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Order Items</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Preview</TableHead>
                    <TableHead>Product</TableHead>
                    <TableHead>Personalisation</TableHead>
                    <TableHead>Qty</TableHead>
                    <TableHead>Price</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {order.items.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell>
                        <div className="size-12 rounded-md bg-muted" />
                      </TableCell>
                      <TableCell className="font-medium">
                        {item.name}
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1 text-sm">
                          {Object.entries(item.personalisation).map(
                            ([key, value]) => (
                              <div key={key}>
                                <span className="font-medium capitalize">
                                  {key}:
                                </span>{" "}
                                {value}
                              </div>
                            )
                          )}
                        </div>
                      </TableCell>
                      <TableCell>{item.quantity}</TableCell>
                      <TableCell>{item.price}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              <Separator className="my-4" />
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span>{order.subtotal}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Shipping</span>
                  <span>{order.shipping}</span>
                </div>
                <Separator />
                <div className="flex justify-between font-bold text-base">
                  <span>Total</span>
                  <span>{order.total}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Fulfillment Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                {fulfillmentSteps.map((step, index) => {
                  const isActive = index <= currentStepIndex
                  const isCurrent = index === currentStepIndex
                  return (
                    <div key={step.key} className="flex flex-1 flex-col items-center gap-2">
                      <div
                        className={`flex size-10 items-center justify-center rounded-full border-2 text-sm font-bold ${
                          isActive
                            ? "border-primary bg-primary text-primary-foreground"
                            : "border-muted-foreground/30 text-muted-foreground"
                        }`}
                      >
                        {index + 1}
                      </div>
                      <span
                        className={`text-xs text-center ${
                          isCurrent
                            ? "font-bold text-primary"
                            : isActive
                              ? "font-medium text-foreground"
                              : "text-muted-foreground"
                        }`}
                      >
                        {step.label}
                      </span>
                    </div>
                  )
                })}
              </div>
              <div className="mt-6 flex justify-center gap-3">
                {currentStepIndex < fulfillmentSteps.length - 1 && (
                  <Button>
                    Move to{" "}
                    {fulfillmentSteps[currentStepIndex + 1].label}
                  </Button>
                )}
                {currentStepIndex > 0 && (
                  <Button variant="outline">
                    Back to{" "}
                    {fulfillmentSteps[currentStepIndex - 1].label}
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Customer</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <div className="font-medium">{order.customer.name}</div>
              <div className="text-muted-foreground">
                {order.customer.email}
              </div>
              <div className="text-muted-foreground">
                {order.customer.phone}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Shipping Address</CardTitle>
            </CardHeader>
            <CardContent className="space-y-1 text-sm">
              <div>{order.shippingAddress.line1}</div>
              {order.shippingAddress.line2 && (
                <div>{order.shippingAddress.line2}</div>
              )}
              <div>{order.shippingAddress.city}</div>
              <div>{order.shippingAddress.county}</div>
              <div>{order.shippingAddress.postcode}</div>
              <div>{order.shippingAddress.country}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Payment</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Status</span>
                <Badge
                  variant="outline"
                  className="bg-green-100 text-green-800 border-green-200"
                >
                  Paid
                </Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Amount</span>
                <span className="font-medium">{order.total}</span>
              </div>
              <Separator />
              <div>
                <span className="text-muted-foreground">
                  Stripe Payment Intent
                </span>
                <div className="mt-1 rounded-md bg-muted px-2 py-1 font-mono text-xs break-all">
                  {order.paymentIntentId}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
