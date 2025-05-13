"use client"

import Link from "next/link"
import { Heart, MessageSquare } from "lucide-react"
import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card"
import { Avatar } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Markdown } from "@/components/ui/markdown"
import { useUser } from "@/hooks/use-user"
import type { Post } from "@/model/post-model"
import { ShareButton } from "@/components/ui/share-button"
import { isBrowser } from "@/lib/clipboard-utils"

interface PostCardProps {
  post: Post
  onLike: (postId: string) => Promise<void>
  onShare: (postId: string) => Promise<void>
}

export function PostCard({ post, onLike, onShare }: PostCardProps) {
  const { user: author, isLoading } = useUser(post.authorId)

  // Generate a safe URL for sharing that works on both client and server
  const getShareUrl = () => {
    if (isBrowser()) {
      return `${window.location.origin}/post/${post.id}`
    }
    return `/post/${post.id}`
  }

  return (
    <Card className="overflow-hidden">
      <CardHeader className="p-4">
        <div className="flex items-center space-x-4">
          {!isLoading && author && (
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
      </CardHeader>
      <CardContent className="p-4 pt-0">
        <Link href={`/post/${post.id}`} className="block">
          <h3 className="text-xl font-semibold mb-2 hover:underline">{post.title}</h3>
          <Markdown content={post.content} preview className="text-muted-foreground" />
        </Link>

        <div className="flex flex-wrap gap-2 mt-4">
          {post.categories.map((category) => (
            <span
              key={category}
              className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
            >
              {category}
            </span>
          ))}
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-0 flex flex-col space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="sm" className="flex items-center space-x-1" onClick={() => onLike(post.id)}>
              <Heart className="h-4 w-4" />
              <span>{post.likes}</span>
            </Button>
            <ShareButton url={getShareUrl()} title={post.title} size="sm" />
            <Link href={`/post/${post.id}#comments`}>
              <Button variant="ghost" size="sm" className="flex items-center space-x-1">
                <MessageSquare className="h-4 w-4" />
                <span>{post.commentCount}</span>
              </Button>
            </Link>
          </div>
        </div>

        {(post.bestComment || post.latestComment) && (
          <div className="border-t pt-4">
            <div className="text-sm font-medium mb-2">{post.bestComment ? "Best Comment" : "Latest Comment"}</div>
            <div className="flex items-start space-x-2">
              {post.bestComment && (
                <Avatar
                  src={`/placeholder.svg?height=200&width=200&query=profile${post.bestComment.authorId}`}
                  alt="Commenter"
                  size="sm"
                  userId={post.bestComment.authorId}
                />
              )}
              {post.latestComment && !post.bestComment && (
                <Avatar
                  src={`/placeholder.svg?height=200&width=200&query=profile${post.latestComment.authorId}`}
                  alt="Commenter"
                  size="sm"
                  userId={post.latestComment.authorId}
                />
              )}
              <div className="flex-1">
                <Markdown
                  content={
                    post.bestComment ? post.bestComment.content : post.latestComment ? post.latestComment.content : ""
                  }
                  preview
                  className="text-sm"
                />
              </div>
            </div>
          </div>
        )}
      </CardFooter>
    </Card>
  )
}
