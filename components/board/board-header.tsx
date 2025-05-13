"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { useAuth } from "@/hooks/use-auth"

export function BoardHeader() {
  const { user } = useAuth()

  return (
    <div className="mb-8 space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">게시판</h1>
        {user && (
          <Button asChild>
            <Link href="/board/create">게시글 작성</Link>
          </Button>
        )}
      </div>

      <div className="flex flex-col gap-4 md:flex-row md:items-center">
        <div className="flex-1">
          <Input placeholder="게시글 검색..." />
        </div>
        <div className="flex items-center gap-2">
          <Select defaultValue="latest">
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="정렬 기준" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="latest">최신순</SelectItem>
              <SelectItem value="popular">인기순</SelectItem>
              <SelectItem value="comments">댓글순</SelectItem>
            </SelectContent>
          </Select>
          <Select defaultValue="all">
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="카테고리" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">전체</SelectItem>
              <SelectItem value="notice">공지사항</SelectItem>
              <SelectItem value="question">질문</SelectItem>
              <SelectItem value="share">자료공유</SelectItem>
              <SelectItem value="discussion">토론</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  )
}
