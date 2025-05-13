"use client"

import { useState, useEffect, useCallback } from "react"
import postService from "@/infra/post-service"
import type { Post } from "@/model/post-model"
import { STATUS } from "@/infra/api-response"
import { useApiToast } from "./use-api-toast"

// Import the utility at the top of the file
import { copyToClipboard } from "@/lib/clipboard-utils"

export function usePosts() {
  const [posts, setPosts] = useState<Post[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)
  const { toastResponse } = useApiToast()

  useEffect(() => {
    const fetchPosts = async () => {
      setIsLoading(true)
      setError(null)

      try {
        const response = await postService.getPosts()
        // Don't show toast for initial data loading

        if (response.status === STATUS.SUCCESS && response.data) {
          setPosts(response.data)
        } else {
          setError(response.message)
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "게시글 목록을 불러오는데 실패했습니다.")
      } finally {
        setIsLoading(false)
      }
    }

    fetchPosts()
  }, [])

  const likePost = useCallback(
    async (postId: string) => {
      try {
        const response = await postService.likePost(postId)
        toastResponse(response)

        if (response.status === STATUS.SUCCESS) {
          // Update the post in the local state
          setPosts((prevPosts) =>
            prevPosts.map((post) => (post.id === postId ? { ...post, likes: post.likes + 1 } : post)),
          )
        } else {
          setError(response.message)
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "좋아요를 누르는데 실패했습니다.")
      }
    },
    [toastResponse],
  )

  // Then update the sharePost function
  const sharePost = useCallback(
    async (postId: string) => {
      try {
        const response = await postService.sharePost(postId)

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
    },
    [toastResponse],
  )

  return { posts, isLoading, error, likePost, sharePost }
}
