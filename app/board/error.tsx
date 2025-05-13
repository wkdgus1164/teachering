"use client"

import { useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { MainLayout } from "@/components/layouts/main-layout"
import { logClientError } from "@/infra/error/client-logger"

export default function BoardError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log the error to our error logging service
    logClientError({
      errorMessage: error.message,
      errorStack: error.stack,
      errorType: error.name,
      component: "BoardError",
      severity: "error",
    })
  }, [error])

  return (
    <MainLayout>
      <div className="container flex min-h-[70vh] flex-col items-center justify-center text-center">
        <div className="mx-auto flex max-w-[500px] flex-col items-center justify-center space-y-4">
          <div className="rounded-full bg-muted p-6">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-10 w-10 text-muted-foreground"
            >
              <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" />
              <path d="M12 9v4" />
              <path d="M12 17h.01" />
            </svg>
          </div>
          <h2 className="text-3xl font-bold">게시판 오류</h2>
          <p className="text-muted-foreground">
            죄송합니다. 게시판을 로드하는 중에 오류가 발생했습니다. 다시 시도하거나 홈페이지로 돌아가세요.
          </p>
          <div className="flex gap-2">
            <Button onClick={() => reset()} variant="outline">
              다시 시도
            </Button>
            <Button asChild>
              <Link href="/">홈으로 돌아가기</Link>
            </Button>
          </div>
        </div>
      </div>
    </MainLayout>
  )
}
