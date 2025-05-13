"use client"

import type { CommentSchema } from "@/schema/post-schema"
import type { ApiResponse } from "@/schema/response-schema"
import { Comment } from "@/model/comment-model"
import authService from "./auth-service"
import { handleApiResponse, STATUS, createErrorResponse } from "./api-response"

class CommentService {
  async getCommentsByPostId(postId: string): ApiResponse<Comment[]> {
    // Simulate API call with our global response format
    return handleApiResponse(
      new Promise<Comment[]>((resolve, reject) => {
        setTimeout(() => {
          if (!postId) {
            reject(new Error("게시글 ID가 필요합니다."))
            return
          }

          // Mock comments data
          const commentsData: CommentSchema[] = Array.from({ length: 5 }, (_, i) => ({
            id: `comment-${postId}-${i + 1}`,
            content:
              i % 2 === 0
                ? `This is comment ${i + 1} for post ${postId}. It has **markdown** support!`
                : `I really enjoyed reading this post. The insights about Korean education system are valuable.\n\n- Point 1\n- Point 2\n- Point 3`,
            authorId: `${(i % 3) + 1}`, // Cycle through 3 different authors
            postId: postId,
            createdAt: new Date(Date.now() - i * 3600000).toISOString(), // Each comment 1 hour apart
            updatedAt: new Date(Date.now() - i * 3600000 + 600000).toISOString(), // Updated 10 minutes after creation
            likes: Math.floor(Math.random() * 20),
          }))

          resolve(commentsData.map((comment) => new Comment(comment)))
        }, 800)
      }),
      "댓글 목록을 성공적으로 불러왔습니다.",
      "댓글 목록을 불러오는데 실패했습니다.",
    )
  }

  async addComment(postId: string, content: string): ApiResponse<Comment> {
    if (!authService.isAuthenticated()) {
      return createErrorResponse(STATUS.UNAUTHORIZED, "댓글을 작성하려면 로그인이 필요합니다.")
    }

    const currentUser = authService.getUser()
    if (!currentUser) {
      return createErrorResponse(STATUS.UNAUTHORIZED, "사용자 정보를 찾을 수 없습니다.")
    }

    // Simulate API call with our global response format
    return handleApiResponse(
      new Promise<Comment>((resolve, reject) => {
        setTimeout(() => {
          if (!postId) {
            reject(new Error("게시글 ID가 필요합니다."))
            return
          }

          if (!content.trim()) {
            reject(new Error("댓글 내용을 입력해주세요."))
            return
          }

          // Mock new comment data
          const newCommentData: CommentSchema = {
            id: `comment-${postId}-new-${Date.now()}`,
            content: content,
            authorId: currentUser.id,
            postId: postId,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            likes: 0,
          }

          resolve(new Comment(newCommentData))
        }, 500)
      }),
      "댓글이 성공적으로 등록되었습니다.",
      "댓글 등록에 실패했습니다.",
    )
  }

  async updateComment(commentId: string, content: string): ApiResponse<Comment> {
    if (!authService.isAuthenticated()) {
      return createErrorResponse(STATUS.UNAUTHORIZED, "댓글을 수정하려면 로그인이 필요합니다.")
    }

    // Simulate API call with our global response format
    return handleApiResponse(
      new Promise<Comment>((resolve, reject) => {
        setTimeout(() => {
          if (!commentId) {
            reject(new Error("댓글 ID가 필요합니다."))
            return
          }

          if (!content.trim()) {
            reject(new Error("댓글 내용을 입력해주세요."))
            return
          }

          // Mock updated comment data
          const updatedCommentData: CommentSchema = {
            id: commentId,
            content: content,
            authorId: authService.getUser()?.id || "1",
            postId: commentId.split("-")[1], // Extract postId from commentId
            createdAt: new Date(Date.now() - 3600000).toISOString(), // Created 1 hour ago
            updatedAt: new Date().toISOString(), // Updated now
            likes: Math.floor(Math.random() * 20),
          }

          resolve(new Comment(updatedCommentData))
        }, 500)
      }),
      "댓글이 성공적으로 수정되었습니다.",
      "댓글 수정에 실패했습니다.",
    )
  }

  async deleteComment(commentId: string): ApiResponse<void> {
    if (!authService.isAuthenticated()) {
      return createErrorResponse(STATUS.UNAUTHORIZED, "댓글을 삭제하려면 로그인이 필요합니다.")
    }

    // Simulate API call with our global response format
    return handleApiResponse(
      new Promise<void>((resolve, reject) => {
        setTimeout(() => {
          if (!commentId) {
            reject(new Error("댓글 ID가 필요합니다."))
            return
          }

          // In a real app, this would delete the comment in the backend
          console.log(`Deleted comment ${commentId}`)
          resolve()
        }, 500)
      }),
      "댓글이 성공적으로 삭제되었습니다.",
      "댓글 삭제에 실패했습니다.",
    )
  }

  async likeComment(commentId: string): ApiResponse<void> {
    if (!authService.isAuthenticated()) {
      return createErrorResponse(STATUS.UNAUTHORIZED, "좋아요를 누르려면 로그인이 필요합니다.")
    }

    // Simulate API call with our global response format
    return handleApiResponse(
      new Promise<void>((resolve, reject) => {
        setTimeout(() => {
          if (!commentId) {
            reject(new Error("댓글 ID가 필요합니다."))
            return
          }

          // In a real app, this would update the backend
          console.log(`Liked comment ${commentId}`)
          resolve()
        }, 300)
      }),
      "댓글에 좋아요를 눌렀습니다.",
      "좋아요를 누르는데 실패했습니다.",
    )
  }
}

// Create a singleton instance
const commentService = new CommentService()
export default commentService
