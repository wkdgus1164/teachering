"use client"

import { useState, useCallback } from "react"
import { useRouter } from "next/navigation"
import { useSupabase } from "@/infra/supabase/provider"
import { useToast } from "@/hooks/use-toast"
import { useSupabaseFetch } from "@/infra/supabase/client-fetch"
import { fetchLinkedAccounts, linkAccount, unlinkAccount } from "@/model/linked-account/linked-account-client"
import type { Provider, LinkedAccount } from "@/model/linked-account/linked-account-types"

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
    } finally {
      setIsLinking(false)
    }
  }

  const handleUnlinkAccount = async (accountId: string) => {
    // Prevent unlinking the last account
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

  // Get the count of linked accounts by provider
  const getProviderCounts = useCallback(() => {
    if (!linkedAccounts) return {}

    return linkedAccounts.reduce((acc: Record<string, number>, account: LinkedAccount) => {
      const provider = account.provider.toLowerCase()
      acc[provider] = (acc[provider] || 0) + 1
      return acc
    }, {})
  }, [linkedAccounts])

  return {
    linkedAccounts,
    loading,
    error,
    isLinking,
    isUnlinking,
    linkAccount: handleLinkAccount,
    unlinkAccount: handleUnlinkAccount,
    getProviderCounts,
  }
}
