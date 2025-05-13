"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter, notFound } from "next/navigation"
import { MainLayout } from "@/components/layouts/main-layout"
import { PostDetail } from "@/components/board/post-detail"
import { CommentSection } from "@/components/board/comment-section"
import { PostDetailSkeleton } from "@/components/skeletons/post-detail-skeleton"
import { useSupabase } from "@/infra/supabase/provider"
import { fetchPostById } from "@/model/post/post-client"
import type { PostDetail as PostDetailType } from "@/model/post/post-types"

export default function PostDetailPage() {
  const params = useParams()
  const postId = params?.id as string
  const { supabase } = useSupabase()
  const router = useRouter()
  const [post, setPost] = useState<PostDetailType | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!postId) return

    const fetchPost = async () => {
      setLoading(true)
      try {
        const postData = await fetchPostById(supabase, postId)
        if (!postData) {
          notFound()
          return
        }
        setPost(postData)
      } catch (error) {
        console.error("Error fetching post:", error)
        notFound()
      } finally {
        setLoading(false)
      }
    }

    fetchPost()
  }, [postId, supabase, router])

  if (loading) {
    return (
      <MainLayout>
        <div className="container mx-auto py-6">
          <PostDetailSkeleton />
        </div>
      </MainLayout>
    )
  }

  if (!post) {
    return null // This will be handled by the notFound() call above
  }

  return (
    <MainLayout>
      <div className="container mx-auto py-6">
        <PostDetail post={post} />
        <CommentSection postId={post.id} />
      </div>
    </MainLayout>
  )
}
