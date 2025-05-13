import { createServerSupabase } from "@/infra/supabase/server"
import type { Post, PostDetail } from "./post-types"

export async function getPosts(page = 1, limit = 10): Promise<Post[]> {
  const supabase = createServerSupabase()
  const from = (page - 1) * limit
  const to = from + limit - 1

  const { data, error } = await supabase
    .from("posts")
    .select(`
      *,
      profiles:author_id (id, full_name, avatar_url)
    `)
    .order("created_at", { ascending: false })
    .range(from, to)

  if (error) {
    console.error("Error fetching posts:", error)
    return []
  }

  if (!data) return []

  // Get likes count for each post
  const postsWithLikes = await Promise.all(
    data.map(async (post) => {
      const { count: likeCount } = await supabase
        .from("likes")
        .select("*", { count: "exact", head: true })
        .eq("post_id", post.id)

      const { count: commentCount } = await supabase
        .from("comments")
        .select("*", { count: "exact", head: true })
        .eq("post_id", post.id)

      return {
        id: post.id,
        title: post.title,
        content: post.content,
        category: post.category,
        createdAt: post.created_at,
        updatedAt: post.updated_at,
        author: {
          id: post.profiles.id,
          fullName: post.profiles.full_name,
          avatarUrl: post.profiles.avatar_url,
        },
        likeCount: likeCount || 0,
        commentCount: commentCount || 0,
      }
    }),
  )

  return postsWithLikes
}

export async function getPostById(id: string): Promise<PostDetail | null> {
  const supabase = createServerSupabase()

  const { data: post, error } = await supabase
    .from("posts")
    .select(`
      *,
      profiles:author_id (id, full_name, avatar_url)
    `)
    .eq("id", id)
    .single()

  if (error) {
    console.error("Error fetching post:", error)
    return null
  }

  if (!post) return null

  // Get likes count
  const { count: likeCount } = await supabase
    .from("likes")
    .select("*", { count: "exact", head: true })
    .eq("post_id", post.id)

  // Get comments count
  const { count: commentCount } = await supabase
    .from("comments")
    .select("*", { count: "exact", head: true })
    .eq("post_id", post.id)

  // Check if current user liked the post
  const {
    data: { session },
  } = await supabase.auth.getSession()

  let isLikedByCurrentUser = false
  if (session) {
    const { data: like } = await supabase
      .from("likes")
      .select("id")
      .eq("post_id", post.id)
      .eq("user_id", session.user.id)
      .maybeSingle()

    isLikedByCurrentUser = !!like
  }

  return {
    id: post.id,
    title: post.title,
    content: post.content,
    category: post.category,
    createdAt: post.created_at,
    updatedAt: post.updated_at,
    author: {
      id: post.profiles.id,
      fullName: post.profiles.full_name,
      avatarUrl: post.profiles.avatar_url,
    },
    likeCount: likeCount || 0,
    commentCount: commentCount || 0,
    isLikedByCurrentUser,
  }
}

export async function getPostsByUserId(userId: string, page = 1, limit = 10): Promise<Post[]> {
  const supabase = createServerSupabase()
  const from = (page - 1) * limit
  const to = from + limit - 1

  const { data, error } = await supabase
    .from("posts")
    .select(`
      *,
      profiles:author_id (id, full_name, avatar_url)
    `)
    .eq("author_id", userId)
    .order("created_at", { ascending: false })
    .range(from, to)

  if (error) {
    console.error("Error fetching user posts:", error)
    return []
  }

  if (!data) return []

  // Get likes count for each post
  const postsWithLikes = await Promise.all(
    data.map(async (post) => {
      const { count: likeCount } = await supabase
        .from("likes")
        .select("*", { count: "exact", head: true })
        .eq("post_id", post.id)

      const { count: commentCount } = await supabase
        .from("comments")
        .select("*", { count: "exact", head: true })
        .eq("post_id", post.id)

      return {
        id: post.id,
        title: post.title,
        content: post.content,
        category: post.category,
        createdAt: post.created_at,
        updatedAt: post.updated_at,
        author: {
          id: post.profiles.id,
          fullName: post.profiles.full_name,
          avatarUrl: post.profiles.avatar_url,
        },
        likeCount: likeCount || 0,
        commentCount: commentCount || 0,
      }
    }),
  )

  return postsWithLikes
}
