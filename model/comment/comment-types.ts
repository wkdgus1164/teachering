export interface Comment {
  id: string
  content: string
  createdAt: string
  author: {
    id: string
    fullName: string | null
    avatarUrl: string | null
  }
  likeCount: number
  isLikedByCurrentUser: boolean
}
