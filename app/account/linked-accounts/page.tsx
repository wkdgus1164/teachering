"use client"

import { MainLayout } from "@/components/layouts/main-layout"
import { LinkedAccounts } from "@/components/account/linked-accounts"
import { AccountNav } from "@/components/account/account-nav"
import { useAuth } from "@/hooks/use-auth"
import { useEffect } from "react"
import { useRouter } from "next/navigation"

export default function LinkedAccountsPage() {
  const { user, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && !user) {
      router.push("/auth/sign-in?redirect=/account/linked-accounts")
    }
  }, [user, loading, router])

  if (loading) {
    return (
      <MainLayout>
        <div className="container py-6">
          <div className="mx-auto max-w-4xl">
            <div className="flex flex-col space-y-8 lg:flex-row lg:space-x-12 lg:space-y-0">
              <div className="flex-1 lg:max-w-screen-md">
                <div className="h-4 w-48 bg-muted rounded animate-pulse mb-4"></div>
                <div className="h-4 w-96 bg-muted/60 rounded animate-pulse mb-8"></div>
                <div className="space-y-4">
                  {Array(3)
                    .fill(0)
                    .map((_, i) => (
                      <div key={i} className="h-20 bg-muted/40 rounded animate-pulse"></div>
                    ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </MainLayout>
    )
  }

  if (!user) {
    return null
  }

  return (
    <MainLayout>
      <div className="container py-6">
        <div className="mx-auto max-w-4xl">
          <div className="flex flex-col space-y-8 lg:flex-row lg:space-x-12 lg:space-y-0">
            <aside className="lg:w-1/4">
              <AccountNav />
            </aside>
            <div className="flex-1 lg:max-w-screen-md">
              <LinkedAccounts />
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  )
}
