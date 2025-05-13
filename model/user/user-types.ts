export interface User {
  id: string
  fullName: string | null
  avatarUrl: string | null
  school: string | null
  subject: string | null
  bio: string | null
  createdAt: string
}

export interface UserWithStats extends User {
  postCount: number
  commentCount: number
}
