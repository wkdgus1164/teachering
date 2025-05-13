import { MainLayout } from "@/components/layouts/main-layout"
import { PostForm } from "@/components/board/post-form"

export default function CreatePostPage() {
  return (
    <MainLayout>
      <div className="container mx-auto py-6">
        <h1 className="mb-6 text-2xl font-bold">새 게시글 작성</h1>
        <PostForm />
      </div>
    </MainLayout>
  )
}
