"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { MainLayout } from "@/components/layouts/main-layout"
import { ProfileHeader } from "@/components/profile/profile-header"
import { ProfileTabs } from "@/components/profile/profile-tabs"
import { ProfileSkeleton } from "@/components/skeletons/profile-skeleton"
import { useSupabase } from "@/infra/supabase/provider"
import { fetchUserById } from "@/model/user/user-client"
import type { UserWithStats } from "@/model/user/user-types"

export default function ProfilePage() {
  const params = useParams()
  const userId = params?.id as string
  const { supabase } = useSupabase()
  const router = useRouter()
  const [user, setUser] = useState<UserWithStats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!userId) return

    const fetchUser = async () => {
      setLoading(true)
      try {
        const userData = await fetchUserById(supabase, userId)
        if (!userData) {
          router.push("/404")
          return
        }
        setUser(userData)
      } catch (error) {
        console.error("Error fetching user:", error)
        router.push("/404")
      } finally {
        setLoading(false)
      }
    }

    fetchUser()
  }, [userId, supabase, router])

  if (loading) {
    return (
      <MainLayout>
        <ProfileSkeleton />
      </MainLayout>
    )
  }

  if (!user) {
    return null // This will be handled by the loading state or redirect
  }

  return (
    <MainLayout>
      <ProfileHeader user={user} />
      <ProfileTabs userId={user.id} />
    </MainLayout>
  )
}
