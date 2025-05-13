"use client"

import type React from "react"

import { useState, type FormEvent } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { MarkdownEditor } from "@/components/ui/markdown-editor"
import { useApiToast } from "@/hooks/use-api-toast"
import postService from "@/infra/post-service"
import { STATUS } from "@/infra/api-response"

interface PostFormProps {
  initialData?: {
    id?: string
    title: string
    content: string
    categories: string[]
  }
  isEditing?: boolean
}

export function PostForm({ initialData, isEditing = false }: PostFormProps = {}) {
  const [title, setTitle] = useState(initialData?.title || "")
  const [content, setContent] = useState(initialData?.content || "")
  const [categories, setCategories] = useState<string[]>(initialData?.categories || [])
  const [categoryInput, setCategoryInput] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const router = useRouter()
  const { toastResponse } = useApiToast()

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()

    if (!title.trim()) {
      setError("제목을 입력해주세요.")
      return
    }

    if (!content.trim()) {
      setError("내용을 입력해주세요.")
      return
    }

    setIsSubmitting(true)
    setError(null)

    try {
      // In a real app, this would call an API to create/update a post
      // For now, we'll simulate it with a timeout
      const response = isEditing
        ? await postService.updatePost(initialData?.id || "", { title, content, categories })
        : await postService.createPost({ title, content, categories })

      toastResponse(response)

      if (response.status === STATUS.SUCCESS) {
        // Navigate to the post detail page or feed
        router.push(isEditing ? `/post/${initialData?.id}` : "/feed")
      } else {
        setError(response.message)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "게시글 저장에 실패했습니다.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleAddCategory = () => {
    const trimmedCategory = categoryInput.trim()
    if (trimmedCategory && !categories.includes(trimmedCategory)) {
      setCategories([...categories, trimmedCategory])
      setCategoryInput("")
    }
  }

  const handleRemoveCategory = (category: string) => {
    setCategories(categories.filter((c) => c !== category))
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault()
      handleAddCategory()
    }
  }

  return (
    <Card className="p-6">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <label htmlFor="title" className="text-sm font-medium">
            제목
          </label>
          <Input
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="게시글 제목을 입력하세요"
            className="text-lg"
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="content" className="text-sm font-medium">
            내용
          </label>
          <MarkdownEditor
            value={content}
            onChange={setContent}
            placeholder="게시글 내용을 작성하세요. 마크다운 형식을 지원합니다."
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">카테고리</label>
          <div className="flex flex-wrap gap-2 mb-2">
            {categories.map((category) => (
              <span
                key={category}
                className="inline-flex items-center rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-semibold text-primary"
              >
                {category}
                <button
                  type="button"
                  onClick={() => handleRemoveCategory(category)}
                  className="ml-1 text-primary hover:text-primary/80"
                >
                  ×
                </button>
              </span>
            ))}
          </div>
          <div className="flex gap-2">
            <Input
              value={categoryInput}
              onChange={(e) => setCategoryInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="카테고리 추가"
              className="flex-1"
            />
            <Button type="button" onClick={handleAddCategory} variant="outline">
              추가
            </Button>
          </div>
        </div>

        {error && <div className="p-3 bg-red-50 text-red-600 rounded-md text-sm">{error}</div>}

        <div className="flex justify-end gap-3">
          <Button type="button" variant="outline" onClick={() => router.back()} disabled={isSubmitting}>
            취소
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "저장 중..." : isEditing ? "수정하기" : "게시하기"}
          </Button>
        </div>
      </form>
    </Card>
  )
}
