"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { Header } from "@/components/layout/header"
import { ProfileHeader } from "@/components/profile/profile-header"
import { ProfileDetails } from "@/components/profile/profile-details"
import { ConnectedAccounts } from "@/components/profile/connected-accounts"
import { Card, CardContent } from "@/components/ui/card"
import { useUser } from "@/hooks/use-user"
import { useAuth } from "@/hooks/use-auth"

export default function Page() {
  const { user, isLoading, error } = useUser()
  const { isAuthenticated } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login")
    }
  }, [isAuthenticated, router])

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container max-w-4xl py-6">
        {isLoading ? (
          <div className="space-y-4">
            <div className="h-32 rounded-t-lg bg-muted animate-pulse" />
            <div className="h-64 rounded-b-lg bg-muted animate-pulse" />
          </div>
        ) : error || !user ? (
          <div className="p-4 border rounded-md bg-red-50 text-red-500">{error || "User not found"}</div>
        ) : (
          <Card className="overflow-hidden">
            <ProfileHeader user={user} />
            <CardContent className="pt-20 px-6 pb-6">
              <div className="space-y-8">
                <ProfileDetails user={user} />
                <ConnectedAccounts user={user} />
              </div>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  )
}
