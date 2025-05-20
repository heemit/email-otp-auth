"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { MailIcon, KeyIcon, ArrowRightIcon, LoaderCircleIcon } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"

// Helper function to generate a random 6-digit OTP
const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString()
}

export default function LoginForm() {
  const router = useRouter()
  const { toast } = useToast()
  const [email, setEmail] = useState("")
  const [otp, setOtp] = useState("")
  const [step, setStep] = useState<"email" | "otp">("email")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [countdown, setCountdown] = useState(0)

  // Handle countdown timer
  useEffect(() => {
    let timer: NodeJS.Timeout | null = null

    if (countdown > 0) {
      timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            if (timer) clearInterval(timer)
            return 0
          }
          return prev - 1
        })
      }, 1000)
    }

    return () => {
      if (timer) clearInterval(timer)
    }
  }, [countdown])

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
  
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Please enter a valid email address");
      return;
    }
  
    setLoading(true);
  
    try {
      const res = await fetch("http://localhost:5000/api/auth/send-otp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ email })
      });
  
      const data = await res.json();
  
      if (!res.ok) throw new Error(data.message || "Failed to send OTP");
  
      toast({
        title: "OTP Sent",
        description: "A verification code has been sent to your email",
        duration: 5000,
      });
  
      setCountdown(60);
      setStep("otp");
    } catch (err: any) {
      setError(err.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };  

  const handleOtpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
  
    if (!otp || otp.length < 6) {
      setError("Please enter a valid 6-digit OTP");
      return;
    }
  
    setLoading(true);
  
    try {
      const res = await fetch("http://localhost:5000/api/auth/verify-otp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ email, otp })
      });
  
      const data = await res.json();
  
      if (!res.ok) throw new Error(data.message || "OTP verification failed");
  
      const token = data.token;
  
      // Store token
      localStorage.setItem("authToken", token);
  
      toast({
        title: "Verified!",
        description: "OTP verification successful",
        variant: "success",
        duration: 2000,
      });
  
      setTimeout(() => {
        toast({
          title: "Signed In",
          description: "You have been successfully logged in",
          variant: "success",
          duration: 3000,
        });
  
        router.push("/profile");
      }, 1000);
    } catch (err: any) {
      setError(err.message || "Failed to verify OTP. Please try again.");
    } finally {
      setLoading(false);
    }
  };  

  const handleResendOtp = async () => {
    if (countdown > 0) return;
  
    setError(null);
    setLoading(true);
  
    try {
      const res = await fetch("http://localhost:5000/api/auth/send-otp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ email })
      });
  
      const data = await res.json();
  
      if (!res.ok) throw new Error(data.message || "Failed to resend OTP");
  
      toast({
        title: "OTP Resent",
        description: "A new verification code has been sent to your email",
        duration: 5000,
      });
  
      setCountdown(60);
    } catch (err: any) {
      setError(err.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };  

  return (
    <Card className="w-full shadow-lg border-slate-200">
      <CardHeader>
        <CardTitle className="text-xl">{step === "email" ? "Login with Email" : "Enter Verification Code"}</CardTitle>
        <CardDescription>
          {step === "email" ? "We'll send a one-time passcode to your email" : `We've sent a 6-digit code to ${email}`}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {step === "email" ? (
          <form onSubmit={handleEmailSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email address</Label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-slate-400">
                  <MailIcon className="h-5 w-5" />
                </div>
                <Input
                  id="email"
                  type="email"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10"
                  required
                  autoFocus
                />
              </div>
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? (
                <>
                  <LoaderCircleIcon className="mr-2 h-4 w-4 animate-spin" />
                  Sending code...
                </>
              ) : (
                <>
                  Continue
                  <ArrowRightIcon className="ml-2 h-4 w-4" />
                </>
              )}
            </Button>
          </form>
        ) : (
          <form onSubmit={handleOtpSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="otp">Verification code</Label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-slate-400">
                  <KeyIcon className="h-5 w-5" />
                </div>
                <Input
                  id="otp"
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  maxLength={6}
                  placeholder="123456"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/[^0-9]/g, ""))}
                  className="pl-10 text-center tracking-widest font-mono text-lg"
                  required
                  autoFocus
                />
              </div>
              <div className="text-center text-sm text-slate-500 mt-2">
                {countdown > 0 ? (
                  <div className="flex items-center justify-center">
                    <span className="inline-block w-6 h-6 rounded-full border border-slate-300 text-xs flex items-center justify-center mr-2">
                      {countdown}
                    </span>
                    Resend available in {countdown} seconds
                  </div>
                ) : null}
              </div>
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? (
                <>
                  <LoaderCircleIcon className="mr-2 h-4 w-4 animate-spin" />
                  Verifying...
                </>
              ) : (
                "Verify OTP"
              )}
            </Button>
          </form>
        )}
      </CardContent>
      {step === "otp" && (
        <CardFooter className="flex flex-col space-y-2">
          <div className="text-sm text-slate-500 text-center w-full">
            Didn't receive the code?{" "}
            <button
              type="button"
              onClick={handleResendOtp}
              disabled={countdown > 0 || loading}
              className={`font-medium ${
                countdown > 0 || loading ? "text-slate-400" : "text-blue-600 hover:text-blue-500"
              }`}
            >
              {countdown > 0 ? `Wait ${countdown}s` : "Resend code"}
            </button>
          </div>
          <button
            type="button"
            onClick={() => setStep("email")}
            className="text-sm text-slate-500 hover:text-slate-700"
          >
            Use a different email
          </button>
        </CardFooter>
      )}
    </Card>
  )
}
