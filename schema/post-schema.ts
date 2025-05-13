export interface PostSchema {
  id: string
  title: string
  content: string
  authorId: string
  createdAt: string
  updatedAt: string
  likes: number
  categories: string[]
  commentCount: number
  bestComment?: CommentSchema
  latestComment?: CommentSchema
}

export interface CommentSchema {
  id: string
  content: string
  authorId: string
  postId: string
  createdAt: string
  updatedAt: string
  likes: number
}
