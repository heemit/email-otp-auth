import LoginForm from "@/components/login-form"
import type { Metadata } from "next"
import { MailIcon } from "lucide-react"

export const metadata: Metadata = {
  title: "Login with Email OTP",
  description: "Secure login with one-time passcode sent to your email",
}

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 bg-gradient-to-b from-blue-50 to-slate-100">
      <div className="w-full max-w-md mx-auto">
        <div className="text-center mb-8">
          <div className="inline-block p-4 bg-blue-100 rounded-full mb-4">
            <MailIcon className="h-10 w-10 text-blue-600" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">Welcome back</h1>
          <p className="mt-2 text-slate-600">Login securely with a one-time passcode sent to your email</p>
        </div>
        <LoginForm />
        <p className="text-center text-sm text-slate-500 mt-8">
          By continuing, you agree to our Terms of Service and Privacy Policy.
        </p>
      </div>
    </main>
  )
}
