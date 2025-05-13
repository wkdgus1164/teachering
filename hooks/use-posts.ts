"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useSupabase } from "@/infra/supabase/provider"
import { useToast } from "@/hooks/use-toast"
import type { PostFormValues } from "@/schema/zod-schemas"

export function usePosts() {
  const { supabase } = useSupabase()
  const router = useRouter()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)

  const createPost = async (values: PostFormValues) => {
    setIsLoading(true)

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) {
        toast({
          title: "로그인이 필요합니다",
          description: "게시글을 작성하려면 로그인해주세요",
          variant: "destructive",
        })
        router.push("/auth/sign-in")
        return
      }

      const { error, data } = await supabase
        .from("posts")
        .insert({
          title: values.title,
          content: values.content,
          category: values.category || null,
          author_id: user.id,
        })
        .select()

      if (error) throw error

      toast({
        title: "게시글이 작성되었습니다",
        description: "게시판으로 이동합니다",
      })

      if (data && data[0]) {
        router.push(`/board/${data[0].id}`)
      } else {
        router.push("/board")
      }
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

  const updatePost = async (id: string, values: PostFormValues) => {
    setIsLoading(true)

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) {
        toast({
          title: "로그인이 필요합니다",
          description: "게시글을 수정하려면 로그인해주세요",
          variant: "destructive",
        })
        router.push("/auth/sign-in")
        return
      }

      // Check if user is the author
      const { data: post } = await supabase.from("posts").select("author_id").eq("id", id).single()

      if (!post || post.author_id !== user.id) {
        toast({
          title: "권한이 없습니다",
          description: "자신의 게시글만 수정할 수 있습니다",
          variant: "destructive",
        })
        return
      }

      const { error } = await supabase
        .from("posts")
        .update({
          title: values.title,
          content: values.content,
          category: values.category || null,
          updated_at: new Date().toISOString(),
        })
        .eq("id", id)

      if (error) throw error

      toast({
        title: "게시글이 수정되었습니다",
        description: "게시글 페이지로 이동합니다",
      })

      router.push(`/board/${id}`)
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

  const deletePost = async (id: string) => {
    setIsLoading(true)

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) {
        toast({
          title: "로그인이 필요합니다",
          description: "게시글을 삭제하려면 로그인해주세요",
          variant: "destructive",
        })
        router.push("/auth/sign-in")
        return
      }

      // Check if user is the author
      const { data: post } = await supabase.from("posts").select("author_id").eq("id", id).single()

      if (!post || post.author_id !== user.id) {
        toast({
          title: "권한이 없습니다",
          description: "자신의 게시글만 삭제할 수 있습니다",
          variant: "destructive",
        })
        return
      }

      const { error } = await supabase.from("posts").delete().eq("id", id)

      if (error) throw error

      toast({
        title: "게시글이 삭제되었습니다",
        description: "게시판으로 이동합니다",
      })

      router.push("/board")
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

  const toggleLike = async (postId: string) => {
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

      // Check if user already liked the post
      const { data: existingLike } = await supabase
        .from("likes")
        .select("id")
        .eq("user_id", user.id)
        .eq("post_id", postId)
        .maybeSingle()

      if (existingLike) {
        // Unlike
        const { error } = await supabase.from("likes").delete().eq("id", existingLike.id)
        if (error) throw error
      } else {
        // Like
        const { error } = await supabase.from("likes").insert({
          user_id: user.id,
          post_id: postId,
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
    createPost,
    updatePost,
    deletePost,
    toggleLike,
    isLoading,
  }
}
