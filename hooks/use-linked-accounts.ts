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
  }
}
