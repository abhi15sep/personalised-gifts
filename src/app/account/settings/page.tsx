"use client"

import { UserProfile } from "@clerk/nextjs"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

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
          <UserProfile
            appearance={{
              elements: {
                rootBox: "w-full",
                card: "shadow-none border border-gray-200",
              },
            }}
          />
        </CardContent>
      </Card>
    </div>
  )
}
