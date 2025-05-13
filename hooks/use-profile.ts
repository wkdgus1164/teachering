"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useSupabase } from "@/infra/supabase/provider"
import { useToast } from "@/hooks/use-toast"
import type { ProfileFormValues } from "@/schema/zod-schemas"

export function useProfile() {
  const { supabase } = useSupabase()
  const router = useRouter()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)

  const updateProfile = async (values: ProfileFormValues) => {
    setIsLoading(true)

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) {
        toast({
          title: "로그인이 필요합니다",
          description: "프로필을 수정하려면 로그인해주세요",
          variant: "destructive",
        })
        router.push("/auth/sign-in")
        return
      }

      const { error } = await supabase
        .from("profiles")
        .update({
          full_name: values.fullName,
          school: values.school,
          subject: values.subject,
          bio: values.bio,
          avatar_url: values.avatarUrl,
          updated_at: new Date().toISOString(),
        })
        .eq("id", user.id)

      if (error) throw error

      toast({
        title: "프로필이 수정되었습니다",
      })

      router.refresh()
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

  const uploadAvatar = async (file: File) => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) {
        toast({
          title: "로그인이 필요합니다",
          description: "프로필 이미지를 업로드하려면 로그인해주세요",
          variant: "destructive",
        })
        router.push("/auth/sign-in")
        return null
      }

      const fileExt = file.name.split(".").pop()
      const fileName = `${user.id}-${Math.random()}.${fileExt}`
      const filePath = `avatars/${fileName}`

      const { error: uploadError } = await supabase.storage.from("avatars").upload(filePath, file)

      if (uploadError) throw uploadError

      const { data } = supabase.storage.from("avatars").getPublicUrl(filePath)

      return data.publicUrl
    } catch (error) {
      console.error(error)
      toast({
        title: "이미지 업로드 실패",
        description: "잠시 후 다시 시도해주세요",
        variant: "destructive",
      })
      return null
    }
  }

  // Function to populate sample data for testing
  const populateSampleData = async () => {
    setIsLoading(true)

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) {
        toast({
          title: "로그인이 필요합니다",
          description: "샘플 데이터를 생성하려면 로그인해주세요",
          variant: "destructive",
        })
        router.push("/auth/sign-in")
        return
      }

      const { error } = await supabase.rpc("populate_sample_data", {
        user_id: user.id,
      })

      if (error) throw error

      toast({
        title: "샘플 데이터가 생성되었습니다",
        description: "새로고침하여 확인해보세요",
      })

      router.refresh()
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

  return {
    updateProfile,
    uploadAvatar,
    populateSampleData,
    isLoading,
  }
}
