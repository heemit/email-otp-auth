import { type NextRequest, NextResponse } from "next/server"
import { jwtVerify } from "jose"

// Secret key for JWT verification (should be in environment variables in a real app)
const JWT_SECRET = new TextEncoder().encode("your-secret-key-at-least-32-chars-long")

export async function GET(request: NextRequest) {
  try {
    // Get the token from the Authorization header
    const authHeader = request.headers.get("Authorization")

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const token = authHeader.split(" ")[1]

    // Verify the token
    const { payload } = await jwtVerify(token, JWT_SECRET)

    // Return user profile
    return NextResponse.json({
      email: payload.email,
      // In a real app, you would fetch more user data from the database
    })
  } catch (error) {
    console.error("Error fetching profile:", error)
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
  }
}
