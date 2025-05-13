import type { CommentSchema } from "@/schema/post-schema"

export class Comment {
  id: string
  content: string
  authorId: string
  postId: string
  createdAt: Date
  updatedAt: Date
  likes: number

  constructor(data: CommentSchema) {
    this.id = data.id
    this.content = data.content
    this.authorId = data.authorId
    this.postId = data.postId
    this.createdAt = new Date(data.createdAt)
    this.updatedAt = new Date(data.updatedAt)
    this.likes = data.likes
  }

  get formattedCreatedAt(): string {
    return this.createdAt.toLocaleDateString()
  }

  get formattedUpdatedAt(): string {
    return this.updatedAt.toLocaleDateString()
  }
}
