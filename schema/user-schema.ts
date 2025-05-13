export interface UserSchema {
  id: string
  email: string
  username: string
  profileImage: string
  bio?: string
  createdAt: string
  connectedAccounts: {
    provider: "google" | "github" | "kakao"
    connected: boolean
  }[]
}
