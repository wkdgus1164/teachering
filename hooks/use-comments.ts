"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useSupabase } from "@/infra/supabase/provider"
import { useToast } from "@/hooks/use-toast"
import type { CommentFormValues } from "@/schema/zod-schemas"

export function useComments() {
  const { supabase } = useSupabase()
  const router = useRouter()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)

  const createComment = async (postId: string, values: CommentFormValues) => {
    setIsLoading(true)

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) {
        toast({
          title: "로그인이 필요합니다",
          description: "댓글을 작성하려면 로그인해주세요",
          variant: "destructive",
        })
        router.push("/auth/sign-in")
        return
      }

      const { error } = await supabase.from("comments").insert({
        content: values.content,
        author_id: user.id,
        post_id: postId,
      })

      if (error) throw error

      toast({
        title: "댓글이 작성되었습니다",
      })

      router.refresh()
    } catch (error) {
      console.error(error)
      toast({
        title: "오류가 발생했습니다",
        description: "잠시 후 다시 시도해주세요",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const updateComment = async (commentId: string, values: CommentFormValues) => {
    setIsLoading(true)

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) {
        toast({
          title: "로그인이 필요합니다",
          description: "댓글을 수정하려면 로그인해주세요",
          variant: "destructive",
        })
        router.push("/auth/sign-in")
        return
      }

      // Check if user is the author
      const { data: comment } = await supabase.from("comments").select("author_id").eq("id", commentId).single()

      if (!comment || comment.author_id !== user.id) {
        toast({
          title: "권한이 없습니다",
          description: "자신의 댓글만 수정할 수 있습니다",
          variant: "destructive",
        })
        return
      }

      const { error } = await supabase
        .from("comments")
        .update({
          content: values.content,
          updated_at: new Date().toISOString(),
        })
        .eq("id", commentId)

      if (error) throw error

      toast({
        title: "댓글이 수정되었습니다",
      })

      router.refresh()
    } catch (error) {
      console.error(error)
      toast({
        title: "오류가 발생했습니다",
        description: "잠시 후 다시 시도해주세요",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const deleteComment = async (commentId: string) => {
    setIsLoading(true)

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) {
        toast({
          title: "로그인이 필요합니다",
          description: "댓글을 삭제하려면 로그인해주세요",
          variant: "destructive",
        })
        router.push("/auth/sign-in")
        return
      }

      // Check if user is the author
      const { data: comment } = await supabase.from("comments").select("author_id").eq("id", commentId).single()

      if (!comment || comment.author_id !== user.id) {
        toast({
          title: "권한이 없습니다",
          description: "자신의 댓글만 삭제할 수 있습니다",
          variant: "destructive",
        })
        return
      }

      const { error } = await supabase.from("comments").delete().eq("id", commentId)

      if (error) throw error

      toast({
        title: "댓글이 삭제되었습니다",
      })

      router.refresh()
    } catch (error) {
      console.error(error)
      toast({
        title: "오류가 발생했습니다",
        description: "잠시 후 다시 시도해주세요",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const toggleLike = async (commentId: string) => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) {
        toast({
          title: "로그인이 필요합니다",
          description: "좋아요를 누르려면 로그인해주세요",
          variant: "destructive",
        })
        router.push("/auth/sign-in")
        return
      }

      // Check if user already liked the comment
      const { data: existingLike } = await supabase
        .from("likes")
        .select("id")
        .eq("user_id", user.id)
        .eq("comment_id", commentId)
        .maybeSingle()

      if (existingLike) {
        // Unlike
        const { error } = await supabase.from("likes").delete().eq("id", existingLike.id)
        if (error) throw error
      } else {
        // Like
        const { error } = await supabase.from("likes").insert({
          user_id: user.id,
          comment_id: commentId,
        })
        if (error) throw error
      }

      router.refresh()
    } catch (error) {
      console.error(error)
      toast({
        title: "오류가 발생했습니다",
        description: "잠시 후 다시 시도해주세요",
        variant: "destructive",
      })
    }
  }

  return {
    createComment,
    updateComment,
    deleteComment,
    toggleLike,
    isLoading,
  }
}
