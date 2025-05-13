export interface LinkedAccount {
  id: string
  provider: string
  providerEmail: string | null
  providerUsername: string | null
  providerAvatar: string | null
  createdAt: string
  verified?: boolean
}

export type Provider = "google" | "facebook" | "kakao" | "twitter" | "github" | "naver" | "line"

export interface ProviderInfo {
  id: Provider
  name: string
  icon: string
  color: string
}
