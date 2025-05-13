"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/hooks/use-auth"
import { PopulateSampleData } from "@/components/admin/populate-sample-data"

export function WelcomeBanner() {
  const { user } = useAuth()
  const [dismissed, setDismissed] = useState(false)

  if (dismissed) return null

  return (
    <div className="bg-primary/10 border-b">
      <div className="container py-6 md:py-10">
        <div className="flex flex-col items-center text-center space-y-4">
          <h1 className="text-2xl md:text-3xl font-bold">한국 공교육 교사들을 위한 커뮤니티에 오신 것을 환영합니다</h1>
          <p className="text-muted-foreground max-w-2xl">
            Teachering은 한국 공교육 교사들이 서로 소통하고 정보를 공유할 수 있는 플랫폼입니다. 교육 자료, 수업
            아이디어, 교육 정책 등 다양한 주제로 대화를 나눠보세요.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            {!user ? (
              <>
                <Button asChild size="lg">
                  <Link href="/auth/sign-in">로그인</Link>
                </Button>
                <Button asChild variant="outline" size="lg">
                  <Link href="/auth/sign-up">회원가입</Link>
                </Button>
              </>
            ) : (
              <>
                <Button asChild size="lg">
                  <Link href="/board">게시판 둘러보기</Link>
                </Button>
                <Button asChild variant="outline" size="lg">
                  <Link href="/board/create">게시글 작성하기</Link>
                </Button>
                <PopulateSampleData />
              </>
            )}
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setDismissed(true)}
            className="text-xs text-muted-foreground mt-4"
          >
            닫기
          </Button>
        </div>
      </div>
    </div>
  )
}
