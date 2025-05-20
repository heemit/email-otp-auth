import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(request: NextRequest) {
  // Get the pathname
  const path = request.nextUrl.pathname

  // Define public paths that don't require authentication
  const isPublicPath = path === "/"

  // Get the JWT token from the cookies
  const token = request.cookies.get("authToken")?.value || ""

  // Redirect authenticated users away from public paths
  if (isPublicPath && token) {
    return NextResponse.redirect(new URL("/profile", request.url))
  }

  // For protected paths, we'll check authentication on the client side
  // since we're using localStorage for token storage

  return NextResponse.next()
}

// Specify the paths that should trigger this middleware
export const config = {
  matcher: ["/"],
}
