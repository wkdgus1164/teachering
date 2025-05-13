"use client"

import type { Comment } from "./comment-types"

export async function fetchCommentsByPostId(supabase: any, postId: string): Promise<Comment[]> {
  const { data, error } = await supabase
    .from("comments")
    .select(`
      *,
      profiles:author_id (id, full_name, avatar_url)
    `)
    .eq("post_id", postId)
    .order("created_at", { ascending: true })

  if (error) {
    console.error("Error fetching comments:", error)
    return []
  }

  if (!data) return []

  // Check if current user liked each comment
  const {
    data: { user },
  } = await supabase.auth.getUser()
  const currentUserId = user?.id

  const commentsWithLikes = await Promise.all(
    data.map(async (comment: any) => {
      const { count: likeCount } = await supabase
        .from("likes")
        .select("*", { count: "exact", head: true })
        .eq("comment_id", comment.id)

      let isLikedByCurrentUser = false
      if (currentUserId) {
        const { data: like } = await supabase
          .from("likes")
          .select("id")
          .eq("comment_id", comment.id)
          .eq("user_id", currentUserId)
          .maybeSingle()

        isLikedByCurrentUser = !!like
      }

      return {
        id: comment.id,
        content: comment.content,
        createdAt: comment.created_at,
        author: {
          id: comment.profiles.id,
          fullName: comment.profiles.full_name,
          avatarUrl: comment.profiles.avatar_url,
        },
        likeCount: likeCount || 0,
        isLikedByCurrentUser,
      }
    }),
  )

  return commentsWithLikes
}

export async function fetchCommentsByUserId(
  supabase: any,
  userId: string,
  page = 1,
  limit = 10,
): Promise<(Comment & { postTitle: string; postId: string })[]> {
  const from = (page - 1) * limit
  const to = from + limit - 1

  const { data, error } = await supabase
    .from("comments")
    .select(`
      *,
      profiles:author_id (id, full_name, avatar_url),
      posts:post_id (id, title)
    `)
    .eq("author_id", userId)
    .order("created_at", { ascending: false })
    .range(from, to)

  if (error) {
    console.error("Error fetching user comments:", error)
    return []
  }

  if (!data) return []

  // Get likes count for each comment
  const commentsWithLikes = await Promise.all(
    data.map(async (comment: any) => {
      const { count: likeCount } = await supabase
        .from("likes")
        .select("*", { count: "exact", head: true })
        .eq("comment_id", comment.id)

      // Check if current user liked the comment
      const {
        data: { user },
      } = await supabase.auth.getUser()

      let isLikedByCurrentUser = false
      if (user) {
        const { data: like } = await supabase
          .from("likes")
          .select("id")
          .eq("comment_id", comment.id)
          .eq("user_id", user.id)
          .maybeSingle()

        isLikedByCurrentUser = !!like
      }

      return {
        id: comment.id,
        content: comment.content,
        createdAt: comment.created_at,
        author: {
          id: comment.profiles.id,
          fullName: comment.profiles.full_name,
          avatarUrl: comment.profiles.avatar_url,
        },
        likeCount: likeCount || 0,
        isLikedByCurrentUser,
        postTitle: comment.posts.title,
        postId: comment.posts.id,
      }
    }),
  )

  return commentsWithLikes
}
