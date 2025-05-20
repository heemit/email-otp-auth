"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { LogOutIcon, UserIcon, MailIcon, CalendarIcon } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"

interface UserProfile {
  email: string
  lastLogin: string
  createdAt: string
}

export default function ProfilePage() {
  const router = useRouter()
  const { toast } = useToast()
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check if user is authenticated
    const token = localStorage.getItem("authToken")

    if (!token) {
      router.push("/")
      return
    }

    try {
      const payload = token.split(".")[1]; // Get the payload part
      const tokenData = JSON.parse(atob(payload));
    
      if (tokenData.exp * 1000 < Date.now()) {
        throw new Error("Token expired");
      }
    
      setUserProfile({
        email: tokenData.email,
        lastLogin: new Date().toLocaleString(),
        createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toLocaleString(),
      });
    } catch (error) {
      console.error("Error decoding token:", error);
      localStorage.removeItem("authToken");
      router.push("/");
    } finally {
      setLoading(false)
    }
  }, [router])

  const handleLogout = () => {
    localStorage.removeItem("authToken")

    toast({
      title: "Logged Out",
      description: "You have been successfully logged out",
      duration: 3000,
    })

    router.push("/")
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 bg-gradient-to-b from-blue-50 to-slate-100">
      <Card className="w-full max-w-md shadow-lg border-slate-200">
        <CardHeader className="text-center">
          <div className="mx-auto bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mb-4">
            <UserIcon className="h-8 w-8 text-blue-600" />
          </div>
          <CardTitle className="text-2xl">Welcome!</CardTitle>
          <CardDescription>You've successfully logged in</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="bg-slate-50 p-4 rounded-lg border border-slate-100">
            <div className="flex items-start space-x-3">
              <MailIcon className="h-5 w-5 text-slate-500 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-slate-500">Email</p>
                <p className="font-medium">{userProfile?.email}</p>
              </div>
            </div>
          </div>

          <div className="bg-slate-50 p-4 rounded-lg border border-slate-100">
            <div className="flex items-start space-x-3">
              <CalendarIcon className="h-5 w-5 text-slate-500 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-slate-500">Last Login</p>
                <p className="font-medium">{userProfile?.lastLogin}</p>
              </div>
            </div>
          </div>

          <div className="bg-slate-50 p-4 rounded-lg border border-slate-100">
            <div className="flex items-start space-x-3">
              <CalendarIcon className="h-5 w-5 text-slate-500 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-slate-500">Account Created</p>
                <p className="font-medium">{userProfile?.createdAt}</p>
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button variant="outline" className="w-full" onClick={handleLogout}>
            <LogOutIcon className="mr-2 h-4 w-4" />
            Sign Out
          </Button>
        </CardFooter>
      </Card>
    </main>
  )
}
