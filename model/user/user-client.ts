"use client"

import type { User, UserWithStats } from "./user-types"

export async function fetchCurrentUser(supabase: any): Promise<User | null> {
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return null

  const { data } = await supabase.from("profiles").select("*").eq("id", user.id).single()

  if (!data) return null

  return {
    id: data.id,
    fullName: data.full_name,
    avatarUrl: data.avatar_url,
    school: data.school,
    subject: data.subject,
    bio: data.bio,
    createdAt: data.created_at,
  }
}

export async function fetchUserById(supabase: any, id: string): Promise<UserWithStats | null> {
  const { data: profile } = await supabase.from("profiles").select("*").eq("id", id).single()

  if (!profile) return null

  // Get post count
  const { count: postCount } = await supabase
    .from("posts")
    .select("*", { count: "exact", head: true })
    .eq("author_id", id)

  // Get comment count
  const { count: commentCount } = await supabase
    .from("comments")
    .select("*", { count: "exact", head: true })
    .eq("author_id", id)

  return {
    id: profile.id,
    fullName: profile.full_name,
    avatarUrl: profile.avatar_url,
    school: profile.school,
    subject: profile.subject,
    bio: profile.bio,
    createdAt: profile.created_at,
    postCount: postCount || 0,
    commentCount: commentCount || 0,
  }
}

export async function populateSampleData(supabase: any): Promise<boolean> {
  try {
    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) return false

    const { error } = await supabase.rpc("populate_sample_data", {
      user_id: user.id,
    })

    if (error) {
      console.error("Error populating sample data:", error)
      return false
    }

    return true
  } catch (error) {
    console.error("Error populating sample data:", error)
    return false
  }
}
