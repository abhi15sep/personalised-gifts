import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const publishableKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
const hasValidClerkKey = publishableKey && publishableKey.startsWith('pk_') && !publishableKey.includes('placeholder')

export default async function middleware(req: NextRequest) {
  if (hasValidClerkKey) {
    const { clerkMiddleware, createRouteMatcher } = await import('@clerk/nextjs/server')
    const isProtectedRoute = createRouteMatcher([
      '/account(.*)',
      '/admin(.*)',
    ])
    const handler = clerkMiddleware(async (auth, request) => {
      if (isProtectedRoute(request)) {
        await auth.protect()
      }
    })
    return handler(req, {} as never)
  }
  return NextResponse.next()
}

export const config = {
  matcher: [
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    '/(api|trpc)(.*)',
  ],
}
