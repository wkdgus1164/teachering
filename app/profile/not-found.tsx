import Link from "next/link"
import { Button } from "@/components/ui/button"
import { MainLayout } from "@/components/layouts/main-layout"

export default function ProfileNotFound() {
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
              <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
          </div>
          <h2 className="text-3xl font-bold">프로필을 찾을 수 없습니다</h2>
          <p className="text-muted-foreground">
            죄송합니다. 요청하신 사용자 프로필을 찾을 수 없습니다. 사용자가 존재하지 않거나 URL이 잘못되었을 수
            있습니다.
          </p>
          <div className="flex gap-2">
            <Button asChild variant="outline">
              <Link href="/board">게시판으로 이동</Link>
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
