import type { UserSchema } from "@/schema/user-schema"

export class User {
  id: string
  email: string
  username: string
  profileImage: string
  bio: string
  createdAt: Date
  connectedAccounts: {
    provider: "google" | "github" | "kakao"
    connected: boolean
  }[]

  constructor(data: UserSchema) {
    this.id = data.id
    this.email = data.email
    this.username = data.username
    this.profileImage = data.profileImage
    this.bio = data.bio || ""
    this.createdAt = new Date(data.createdAt)
    this.connectedAccounts = data.connectedAccounts
  }

  get formattedCreatedAt(): string {
    return this.createdAt.toLocaleDateString()
  }

  hasConnectedAccount(provider: "google" | "github" | "kakao"): boolean {
    return this.connectedAccounts.some((account) => account.provider === provider && account.connected)
  }
}
