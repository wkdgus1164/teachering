export interface Post {
  id: string
  title: string
  content: string
  category: string | null
  createdAt: string
  updatedAt: string
  author: {
    id: string
    fullName: string | null
    avatarUrl: string | null
  }
  likeCount: number
  commentCount: number
}

export interface PostDetail extends Post {
  isLikedByCurrentUser: boolean
}
