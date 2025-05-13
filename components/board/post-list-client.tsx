"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { formatDistanceToNow } from "date-fns"
import { ko } from "date-fns/locale"
import { MessageSquare, ThumbsUp } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { EmptyFeed } from "@/components/feed/empty-feed"
import { useSupabase } from "@/infra/supabase/provider"
import type { Post } from "@/model/post/post-types"

export default function PostList() {
  const { supabase } = useSupabase()
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true)
      try {
        const { data } = await supabase
          .from("posts")
          .select(`
            *,
            profiles:author_id (id, full_name, avatar_url)
          `)
          .order("created_at", { ascending: false })
          .limit(10)

        if (data) {
          const postsWithCounts = await Promise.all(
            data.map(async (post) => {
              const { count: likeCount } = await supabase
                .from("likes")
                .select("*", { count: "exact", head: true })
                .eq("post_id", post.id)

              const { count: commentCount } = await supabase
                .from("comments")
                .select("*", { count: "exact", head: true })
                .eq("post_id", post.id)

              return {
                id: post.id,
                title: post.title,
                content: post.content,
                category: post.category,
                createdAt: post.created_at,
                updatedAt: post.updated_at,
                author: {
                  id: post.profiles.id,
                  fullName: post.profiles.full_name,
                  avatarUrl: post.profiles.avatar_url,
                },
                likeCount: likeCount || 0,
                commentCount: commentCount || 0,
              }
            }),
          )

          setPosts(postsWithCounts)
        }
      } catch (error) {
        console.error("Error fetching posts:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchPosts()
  }, [supabase])

  if (loading) {
    return null // The loading state is handled by the Suspense boundary
  }

  if (posts.length === 0) {
    return (
      <EmptyFeed
        title="아직 게시글이 없습니다"
        description="첫 번째 게시글을 작성해보세요!"
        actionLabel="게시글 작성하기"
        actionHref="/board/create"
      />
    )
  }

  return (
    <div className="space-y-4">
      {posts.map((post) => (
        <Link key={post.id} href={`/board/${post.id}`}>
          <Card className="hover:bg-muted/50 transition-colors">
            <CardHeader className="flex flex-row items-start gap-4 pb-2">
              <Avatar className="h-10 w-10">
                <AvatarImage src={post.author.avatarUrl || ""} alt={post.author.fullName || ""} />
                <AvatarFallback>{post.author.fullName?.charAt(0) || "U"}</AvatarFallback>
              </Avatar>
              <div className="grid gap-1">
                <div className="font-semibold">{post.title}</div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <span>{post.author.fullName}</span>
                  <span>•</span>
                  <span>
                    {formatDistanceToNow(new Date(post.createdAt), {
                      addSuffix: true,
                      locale: ko,
                    })}
                  </span>
                  {post.category && (
                    <>
                      <span>•</span>
                      <Badge variant="outline">{post.category}</Badge>
                    </>
                  )}
                </div>
              </div>
            </CardHeader>
            <CardContent className="pb-2">
              <p className="line-clamp-2 text-sm text-muted-foreground">{post.content}</p>
            </CardContent>
            <CardFooter>
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <ThumbsUp className="h-4 w-4" />
                  <span>{post.likeCount}</span>
                </div>
                <div className="flex items-center gap-1">
                  <MessageSquare className="h-4 w-4" />
                  <span>{post.commentCount}</span>
                </div>
              </div>
            </CardFooter>
          </Card>
        </Link>
      ))}
    </div>
  )
}
