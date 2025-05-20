import { type NextRequest, NextResponse } from "next/server"
import { randomInt } from "crypto"

// In-memory store for OTPs (will be replaced with database later)
const otpStore: Record<string, { otp: string; expires: number }> = {}

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json()

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ message: "Invalid email address" }, { status: 400 })
    }

    // Generate a 6-digit OTP
    const otp = randomInt(100000, 999999).toString()

    // Store OTP with 10-minute expiration
    const expirationTime = Date.now() + 10 * 60 * 1000 // 10 minutes
    otpStore[email] = { otp, expires: expirationTime }

    // In a real application, send the OTP via email
    // For this example, we'll log it to the console
    console.log(`OTP for ${email}: ${otp}`)

    return NextResponse.json({ message: "OTP sent successfully" }, { status: 200 })
  } catch (error) {
    console.error("Error sending OTP:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}
