"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/hooks/use-auth"
import { Header } from "@/components/layout/header"
import { ServiceIntroduction } from "@/components/home/service-introduction"
import { ContentFeedPlaceholder } from "@/components/home/content-feed-placeholder"

export default function Page() {
  const { isAuthenticated, isLoading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    // If user is already authenticated and the page has loaded,
    // redirect them to the feed page
    if (!isLoading && isAuthenticated) {
      router.push("/feed")
    }
  }, [isAuthenticated, isLoading, router])

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <ServiceIntroduction />
        <ContentFeedPlaceholder />
      </main>
    </div>
  )
}
