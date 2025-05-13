"use client"

import { useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Header } from "@/components/layout/header"
import { LoginForm } from "@/components/auth/login-form"
import { useAuth } from "@/hooks/use-auth"

export default function Page() {
  const { isAuthenticated } = useAuth()
  const router = useRouter()
  const searchParams = useSearchParams()
  const redirectPath = searchParams.get("redirect") || "/feed"

  useEffect(() => {
    if (isAuthenticated) {
      router.push(redirectPath)
    }
  }, [isAuthenticated, router, redirectPath])

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container max-w-4xl py-12">
        <LoginForm redirectPath={redirectPath} />
      </main>
    </div>
  )
}
