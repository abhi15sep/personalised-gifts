"use client"

import Script from "next/script"

const TAWK_PROPERTY_ID = process.env.NEXT_PUBLIC_TAWK_PROPERTY_ID
const TAWK_WIDGET_ID = process.env.NEXT_PUBLIC_TAWK_WIDGET_ID

export function TawkTo() {
  if (!TAWK_PROPERTY_ID || !TAWK_WIDGET_ID) return null

  return (
    <Script
      id="tawk-to"
      strategy="lazyOnload"
      src={`https://embed.tawk.to/${TAWK_PROPERTY_ID}/${TAWK_WIDGET_ID}`}
      crossOrigin="anonymous"
    />
  )
}