"use client"

import Link from "next/link"
import { formatDistanceToNow } from "date-fns"
import { ko } from "date-fns/locale"
import { MessageSquare, ThumbsUp } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { EmptyFeed } from "@/components/feed/empty-feed"
import { useSupabaseFetch } from "@/infra/supabase/client-fetch"
import { fetchPosts } from "@/model/post/post-client"
import { PostListSkeleton } from "@/components/skeletons/post-list-skeleton"

export function PostList() {
  const { data: posts, loading } = useSupabaseFetch(fetchPosts)

  if (loading) {
    return <PostListSkeleton />
  }

  if (!posts || posts.length === 0) {
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
