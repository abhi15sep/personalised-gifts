"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Cookie, X } from "lucide-react"
import { Button } from "@/components/ui/button"

const COOKIE_CONSENT_KEY = "cookie-consent"

type ConsentValue = "accepted" | "rejected"

export function CookieConsent() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const consent = localStorage.getItem(COOKIE_CONSENT_KEY)
    if (!consent) {
      // Small delay so it doesn't flash on page load
      const timer = setTimeout(() => setVisible(true), 1000)
      return () => clearTimeout(timer)
    }
  }, [])

  function handleConsent(value: ConsentValue) {
    localStorage.setItem(COOKIE_CONSENT_KEY, value)
    setVisible(false)
  }

  if (!visible) return null

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 animate-in slide-in-from-bottom-5 duration-500">
      <div className="mx-auto max-w-4xl px-4 pb-4">
        <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-lg sm:flex sm:items-center sm:gap-4 sm:p-5">
          <div className="flex items-start gap-3 sm:flex-1">
            <Cookie className="mt-0.5 size-5 shrink-0 text-rose" />
            <p className="text-sm text-gray-600">
              We use cookies to enhance your browsing experience and analyse
              site traffic. By clicking &quot;Accept&quot;, you consent to our
              use of cookies.{" "}
              <Link
                href="/privacy"
                className="font-medium text-rose underline-offset-4 hover:underline"
              >
                Privacy Policy
              </Link>
            </p>
          </div>
          <div className="mt-3 flex items-center gap-2 sm:mt-0 sm:shrink-0">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleConsent("rejected")}
              className="text-xs"
            >
              Decline
            </Button>
            <Button
              size="sm"
              onClick={() => handleConsent("accepted")}
              className="bg-rose text-white hover:bg-rose-dark text-xs"
            >
              Accept All
            </Button>
          </div>
          <button
            onClick={() => handleConsent("rejected")}
            className="absolute right-2 top-2 rounded-full p-1 text-gray-400 hover:text-gray-600 sm:hidden"
          >
            <X className="size-4" />
          </button>
        </div>
      </div>
    </div>
  )
}
