import Link from "next/link"
import { Button } from "@/components/ui/button"
import { MainLayout } from "@/components/layouts/main-layout"

export default function NotFound() {
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
              <circle cx="12" cy="12" r="10" />
              <path d="m15 9-6 6" />
              <path d="m9 9 6 6" />
            </svg>
          </div>
          <h2 className="text-3xl font-bold">페이지를 찾을 수 없습니다</h2>
          <p className="text-muted-foreground">
            죄송합니다. 요청하신 페이지를 찾을 수 없습니다. URL을 확인하거나 홈페이지로 돌아가세요.
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
