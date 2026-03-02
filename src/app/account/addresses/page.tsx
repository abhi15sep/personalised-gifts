"use client"

import { useState } from "react"
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
import { MapPin, Plus, Pencil, Trash2 } from "lucide-react"

interface Address {
  id: string
  label: string
  fullName: string
  line1: string
  line2?: string
  city: string
  county?: string
  postalCode: string
  country: string
  isDefault: boolean
}

export default function AddressesPage() {
  const [addresses] = useState<Address[]>([])
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-heading text-2xl font-semibold">My Addresses</h2>
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button size="sm">
              <Plus className="mr-2 h-4 w-4" />
              Add Address
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Address</DialogTitle>
            </DialogHeader>
            <form className="space-y-4">
              <div>
                <Label htmlFor="label">Label (e.g. Home, Work)</Label>
                <Input id="label" placeholder="Home" />
              </div>
              <div>
                <Label htmlFor="fullName">Full Name</Label>
                <Input id="fullName" placeholder="John Smith" />
              </div>
              <div>
                <Label htmlFor="line1">Address Line 1</Label>
                <Input id="line1" placeholder="123 High Street" />
              </div>
              <div>
                <Label htmlFor="line2">Address Line 2 (optional)</Label>
                <Input id="line2" placeholder="Flat 4" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="city">City</Label>
                  <Input id="city" placeholder="London" />
                </div>
                <div>
                  <Label htmlFor="county">County</Label>
                  <Input id="county" placeholder="Greater London" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="postalCode">Postcode</Label>
                  <Input id="postalCode" placeholder="SW1A 1AA" />
                </div>
                <div>
                  <Label htmlFor="country">Country</Label>
                  <Input id="country" defaultValue="United Kingdom" disabled />
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Checkbox id="isDefault" />
                <Label htmlFor="isDefault">Set as default address</Label>
              </div>
              <Button type="submit" className="w-full">
                Save Address
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
                    {address.label}
                    {address.isDefault && (
                      <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full">
                        Default
                      </span>
                    )}
                  </CardTitle>
                  <div className="flex gap-1">
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <Pencil className="h-3.5 w-3.5" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
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
