import type { PostSchema } from "@/schema/post-schema"
import { Comment } from "./comment-model"

export class Post {
  id: string
  title: string
  content: string
  authorId: string
  createdAt: Date
  updatedAt: Date
  likes: number
  categories: string[]
  commentCount: number
  bestComment?: Comment
  latestComment?: Comment

  constructor(data: PostSchema) {
    this.id = data.id
    this.title = data.title
    this.content = data.content
    this.authorId = data.authorId
    this.createdAt = new Date(data.createdAt)
    this.updatedAt = new Date(data.updatedAt)
    this.likes = data.likes
    this.categories = data.categories
    this.commentCount = data.commentCount

    if (data.bestComment) {
      this.bestComment = new Comment(data.bestComment)
    }

    if (data.latestComment) {
      this.latestComment = new Comment(data.latestComment)
    }
  }

  get formattedCreatedAt(): string {
    return this.createdAt.toLocaleDateString()
  }

  get formattedUpdatedAt(): string {
    return this.updatedAt.toLocaleDateString()
  }

  get contentPreview(): string {
    // Limit content to approximately two lines
    const maxLength = 150
    if (this.content.length <= maxLength) return this.content
    return `${this.content.substring(0, maxLength)}...`
  }
}
