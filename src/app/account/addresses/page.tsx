"use client"

import { useState, useEffect, useTransition } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { MapPin, Plus, Pencil, Trash2, Loader2 } from "lucide-react"
import {
  getUserAddresses,
  addAddress,
  updateAddress,
  deleteAddress,
} from "@/lib/actions/address"

interface Address {
  id: string
  label: string | null
  fullName: string
  line1: string
  line2: string | null
  city: string
  county: string | null
  postalCode: string
  country: string
  isDefault: boolean
}

export default function AddressesPage() {
  const [addresses, setAddresses] = useState<Address[]>([])
  const [isOpen, setIsOpen] = useState(false)
  const [editingAddress, setEditingAddress] = useState<Address | null>(null)
  const [isPending, startTransition] = useTransition()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadAddresses()
  }, [])

  async function loadAddresses() {
    try {
      const data = await getUserAddresses()
      setAddresses(
        data.map((a) => ({
          ...a,
          id: a.id.toString(),
        }))
      )
    } catch {
      // User may not be authenticated
    } finally {
      setLoading(false)
    }
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const addressData = {
      label: (formData.get("label") as string) || null,
      fullName: formData.get("fullName") as string,
      line1: formData.get("line1") as string,
      line2: (formData.get("line2") as string) || null,
      city: formData.get("city") as string,
      county: (formData.get("county") as string) || null,
      postalCode: formData.get("postalCode") as string,
      country: "GB",
      isDefault: formData.get("isDefault") === "on",
    }

    startTransition(async () => {
      try {
        if (editingAddress) {
          await updateAddress(BigInt(editingAddress.id), addressData)
        } else {
          await addAddress(addressData)
        }
        await loadAddresses()
        setIsOpen(false)
        setEditingAddress(null)
      } catch (err) {
        console.error("Failed to save address:", err)
      }
    })
  }

  function handleEdit(address: Address) {
    setEditingAddress(address)
    setIsOpen(true)
  }

  function handleDelete(id: string) {
    startTransition(async () => {
      try {
        await deleteAddress(BigInt(id))
        await loadAddresses()
      } catch (err) {
        console.error("Failed to delete address:", err)
      }
    })
  }

  function handleDialogChange(open: boolean) {
    setIsOpen(open)
    if (!open) setEditingAddress(null)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    )
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-heading text-2xl font-semibold">My Addresses</h2>
        <Dialog open={isOpen} onOpenChange={handleDialogChange}>
          <DialogTrigger asChild>
            <Button size="sm">
              <Plus className="mr-2 h-4 w-4" />
              Add Address
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {editingAddress ? "Edit Address" : "Add New Address"}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="label">Label (e.g. Home, Work)</Label>
                <Input
                  id="label"
                  name="label"
                  placeholder="Home"
                  defaultValue={editingAddress?.label || ""}
                />
              </div>
              <div>
                <Label htmlFor="fullName">Full Name</Label>
                <Input
                  id="fullName"
                  name="fullName"
                  placeholder="John Smith"
                  required
                  defaultValue={editingAddress?.fullName || ""}
                />
              </div>
              <div>
                <Label htmlFor="line1">Address Line 1</Label>
                <Input
                  id="line1"
                  name="line1"
                  placeholder="123 High Street"
                  required
                  defaultValue={editingAddress?.line1 || ""}
                />
              </div>
              <div>
                <Label htmlFor="line2">Address Line 2 (optional)</Label>
                <Input
                  id="line2"
                  name="line2"
                  placeholder="Flat 4"
                  defaultValue={editingAddress?.line2 || ""}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="city">City</Label>
                  <Input
                    id="city"
                    name="city"
                    placeholder="London"
                    required
                    defaultValue={editingAddress?.city || ""}
                  />
                </div>
                <div>
                  <Label htmlFor="county">County</Label>
                  <Input
                    id="county"
                    name="county"
                    placeholder="Greater London"
                    defaultValue={editingAddress?.county || ""}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="postalCode">Postcode</Label>
                  <Input
                    id="postalCode"
                    name="postalCode"
                    placeholder="SW1A 1AA"
                    required
                    defaultValue={editingAddress?.postalCode || ""}
                  />
                </div>
                <div>
                  <Label htmlFor="country">Country</Label>
                  <Input
                    id="country"
                    name="country"
                    defaultValue="United Kingdom"
                    disabled
                  />
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Checkbox
                  id="isDefault"
                  name="isDefault"
                  defaultChecked={editingAddress?.isDefault}
                />
                <Label htmlFor="isDefault">Set as default address</Label>
              </div>
              <Button type="submit" className="w-full" disabled={isPending}>
                {isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : editingAddress ? (
                  "Update Address"
                ) : (
                  "Save Address"
                )}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {addresses.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <MapPin className="h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-lg font-medium mb-2">No saved addresses</p>
            <p className="text-muted-foreground">
              Add an address for faster checkout
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {addresses.map((address) => (
            <Card key={address.id}>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base flex items-center gap-2">
                    {address.label || "Address"}
                    {address.isDefault && (
                      <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full">
                        Default
                      </span>
                    )}
                  </CardTitle>
                  <div className="flex gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => handleEdit(address)}
                    >
                      <Pencil className="h-3.5 w-3.5" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-red-500 hover:text-red-600"
                      onClick={() => handleDelete(address.id)}
                      disabled={isPending}
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground">
                <p>{address.fullName}</p>
                <p>{address.line1}</p>
                {address.line2 && <p>{address.line2}</p>}
                <p>
                  {address.city}
                  {address.county ? `, ${address.county}` : ""}
                </p>
                <p>{address.postalCode}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
