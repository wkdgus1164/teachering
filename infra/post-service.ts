"use client"

import type { PostSchema } from "@/schema/post-schema"
import type { ApiResponse } from "@/schema/response-schema"
import { Post } from "@/model/post-model"
import authService from "./auth-service"
import { handleApiResponse, STATUS, createErrorResponse } from "./api-response"

interface CreatePostData {
  title: string
  content: string
  categories: string[]
}

interface UpdatePostData {
  title: string
  content: string
  categories: string[]
}

class PostService {
  async getPosts(): ApiResponse<Post[]> {
    // Simulate API call with our global response format
    return handleApiResponse(
      new Promise<Post[]>((resolve) => {
        setTimeout(() => {
          // Mock posts data
          const postsData: PostSchema[] = Array.from({ length: 10 }, (_, i) => ({
            id: `${i + 1}`,
            title: `Post ${i + 1}: Educational Insights for Korean Teachers`,
            content: `# Main Heading for Post ${i + 1}\n\nThis is a sample post content with **markdown** support. It includes paragraphs, lists, and other formatting.\n\n## Subheading\n\n- Item 1\n- Item 2\n- Item 3\n\nThis content is meant to demonstrate how markdown would be rendered in the application.`,
            authorId: `${(i % 3) + 1}`, // Cycle through 3 different authors
            createdAt: new Date(Date.now() - i * 86400000).toISOString(), // Each post 1 day apart
            updatedAt: new Date(Date.now() - i * 86400000 + 3600000).toISOString(), // Updated 1 hour after creation
            likes: Math.floor(Math.random() * 100),
            categories: ["Education", "Teaching", "Korean"],
            commentCount: Math.floor(Math.random() * 10),
            bestComment:
              i % 2 === 0
                ? {
                    id: `comment-${i}-1`,
                    content: `This is a great post! I learned a lot about teaching methods.`,
                    authorId: `${((i + 1) % 3) + 1}`,
                    postId: `${i + 1}`,
                    createdAt: new Date(Date.now() - i * 86400000 + 7200000).toISOString(),
                    updatedAt: new Date(Date.now() - i * 86400000 + 7200000).toISOString(),
                    likes: Math.floor(Math.random() * 20),
                  }
                : undefined,
            latestComment: {
              id: `comment-${i}-2`,
              content: `Thanks for sharing these insights!`,
              authorId: `${((i + 2) % 3) + 1}`,
              postId: `${i + 1}`,
              createdAt: new Date(Date.now() - i * 86400000 + 14400000).toISOString(),
              updatedAt: new Date(Date.now() - i * 86400000 + 14400000).toISOString(),
              likes: Math.floor(Math.random() * 10),
            },
          }))

          resolve(postsData.map((post) => new Post(post)))
        }, 1000)
      }),
      "게시글 목록을 성공적으로 불러왔습니다.",
      "게시글 목록을 불러오는데 실패했습니다.",
    )
  }

  async getPostById(postId: string): ApiResponse<Post | null> {
    // Simulate API call with our global response format
    return handleApiResponse(
      new Promise<Post>((resolve, reject) => {
        setTimeout(() => {
          if (!postId) {
            reject(new Error("게시글 ID가 필요합니다."))
            return
          }

          // Mock post data
          const postData: PostSchema = {
            id: postId,
            title: `Post ${postId}: Educational Insights for Korean Teachers`,
            content: `# Main Heading for Post ${postId}\n\nThis is a sample post content with **markdown** support. It includes paragraphs, lists, and other formatting.\n\n## Subheading\n\n- Item 1\n- Item 2\n- Item 3\n\nThis content is meant to demonstrate how markdown would be rendered in the application.\n\n### Another Section\n\nLorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam euismod, nisl eget aliquam ultricies, nunc nisl aliquet nunc, quis aliquam nisl nunc eu nisl. Nullam euismod, nisl eget aliquam ultricies, nunc nisl aliquet nunc, quis aliquam nisl nunc eu nisl.`,
            authorId: `${(Number.parseInt(postId) % 3) + 1}`,
            createdAt: new Date(Date.now() - Number.parseInt(postId) * 86400000).toISOString(),
            updatedAt: new Date(Date.now() - Number.parseInt(postId) * 86400000 + 3600000).toISOString(),
            likes: Math.floor(Math.random() * 100),
            categories: ["Education", "Teaching", "Korean"],
            commentCount: Math.floor(Math.random() * 10),
            bestComment: {
              id: `comment-${postId}-1`,
              content: `This is a great post! I learned a lot about teaching methods.`,
              authorId: `${((Number.parseInt(postId) + 1) % 3) + 1}`,
              postId: postId,
              createdAt: new Date(Date.now() - Number.parseInt(postId) * 86400000 + 7200000).toISOString(),
              updatedAt: new Date(Date.now() - Number.parseInt(postId) * 86400000 + 7200000).toISOString(),
              likes: Math.floor(Math.random() * 20),
            },
            latestComment: {
              id: `comment-${postId}-2`,
              content: `Thanks for sharing these insights!`,
              authorId: `${((Number.parseInt(postId) + 2) % 3) + 1}`,
              postId: postId,
              createdAt: new Date(Date.now() - Number.parseInt(postId) * 86400000 + 14400000).toISOString(),
              updatedAt: new Date(Date.now() - Number.parseInt(postId) * 86400000 + 14400000).toISOString(),
              likes: Math.floor(Math.random() * 10),
            },
          }

          resolve(new Post(postData))
        }, 800)
      }),
      "게시글을 성공적으로 불러왔습니다.",
      "게시글을 불러오는데 실패했습니다.",
    )
  }

  async createPost(data: CreatePostData): ApiResponse<Post> {
    if (!authService.isAuthenticated()) {
      return createErrorResponse(STATUS.UNAUTHORIZED, "게시글을 작성하려면 로그인이 필요합니다.")
    }

    const currentUser = authService.getUser()
    if (!currentUser) {
      return createErrorResponse(STATUS.UNAUTHORIZED, "사용자 정보를 찾을 수 없습니다.")
    }

    // Simulate API call with our global response format
    return handleApiResponse(
      new Promise<Post>((resolve, reject) => {
        setTimeout(() => {
          if (!data.title.trim()) {
            reject(new Error("제목을 입력해주세요."))
            return
          }

          if (!data.content.trim()) {
            reject(new Error("내용을 입력해주세요."))
            return
          }

          // Mock new post data
          const newPostData: PostSchema = {
            id: `${Date.now()}`,
            title: data.title,
            content: data.content,
            authorId: currentUser.id,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            likes: 0,
            categories: data.categories,
            commentCount: 0,
          }

          resolve(new Post(newPostData))
        }, 1000)
      }),
      "게시글이 성공적으로 등록되었습니다.",
      "게시글 등록에 실패했습니다.",
    )
  }

  async updatePost(postId: string, data: UpdatePostData): ApiResponse<Post> {
    if (!authService.isAuthenticated()) {
      return createErrorResponse(STATUS.UNAUTHORIZED, "게시글을 수정하려면 로그인이 필요합니다.")
    }

    const currentUser = authService.getUser()
    if (!currentUser) {
      return createErrorResponse(STATUS.UNAUTHORIZED, "사용자 정보를 찾을 수 없습니다.")
    }

    // Simulate API call with our global response format
    return handleApiResponse(
      new Promise<Post>((resolve, reject) => {
        setTimeout(() => {
          if (!postId) {
            reject(new Error("게시글 ID가 필요합니다."))
            return
          }

          if (!data.title.trim()) {
            reject(new Error("제목을 입력해주세요."))
            return
          }

          if (!data.content.trim()) {
            reject(new Error("내용을 입력해주세요."))
            return
          }

          // Mock updated post data
          const updatedPostData: PostSchema = {
            id: postId,
            title: data.title,
            content: data.content,
            authorId: currentUser.id,
            createdAt: new Date(Date.now() - 86400000).toISOString(), // Created 1 day ago
            updatedAt: new Date().toISOString(), // Updated now
            likes: Math.floor(Math.random() * 10),
            categories: data.categories,
            commentCount: Math.floor(Math.random() * 5),
          }

          resolve(new Post(updatedPostData))
        }, 1000)
      }),
      "게시글이 성공적으로 수정되었습니다.",
      "게시글 수정에 실패했습니다.",
    )
  }

  async likePost(postId: string): ApiResponse<void> {
    if (!authService.isAuthenticated()) {
      return createErrorResponse(STATUS.UNAUTHORIZED, "좋아요를 누르려면 로그인이 필요합니다.")
    }

    // Simulate API call with our global response format
    return handleApiResponse(
      new Promise<void>((resolve, reject) => {
        setTimeout(() => {
          if (!postId) {
            reject(new Error("게시글 ID가 필요합니다."))
            return
          }

          // In a real app, this would update the backend
          console.log(`Liked post ${postId}`)
          resolve()
        }, 300)
      }),
      "게시글에 좋아요를 눌렀습니다.",
      "좋아요를 누르는데 실패했습니다.",
    )
  }

  async sharePost(postId: string): ApiResponse<string> {
    // Simulate API call with our global response format
    return handleApiResponse(
      new Promise<string>((resolve, reject) => {
        setTimeout(() => {
          if (!postId) {
            reject(new Error("게시글 ID가 필요합니다."))
            return
          }

          // Return a shareable link - in a real app, this might be a shortened URL
          const shareableLink = `${window.location.origin}/post/${postId}`
          resolve(shareableLink)
        }, 300)
      }),
      "게시글 공유 링크가 생성되었습니다.",
      "게시글 공유 링크 생성에 실패했습니다.",
    )
  }
}

// Create a singleton instance
const postService = new PostService()
export default postService
