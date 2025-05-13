"use client"

import { useState, useEffect, useCallback } from "react"
import postService from "@/infra/post-service"
import commentService from "@/infra/comment-service"
import type { Post } from "@/model/post-model"
import type { Comment } from "@/model/comment-model"
import { STATUS } from "@/infra/api-response"
import { useApiToast } from "./use-api-toast"
import { useAuth } from "./use-auth"

// Import the utility at the top of the file
import { copyToClipboard } from "@/lib/clipboard-utils"

export function usePost(postId: string) {
  const [post, setPost] = useState<Post | null>(null)
  const [comments, setComments] = useState<Comment[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [isCommentsLoading, setIsCommentsLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)
  const { toastResponse } = useApiToast()
  const { isAuthenticated } = useAuth()

  useEffect(() => {
    const fetchPost = async () => {
      setIsLoading(true)
      setError(null)

      try {
        const response = await postService.getPostById(postId)
        // Don't show toast for initial data loading

        if (response.status === STATUS.SUCCESS) {
          setPost(response.data)
        } else {
          setError(response.message)
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "게시글을 불러오는데 실패했습니다.")
      } finally {
        setIsLoading(false)
      }
    }

    const fetchComments = async () => {
      setIsCommentsLoading(true)

      try {
        const response = await commentService.getCommentsByPostId(postId)
        // Don't show toast for initial data loading

        if (response.status === STATUS.SUCCESS) {
          setComments(response.data || [])
        } else {
          console.error("Failed to fetch comments:", response.message)
        }
      } catch (err) {
        console.error("Failed to fetch comments:", err)
      } finally {
        setIsCommentsLoading(false)
      }
    }

    fetchPost()
    fetchComments()
  }, [postId])

  const likePost = useCallback(async () => {
    if (!post || !isAuthenticated) return

    try {
      const response = await postService.likePost(post.id)
      toastResponse(response)

      if (response.status === STATUS.SUCCESS) {
        // Update the post in the local state
        setPost((prevPost) => {
          if (!prevPost) return null
          return { ...prevPost, likes: prevPost.likes + 1 }
        })
      } else {
        setError(response.message)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "좋아요를 누르는데 실패했습니다.")
    }
  }, [post, toastResponse, isAuthenticated])

  // Then update the sharePost function
  const sharePost = useCallback(async () => {
    if (!post) return

    try {
      const response = await postService.sharePost(post.id)

      if (response.status === STATUS.SUCCESS && response.data) {
        const shareLink = response.data

        // Always default to clipboard copy which is more reliable
        const copied = await copyToClipboard(shareLink)

        if (copied) {
          toastResponse({
            status: STATUS.SUCCESS,
            data: shareLink,
            message: "링크가 클립보드에 복사되었습니다.",
          })
        } else {
          toastResponse({
            status: STATUS.ERROR,
            data: null,
            message: "링크 복사에 실패했습니다.",
          })
        }
      } else {
        setError(response.message)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "게시글 공유에 실패했습니다.")
    }
  }, [post, toastResponse])

  const addComment = useCallback(
    async (content: string) => {
      if (!post || !isAuthenticated) return

      try {
        const response = await commentService.addComment(post.id, content)
        toastResponse(response)

        if (response.status === STATUS.SUCCESS && response.data) {
          setComments((prevComments) => [response.data!, ...prevComments])

          // Update comment count in post
          setPost((prevPost) => {
            if (!prevPost) return null
            return { ...prevPost, commentCount: prevPost.commentCount + 1 }
          })
        } else {
          setError(response.message)
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "댓글 등록에 실패했습니다.")
      }
    },
    [post, toastResponse, isAuthenticated],
  )

  const updateComment = useCallback(
    async (commentId: string, content: string) => {
      if (!isAuthenticated) return

      try {
        const response = await commentService.updateComment(commentId, content)
        toastResponse(response)

        if (response.status === STATUS.SUCCESS && response.data) {
          setComments((prevComments) =>
            prevComments.map((comment) => (comment.id === commentId ? response.data! : comment)),
          )
        } else {
          setError(response.message)
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "댓글 수정에 실패했습니다.")
      }
    },
    [toastResponse, isAuthenticated],
  )

  const deleteComment = useCallback(
    async (commentId: string) => {
      if (!isAuthenticated) return

      try {
        const response = await commentService.deleteComment(commentId)
        toastResponse(response)

        if (response.status === STATUS.SUCCESS) {
          setComments((prevComments) => prevComments.filter((comment) => comment.id !== commentId))

          // Update comment count in post
          setPost((prevPost) => {
            if (!prevPost) return null
            return { ...prevPost, commentCount: prevPost.commentCount - 1 }
          })
        } else {
          setError(response.message)
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "댓글 삭제에 실패했습니다.")
      }
    },
    [toastResponse, isAuthenticated],
  )

  const likeComment = useCallback(
    async (commentId: string) => {
      if (!isAuthenticated) return

      try {
        const response = await commentService.likeComment(commentId)
        toastResponse(response)

        if (response.status === STATUS.SUCCESS) {
          // Update the comment in the local state
          setComments((prevComments) =>
            prevComments.map((comment) =>
              comment.id === commentId ? { ...comment, likes: comment.likes + 1 } : comment,
            ),
          )
        } else {
          setError(response.message)
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "좋아요를 누르는데 실패했습니다.")
      }
    },
    [toastResponse, isAuthenticated],
  )

  return {
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
  }
}
