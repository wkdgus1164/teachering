"use client"

import { MainLayout } from "@/components/layouts/main-layout"
import { BoardHeader } from "@/components/board/board-header"
import { PostList } from "@/components/board/post-list"

export default function BoardPage() {
  return (
    <MainLayout>
      <div className="container mx-auto py-6">
        <BoardHeader />
        <PostList />
      </div>
    </MainLayout>
  )
}
