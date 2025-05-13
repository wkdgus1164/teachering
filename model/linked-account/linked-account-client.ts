"use client"

import type { LinkedAccount, Provider } from "./linked-account-types"

export async function fetchLinkedAccounts(supabase: any): Promise<LinkedAccount[]> {
  const { data, error } = await supabase.from("linked_accounts").select("*").order("created_at", { ascending: false })

  if (error) {
    console.error("Error fetching linked accounts:", error)
    return []
  }

  if (!data) return []

  return data.map((account: any) => ({
    id: account.id,
    provider: account.provider,
    providerEmail: account.provider_email,
    providerUsername: account.provider_username,
    providerAvatar: account.provider_avatar,
    createdAt: account.created_at,
    // Consider an account verified if it has an email or username
    verified: Boolean(account.provider_email || account.provider_username),
  }))
}

export async function linkAccount(
  supabase: any,
  provider: Provider,
  redirectTo = `${window.location.origin}/account/callback?next=${encodeURIComponent("/profile/edit?tab=linked-accounts")}`,
): Promise<{ error: Error | null }> {
  try {
    const { error } = await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo,
        scopes: "email profile",
      },
    })

    if (error) throw error

    return { error: null }
  } catch (error) {
    console.error(`Error linking ${provider} account:`, error)
    return { error: error instanceof Error ? error : new Error(String(error)) }
  }
}

export async function unlinkAccount(supabase: any, accountId: string): Promise<{ error: Error | null }> {
  try {
    const { error } = await supabase.from("linked_accounts").delete().eq("id", accountId)

    if (error) throw error

    return { error: null }
  } catch (error) {
    console.error("Error unlinking account:", error)
    return { error: error instanceof Error ? error : new Error(String(error)) }
  }
}

export const PROVIDERS: Record<Provider, { name: string; icon: string; color: string }> = {
  google: {
    name: "Google",
    icon: "google",
    color: "#4285F4",
  },
  facebook: {
    name: "Facebook",
    icon: "facebook",
    color: "#1877F2",
  },
  kakao: {
    name: "Kakao",
    icon: "message-circle",
    color: "#FEE500",
  },
  twitter: {
    name: "Twitter",
    icon: "twitter",
    color: "#1DA1F2",
  },
  github: {
    name: "GitHub",
    icon: "github",
    color: "#333333",
  },
  naver: {
    name: "Naver",
    icon: "globe",
    color: "#03C75A",
  },
  line: {
    name: "Line",
    icon: "message-square",
    color: "#00C300",
  },
}
