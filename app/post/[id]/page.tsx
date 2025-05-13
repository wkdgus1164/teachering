"use client"

import React from "react"
import Link from "next/link"
import { Heart, MoreHorizontal, Edit, Trash } from "lucide-react"
import { Header } from "@/components/layout/header"
import { Avatar } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Markdown } from "@/components/ui/markdown"
import { CommentForm } from "@/components/post/comment-form"
import { CommentItem } from "@/components/post/comment-item"
import { usePost } from "@/hooks/use-post"
import { useUser } from "@/hooks/use-user"
import { useAuth } from "@/hooks/use-auth"
import authService from "@/infra/auth-service"
import { ShareButton } from "@/components/ui/share-button"

export default function Page({ params }: { params: { id: string } }) {
  const postId = params.id
  const {
    post,
    comments,
    isLoading,
    isCommentsLoading,
    error,
    likePost,
    sharePost,
    addComment,
    updateComment,
    deleteComment,
    likeComment,
  } = usePost(postId)
  const { user: author, isLoading: isAuthorLoading } = useUser(post?.authorId)
  const { isAuthenticated } = useAuth()
  const currentUser = authService.getUser()
  const isAuthor = currentUser?.id === post?.authorId
  const [isMenuOpen, setIsMenuOpen] = React.useState(false)

  if (isLoading || isAuthorLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 container max-w-4xl py-6">
          <div className="space-y-4">
            <div className="h-8 w-64 rounded-md bg-muted animate-pulse" />
            <div className="h-4 w-32 rounded-md bg-muted animate-pulse" />
            <div className="h-64 rounded-lg bg-muted animate-pulse" />
          </div>
        </main>
      </div>
    )
  }

  if (error || !post) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 container max-w-4xl py-6">
          <div className="p-4 border rounded-md bg-red-50 text-red-500">{error || "Post not found"}</div>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container max-w-4xl py-6">
        <Card className="overflow-hidden">
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-4">
                {author && (
                  <>
                    <Avatar src={author.profileImage} alt={author.username} userId={author.id} />
                    <div>
                      <Link href={`/profile/${author.id}`} className="font-medium hover:underline">
                        {author.username}
                      </Link>
                      <p className="text-xs text-muted-foreground">{post.formattedCreatedAt}</p>
                    </div>
                  </>
                )}
              </div>

              {isAuthor && (
                <div className="relative">
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={() => setIsMenuOpen(!isMenuOpen)}>
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                  {isMenuOpen && (
                    <div className="absolute right-0 top-full mt-1 w-32 rounded-md border bg-background shadow-md z-10">
                      <Link href={`/post/edit/${post.id}`}>
                        <Button variant="ghost" size="sm" className="flex w-full items-center justify-start px-3">
                          <Edit className="mr-2 h-4 w-4" />
                          Edit
                        </Button>
                      </Link>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="flex w-full items-center justify-start px-3 text-red-500 hover:text-red-600"
                      >
                        <Trash className="mr-2 h-4 w-4" />
                        Delete
                      </Button>
                    </div>
                  )}
                </div>
              )}
            </div>

            <h1 className="text-3xl font-bold mb-4">{post.title}</h1>

            <div className="flex flex-wrap gap-2 mb-6">
              {post.categories.map((category) => (
                <span
                  key={category}
                  className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                >
                  {category}
                </span>
              ))}
            </div>

            <div className="prose max-w-none">
              <Markdown content={post.content} />
            </div>

            <div className="flex items-center space-x-4 mt-6 pt-6 border-t">
              <Button
                variant="ghost"
                size="sm"
                className="flex items-center space-x-1"
                onClick={() => likePost()}
                disabled={!isAuthenticated}
                title={!isAuthenticated ? "로그인이 필요합니다" : ""}
              >
                <Heart className="h-4 w-4" />
                <span>{post.likes}</span>
              </Button>
              <ShareButton url={`${window.location.origin}/post/${post.id}`} title={post.title} />
            </div>
          </div>

          <div className="p-6 border-t" id="comments">
            <h2 className="text-xl font-semibold mb-6">Comments ({post.commentCount})</h2>

            {isAuthenticated ? (
              <div className="mb-8">
                <CommentForm onSubmit={addComment} />
              </div>
            ) : (
              <div className="mb-8 p-4 bg-muted rounded-md text-center">
                <p className="text-muted-foreground mb-2">댓글을 작성하려면 로그인이 필요합니다.</p>
                <Button asChild size="sm">
                  <Link href={`/login?redirect=/post/${postId}`}>로그인</Link>
                </Button>
              </div>
            )}

            {isCommentsLoading ? (
              <div className="space-y-4">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="h-24 rounded-md bg-muted animate-pulse" />
                ))}
              </div>
            ) : comments.length > 0 ? (
              <div className="space-y-2">
                {comments.map((comment) => (
                  <CommentItem
                    key={comment.id}
                    comment={comment}
                    onLike={likeComment}
                    onUpdate={updateComment}
                    onDelete={deleteComment}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">No comments yet. Be the first to comment!</div>
            )}
          </div>
        </Card>
      </main>
    </div>
  )
}
