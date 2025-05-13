"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useSupabase } from "@/infra/supabase/provider"
import { useToast } from "@/hooks/use-toast"
import { useSupabaseFetch } from "@/infra/supabase/client-fetch"
import { fetchLinkedAccounts, linkAccount, unlinkAccount } from "@/model/linked-account/linked-account-client"
import type { Provider } from "@/model/linked-account/linked-account-types"

export function useLinkedAccounts() {
  const { supabase } = useSupabase()
  const router = useRouter()
  const { toast } = useToast()
  const [isLinking, setIsLinking] = useState(false)
  const [isUnlinking, setIsUnlinking] = useState<string | null>(null)

  const { data: linkedAccounts, loading, error, mutate } = useSupabaseFetch(fetchLinkedAccounts)

  const handleLinkAccount = async (provider: Provider) => {
    setIsLinking(true)

    try {
      // Check if user is already logged in
      const { data: userData } = await supabase.auth.getUser()

      if (!userData?.user) {
        toast({
          title: "로그인이 필요합니다",
          description: "계정을 연결하려면 먼저 로그인해주세요.",
          variant: "destructive",
        })
        router.push("/auth/sign-in")
        return
      }

      // Check if this provider is already linked
      const existingProvider = linkedAccounts?.find(
        (account) => account.provider.toLowerCase() === provider.toLowerCase(),
      )

      if (existingProvider) {
        toast({
          title: "이미 연결된 계정",
          description: `${provider} 계정은 이미 연결되어 있습니다.`,
          variant: "default",
        })
        setIsLinking(false)
        return
      }

      const { error } = await linkAccount(supabase, provider)

      if (error) throw error

      // The OAuth flow will redirect the user, so we don't need to do anything else here
    } catch (error) {
      console.error(`Error linking ${provider} account:`, error)
      toast({
        title: "계정 연결 실패",
        description: "소셜 계정 연결 중 오류가 발생했습니다. 다시 시도해주세요.",
        variant: "destructive",
      })
      setIsLinking(false)
    }
  }

  const handleUnlinkAccount = async (accountId: string) => {
    // Prevent unlinking if it's the last account
    if (linkedAccounts && linkedAccounts.length <= 1) {
      toast({
        title: "계정 연결 해제 불가",
        description: "최소 하나의 계정은 연결되어 있어야 합니다. 다른 계정을 먼저 연결한 후 시도해주세요.",
        variant: "destructive",
      })
      return
    }

    setIsUnlinking(accountId)

    try {
      const { error } = await unlinkAccount(supabase, accountId)

      if (error) throw error

      toast({
        title: "계정 연결 해제 완료",
        description: "소셜 계정 연결이 해제되었습니다.",
      })

      // Refresh the linked accounts list
      mutate()
    } catch (error) {
      console.error("Error unlinking account:", error)
      toast({
        title: "계정 연결 해제 실패",
        description: "소셜 계정 연결 해제 중 오류가 발생했습니다. 다시 시도해주세요.",
        variant: "destructive",
      })
    } finally {
      setIsUnlinking(null)
    }
  }

  return {
    linkedAccounts,
    loading,
    error,
    isLinking,
    isUnlinking,
    linkAccount: handleLinkAccount,
    unlinkAccount: handleUnlinkAccount,
    refreshAccounts: mutate,
  }
}
