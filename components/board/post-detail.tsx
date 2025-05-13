"use client"

import { useState } from "react"
import Link from "next/link"
import { formatDistanceToNow } from "date-fns"
import { ko } from "date-fns/locale"
import { MoreHorizontal, ThumbsUp, MessageSquare, Share, Trash, Pencil } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { useAuth } from "@/hooks/use-auth"
import { usePosts } from "@/hooks/use-posts"
import type { PostDetail } from "@/model/post/post-types"

interface PostDetailProps {
  post: PostDetail
}

export function PostDetail({ post }: PostDetailProps) {
  const { user } = useAuth()
  const { toggleLike, deletePost, isLoading } = usePosts()
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)

  const isAuthor = user?.id === post.author.id

  const handleLike = () => {
    toggleLike(post.id)
  }

  const handleDelete = async () => {
    await deletePost(post.id)
    setIsDeleteDialogOpen(false)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Avatar className="h-10 w-10">
            <AvatarImage src={post.author.avatarUrl || ""} alt={post.author.fullName || ""} />
            <AvatarFallback>{post.author.fullName?.charAt(0) || "U"}</AvatarFallback>
          </Avatar>
          <div>
            <div className="font-semibold">
              <Link href={`/profile/${post.author.id}`}>{post.author.fullName}</Link>
            </div>
            <div className="text-sm text-muted-foreground">
              {formatDistanceToNow(new Date(post.createdAt), {
                addSuffix: true,
                locale: ko,
              })}
            </div>
          </div>
        </div>

        {isAuthor && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <MoreHorizontal className="h-4 w-4" />
                <span className="sr-only">메뉴</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem asChild>
                <Link href={`/board/${post.id}/edit`} className="cursor-pointer">
                  <Pencil className="mr-2 h-4 w-4" />
                  <span>수정</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => setIsDeleteDialogOpen(true)}
                className="cursor-pointer text-destructive focus:text-destructive"
              >
                <Trash className="mr-2 h-4 w-4" />
                <span>삭제</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>

      <div>
        <h1 className="text-2xl font-bold mb-2">{post.title}</h1>
        {post.category && (
          <Badge variant="outline" className="mb-4">
            {post.category}
          </Badge>
        )}
        <div className="prose prose-sm max-w-none">{post.content}</div>
      </div>

      <div className="flex items-center gap-4 pt-4 border-t">
        <Button variant="ghost" size="sm" className="gap-2" onClick={handleLike} disabled={isLoading}>
          <ThumbsUp className="h-4 w-4" fill={post.isLikedByCurrentUser ? "currentColor" : "none"} />
          <span>좋아요 {post.likeCount}</span>
        </Button>
        <Button variant="ghost" size="sm" className="gap-2">
          <MessageSquare className="h-4 w-4" />
          <span>댓글 {post.commentCount}</span>
        </Button>
        <Button variant="ghost" size="sm" className="gap-2">
          <Share className="h-4 w-4" />
          <span>공유</span>
        </Button>
      </div>

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>게시글 삭제</AlertDialogTitle>
            <AlertDialogDescription>
              정말로 이 게시글을 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>취소</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={isLoading}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              삭제
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
