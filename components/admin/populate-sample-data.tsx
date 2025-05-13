"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { useSupabase } from "@/infra/supabase/provider"
import { useToast } from "@/hooks/use-toast"
import { useAuth } from "@/hooks/use-auth"

export function PopulateSampleData() {
  const { supabase } = useSupabase()
  const { toast } = useToast()
  const { user } = useAuth()
  const [isLoading, setIsLoading] = useState(false)

  const handlePopulateData = async () => {
    if (!user) {
      toast({
        title: "로그인이 필요합니다",
        description: "샘플 데이터를 생성하려면 로그인해주세요",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)

    try {
      const { error } = await supabase.rpc("populate_sample_data", { user_id: user.id })

      if (error) throw error

      toast({
        title: "샘플 데이터가 생성되었습니다",
        description: "새로고침하여 변경사항을 확인하세요",
      })
    } catch (error) {
      console.error(error)
      toast({
        title: "오류가 발생했습니다",
        description: "잠시 후 다시 시도해주세요",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Button onClick={handlePopulateData} disabled={isLoading} variant="outline" size="sm">
      {isLoading ? "생성 중..." : "샘플 데이터 생성"}
    </Button>
  )
}
