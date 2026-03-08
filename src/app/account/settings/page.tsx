"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Settings } from "lucide-react"

function ClerkUserProfile() {
  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { UserProfile } = require("@clerk/nextjs")
    return (
      <UserProfile
        appearance={{
          elements: {
            rootBox: "w-full",
            card: "shadow-none border border-gray-200",
          },
        }}
      />
    )
  } catch {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12">
          <Settings className="h-12 w-12 text-muted-foreground mb-4" />
          <p className="text-lg font-medium mb-2">Account Settings</p>
          <p className="text-muted-foreground text-sm">
            Sign in to manage your account settings.
          </p>
        </CardContent>
      </Card>
    )
  }
}

export default function SettingsPage() {
  return (
    <div>
      <div className="mb-6">
        <h2 className="font-heading text-2xl font-semibold">Account Settings</h2>
        <p className="text-sm text-muted-foreground mt-1">
          Manage your profile, email, and password.
        </p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Profile</CardTitle>
        </CardHeader>
        <CardContent>
          <ClerkUserProfile />
        </CardContent>
      </Card>
    </div>
  )
}
