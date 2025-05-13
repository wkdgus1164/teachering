"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { EmptyFeed } from "@/components/feed/empty-feed"
import { useAuth } from "@/hooks/use-auth"
import { PostList } from "@/components/board/post-list"

export function Feed() {
  const { user } = useAuth()
  const [activeTab, setActiveTab] = useState("all")

  return (
    <div className="container py-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">피드</h2>
        {user && (
          <Button asChild>
            <Link href="/board/create">게시글 작성</Link>
          </Button>
        )}
      </div>

      <Tabs defaultValue="all" className="w-full" onValueChange={setActiveTab}>
        <TabsList className="mb-6">
          <TabsTrigger value="all">전체</TabsTrigger>
          <TabsTrigger value="following">팔로잉</TabsTrigger>
          <TabsTrigger value="popular">인기</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          <PostList />
        </TabsContent>

        <TabsContent value="following" className="space-y-4">
          <EmptyFeed
            title="팔로우한 사용자의 게시글이 없습니다"
            description="다른 교사들을 팔로우하고 소식을 받아보세요!"
            actionLabel="교사 찾아보기"
            actionHref="/explore"
          />
        </TabsContent>

        <TabsContent value="popular" className="space-y-4">
          <EmptyFeed
            title="인기 게시글이 없습니다"
            description="게시글이 더 작성되면 인기 게시글을 볼 수 있습니다"
            actionLabel="게시판으로 이동"
            actionHref="/board"
          />
        </TabsContent>
      </Tabs>
    </div>
  )
}
