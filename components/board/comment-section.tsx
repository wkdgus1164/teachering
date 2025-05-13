"use client"

import { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { formatDistanceToNow } from "date-fns"
import { ko } from "date-fns/locale"
import { MoreHorizontal, ThumbsUp, Trash, Pencil } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
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
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form"
import { Textarea } from "@/components/ui/textarea"
import { useAuth } from "@/hooks/use-auth"
import { useComments } from "@/hooks/use-comments"
import { commentSchema, type CommentFormValues } from "@/schema/zod-schemas"
import { useSupabaseFetch } from "@/infra/supabase/client-fetch"
import { fetchCommentsByPostId } from "@/model/comment/comment-client"
import type { Comment } from "@/model/comment/comment-types"

interface CommentSectionProps {
  postId: string
}

export function CommentSection({ postId }: CommentSectionProps) {
  const { user } = useAuth()
  const { createComment, updateComment, deleteComment, toggleLike, isLoading } = useComments()
  const { data: fetchedComments, loading } = useSupabaseFetch(
    (supabase) => fetchCommentsByPostId(supabase, postId),
    [postId],
  )
  const [comments, setComments] = useState<Comment[]>([])
  const [editingCommentId, setEditingCommentId] = useState<string | null>(null)
  const [deleteCommentId, setDeleteCommentId] = useState<string | null>(null)

  useEffect(() => {
    if (fetchedComments) {
      setComments(fetchedComments)
    }
  }, [fetchedComments])

  // Form for new comment
  const newCommentForm = useForm<CommentFormValues>({
    resolver: zodResolver(commentSchema),
    defaultValues: {
      content: "",
    },
  })

  // Form for editing comment
  const editCommentForm = useForm<CommentFormValues>({
    resolver: zodResolver(commentSchema),
    defaultValues: {
      content: "",
    },
  })

  const onSubmitNewComment = async (values: CommentFormValues) => {
    await createComment(postId, values)
    newCommentForm.reset()
  }

  const onSubmitEditComment = async (values: CommentFormValues) => {
    if (editingCommentId) {
      await updateComment(editingCommentId, values)
      setEditingCommentId(null)
    }
  }

  const startEditing = (commentId: string, content: string) => {
    editCommentForm.reset({ content })
    setEditingCommentId(commentId)
  }

  const cancelEditing = () => {
    setEditingCommentId(null)
  }

  const handleDeleteComment = async () => {
    if (deleteCommentId) {
      await deleteComment(deleteCommentId)
      setDeleteCommentId(null)
    }
  }

  if (loading) {
    return (
      <div className="mt-8 space-y-6">
        <h2 className="text-xl font-bold">댓글</h2>
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="border-b pb-4">
              <div className="flex items-start gap-4">
                <div className="h-8 w-8 rounded-full bg-muted/70 animate-pulse"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 w-32 bg-muted/70 animate-pulse rounded"></div>
                  <div className="h-4 w-full bg-muted/50 animate-pulse rounded"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="mt-8 space-y-6">
      <h2 className="text-xl font-bold">댓글</h2>

      {user ? (
        <Form {...newCommentForm}>
          <form onSubmit={newCommentForm.handleSubmit(onSubmitNewComment)} className="space-y-4">
            <FormField
              control={newCommentForm.control}
              name="content"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Textarea placeholder="댓글을 작성해주세요..." className="min-h-[100px]" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex justify-end">
              <Button type="submit" disabled={isLoading}>
                댓글 작성
              </Button>
            </div>
          </form>
        </Form>
      ) : (
        <div className="rounded-md bg-muted p-4 text-center">
          <p className="text-sm text-muted-foreground">댓글을 작성하려면 로그인이 필요합니다.</p>
          <Button asChild variant="link" className="mt-2">
            <a href="/auth/sign-in">로그인하기</a>
          </Button>
        </div>
      )}

      <div className="space-y-4">
        {comments.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-muted-foreground">아직 댓글이 없습니다. 첫 댓글을 작성해보세요!</p>
          </div>
        ) : (
          comments.map((comment) => (
            <div key={comment.id} className="border-b pb-4">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-4">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={comment.author.avatarUrl || ""} alt={comment.author.fullName || ""} />
                    <AvatarFallback>{comment.author.fullName?.charAt(0) || "U"}</AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold">{comment.author.fullName}</span>
                      <span className="text-xs text-muted-foreground">
                        {formatDistanceToNow(new Date(comment.createdAt), {
                          addSuffix: true,
                          locale: ko,
                        })}
                      </span>
                    </div>

                    {editingCommentId === comment.id ? (
                      <Form {...editCommentForm}>
                        <form onSubmit={editCommentForm.handleSubmit(onSubmitEditComment)} className="mt-2 space-y-2">
                          <FormField
                            control={editCommentForm.control}
                            name="content"
                            render={({ field }) => (
                              <FormItem>
                                <FormControl>
                                  <Textarea {...field} className="min-h-[80px]" />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <div className="flex gap-2">
                            <Button type="submit" size="sm" disabled={isLoading}>
                              저장
                            </Button>
                            <Button type="button" variant="outline" size="sm" onClick={cancelEditing}>
                              취소
                            </Button>
                          </div>
                        </form>
                      </Form>
                    ) : (
                      <p className="mt-1 text-sm">{comment.content}</p>
                    )}
                  </div>
                </div>

                {user?.id === comment.author.id && !editingCommentId && (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreHorizontal className="h-4 w-4" />
                        <span className="sr-only">메뉴</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem
                        onClick={() => startEditing(comment.id, comment.content)}
                        className="cursor-pointer"
                      >
                        <Pencil className="mr-2 h-4 w-4" />
                        <span>수정</span>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        onClick={() => setDeleteCommentId(comment.id)}
                        className="cursor-pointer text-destructive focus:text-destructive"
                      >
                        <Trash className="mr-2 h-4 w-4" />
                        <span>삭제</span>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                )}
              </div>

              {!editingCommentId && (
                <div className="mt-2 ml-12">
                  <Button variant="ghost" size="sm" className="h-8 gap-1 px-2" onClick={() => toggleLike(comment.id)}>
                    <ThumbsUp className="h-3.5 w-3.5" fill={comment.isLikedByCurrentUser ? "currentColor" : "none"} />
                    <span className="text-xs">{comment.likeCount}</span>
                  </Button>
                </div>
              )}
            </div>
          ))
        )}
      </div>

      <AlertDialog open={!!deleteCommentId} onOpenChange={(open) => !open && setDeleteCommentId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>댓글 삭제</AlertDialogTitle>
            <AlertDialogDescription>
              정말로 이 댓글을 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>취소</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteComment}
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
