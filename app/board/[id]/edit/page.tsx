import { notFound } from "next/navigation"
import { MainLayout } from "@/components/layouts/main-layout"
import { PostForm } from "@/components/board/post-form"
import { getPostById } from "@/model/post/post-service"

export default async function EditPostPage({ params }: { params: { id: string } }) {
  const post = await getPostById(params.id)

  if (!post) {
    notFound()
  }

  return (
    <MainLayout>
      <div className="container mx-auto py-6">
        <h1 className="mb-6 text-2xl font-bold">게시글 수정</h1>
        <PostForm post={post} />
      </div>
    </MainLayout>
  )
}
