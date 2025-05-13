"use client"

import { useState, useEffect } from "react"
import { formatDistanceToNow } from "date-fns"
import { ko } from "date-fns/locale"
import { MessageSquare, ThumbsUp } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { EmptyFeed } from "@/components/feed/empty-feed"
import { useSupabase } from "@/infra/supabase/provider"
import Link from "next/link"
import type { Post } from "@/model/post/post-types"
import type { Comment } from "@/model/comment/comment-types"

interface ProfileTabsProps {
  userId: string
}

export function ProfileTabs({ userId }: ProfileTabsProps) {
  const { supabase } = useSupabase()
  const [activeTab, setActiveTab] = useState("posts")
  const [posts, setPosts] = useState<Post[]>([])
  const [comments, setComments] = useState<(Comment & { postTitle: string; postId: string })[]>([])
  const [likedPosts, setLikedPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState({
    posts: true,
    comments: true,
    likes: true,
  })

  useEffect(() => {
    const fetchUserPosts = async () => {
      setLoading((prev) => ({ ...prev, posts: true }))

      const { data } = await supabase
        .from("posts")
        .select(`
          *,
          profiles:author_id (id, full_name, avatar_url)
        `)
        .eq("author_id", userId)
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

      setLoading((prev) => ({ ...prev, posts: false }))
    }

    const fetchUserComments = async () => {
      setLoading((prev) => ({ ...prev, comments: true }))

      const { data } = await supabase
        .from("comments")
        .select(`
          *,
          profiles:author_id (id, full_name, avatar_url),
          posts:post_id (id, title)
        `)
        .eq("author_id", userId)
        .order("created_at", { ascending: false })
        .limit(10)

      if (data) {
        const commentsWithLikes = await Promise.all(
          data.map(async (comment) => {
            const { count: likeCount } = await supabase
              .from("likes")
              .select("*", { count: "exact", head: true })
              .eq("comment_id", comment.id)

            return {
              id: comment.id,
              content: comment.content,
              createdAt: comment.created_at,
              author: {
                id: comment.profiles.id,
                fullName: comment.profiles.full_name,
                avatarUrl: comment.profiles.avatar_url,
              },
              likeCount: likeCount || 0,
              isLikedByCurrentUser: false, // We don't need this for the profile view
              postTitle: comment.posts.title,
              postId: comment.posts.id,
            }
          }),
        )

        setComments(commentsWithLikes)
      }

      setLoading((prev) => ({ ...prev, comments: false }))
    }

    const fetchLikedPosts = async () => {
      setLoading((prev) => ({ ...prev, likes: true }))

      const { data: likes } = await supabase
        .from("likes")
        .select("post_id")
        .eq("user_id", userId)
        .not("post_id", "is", null)
        .order("created_at", { ascending: false })
        .limit(10)

      if (likes && likes.length > 0) {
        const postIds = likes.map((like) => like.post_id).filter(Boolean)

        const { data: postsData } = await supabase
          .from("posts")
          .select(`
            *,
            profiles:author_id (id, full_name, avatar_url)
          `)
          .in("id", postIds)
          .order("created_at", { ascending: false })

        if (postsData) {
          const postsWithCounts = await Promise.all(
            postsData.map(async (post) => {
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

          setLikedPosts(postsWithCounts)
        }
      }

      setLoading((prev) => ({ ...prev, likes: false }))
    }

    if (activeTab === "posts") {
      fetchUserPosts()
    } else if (activeTab === "comments") {
      fetchUserComments()
    } else if (activeTab === "likes") {
      fetchLikedPosts()
    }
  }, [userId, supabase, activeTab])

  const renderPostCard = (post: Post) => (
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
  )

  return (
    <div className="container py-6">
      <Tabs defaultValue="posts" className="w-full" onValueChange={setActiveTab}>
        <TabsList className="mb-6">
          <TabsTrigger value="posts">게시글</TabsTrigger>
          <TabsTrigger value="comments">댓글</TabsTrigger>
          <TabsTrigger value="likes">좋아요</TabsTrigger>
        </TabsList>

        <TabsContent value="posts" className="space-y-4">
          {loading.posts ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <Card key={i} className="animate-pulse">
                  <CardHeader className="h-20 bg-muted/50"></CardHeader>
                  <CardContent className="h-16 bg-muted/30"></CardContent>
                  <CardFooter className="h-10 bg-muted/20"></CardFooter>
                </Card>
              ))}
            </div>
          ) : posts.length > 0 ? (
            <div className="space-y-4">{posts.map(renderPostCard)}</div>
          ) : (
            <EmptyFeed
              title="작성한 게시글이 없습니다"
              description="첫 번째 게시글을 작성해보세요!"
              actionLabel="게시글 작성하기"
              actionHref="/board/create"
            />
          )}
        </TabsContent>

        <TabsContent value="comments" className="space-y-4">
          {loading.comments ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <Card key={i} className="animate-pulse">
                  <CardHeader className="h-16 bg-muted/50"></CardHeader>
                  <CardContent className="h-12 bg-muted/30"></CardContent>
                </Card>
              ))}
            </div>
          ) : comments.length > 0 ? (
            <div className="space-y-4">
              {comments.map((comment) => (
                <Link key={comment.id} href={`/board/${comment.postId}`}>
                  <Card className="hover:bg-muted/50 transition-colors">
                    <CardHeader className="pb-2">
                      <div className="flex items-center justify-between">
                        <div className="font-semibold">게시글: {comment.postTitle}</div>
                        <span className="text-xs text-muted-foreground">
                          {formatDistanceToNow(new Date(comment.createdAt), {
                            addSuffix: true,
                            locale: ko,
                          })}
                        </span>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm">{comment.content}</p>
                    </CardContent>
                    <CardFooter>
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <ThumbsUp className="h-4 w-4" />
                        <span>{comment.likeCount}</span>
                      </div>
                    </CardFooter>
                  </Card>
                </Link>
              ))}
            </div>
          ) : (
            <EmptyFeed
              title="작성한 댓글이 없습니다"
              description="다른 게시글에 댓글을 남겨보세요!"
              actionLabel="게시판으로 이동"
              actionHref="/board"
            />
          )}
        </TabsContent>

        <TabsContent value="likes" className="space-y-4">
          {loading.likes ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <Card key={i} className="animate-pulse">
                  <CardHeader className="h-20 bg-muted/50"></CardHeader>
                  <CardContent className="h-16 bg-muted/30"></CardContent>
                  <CardFooter className="h-10 bg-muted/20"></CardFooter>
                </Card>
              ))}
            </div>
          ) : likedPosts.length > 0 ? (
            <div className="space-y-4">{likedPosts.map(renderPostCard)}</div>
          ) : (
            <EmptyFeed
              title="좋아요한 게시글이 없습니다"
              description="마음에 드는 게시글에 좋아요를 눌러보세요!"
              actionLabel="게시판으로 이동"
              actionHref="/board"
            />
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
