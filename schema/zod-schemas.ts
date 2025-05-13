import { z } from "zod"

export const profileSchema = z.object({
  fullName: z.string().min(2, "이름은 2글자 이상이어야 합니다"),
  school: z.string().optional(),
  subject: z.string().optional(),
  bio: z.string().max(500, "자기소개는 500자 이내로 작성해주세요").optional(),
  avatarUrl: z.string().url().optional().nullable(),
})

export const postSchema = z.object({
  title: z.string().min(2, "제목은 2글자 이상이어야 합니다").max(100, "제목은 100자 이내로 작성해주세요"),
  content: z.string().min(10, "내용은 10글자 이상이어야 합니다"),
  category: z.string().optional(),
})

export const commentSchema = z.object({
  content: z.string().min(1, "댓글 내용을 입력해주세요").max(500, "댓글은 500자 이내로 작성해주세요"),
})

export type ProfileFormValues = z.infer<typeof profileSchema>
export type PostFormValues = z.infer<typeof postSchema>
export type CommentFormValues = z.infer<typeof commentSchema>
