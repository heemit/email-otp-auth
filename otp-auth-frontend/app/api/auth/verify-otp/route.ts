import { type NextRequest, NextResponse } from "next/server"
import { SignJWT } from "jose"

// In-memory store for OTPs (will be replaced with database later)
// This should be imported from a shared file in a real application
const otpStore: Record<string, { otp: string; expires: number }> = {}

// Secret key for JWT signing (should be in environment variables in a real app)
const JWT_SECRET = new TextEncoder().encode("your-secret-key-at-least-32-chars-long")

export async function POST(request: NextRequest) {
  try {
    const { email, otp } = await request.json()

    if (!email || !otp) {
      return NextResponse.json({ message: "Email and OTP are required" }, { status: 400 })
    }

    // Check if OTP exists and is valid
    const storedOTP = otpStore[email]

    if (!storedOTP) {
      return NextResponse.json({ message: "No OTP found for this email" }, { status: 400 })
    }

    if (storedOTP.expires < Date.now()) {
      // Remove expired OTP
      delete otpStore[email]

      return NextResponse.json({ message: "OTP has expired" }, { status: 400 })
    }

    if (storedOTP.otp !== otp) {
      return NextResponse.json({ message: "Invalid OTP" }, { status: 400 })
    }

    // OTP is valid, remove it from store to prevent reuse
    delete otpStore[email]

    // Generate JWT token
    const token = await new SignJWT({ email })
      .setProtectedHeader({ alg: "HS256" })
      .setIssuedAt()
      .setExpirationTime("24h")
      .sign(JWT_SECRET)

    // Set token in HTTP-only cookie
    const response = NextResponse.json({ message: "Authentication successful", token }, { status: 200 })

    response.cookies.set({
      name: "authToken",
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24, // 1 day
      path: "/",
    })

    return response
  } catch (error) {
    console.error("Error verifying OTP:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}
