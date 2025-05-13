"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { Header } from "@/components/layout/header"
import { PostCard } from "@/components/feed/post-card"
import { usePosts } from "@/hooks/use-posts"
import { useAuth } from "@/hooks/use-auth"

export default function Page() {
  const { posts, isLoading, error, likePost, sharePost } = usePosts()
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
        <h1 className="text-3xl font-bold mb-6">피드</h1>

        {isLoading ? (
          <div className="space-y-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="h-64 rounded-lg bg-muted animate-pulse" />
            ))}
          </div>
        ) : error ? (
          <div className="p-4 border rounded-md bg-red-50 text-red-500">{error}</div>
        ) : (
          <div className="space-y-6">
            {posts.map((post) => (
              <PostCard key={post.id} post={post} onLike={likePost} onShare={sharePost} />
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
