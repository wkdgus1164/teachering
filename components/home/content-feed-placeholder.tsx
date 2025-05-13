"use client"

import Link from "next/link"
import { Heart, MessageSquare, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Avatar } from "@/components/ui/avatar"
import { useAuth } from "@/hooks/use-auth"
import { ShareButton } from "@/components/ui/share-button"

export function ContentFeedPlaceholder() {
  const { isAuthenticated } = useAuth()

  // Mock data for placeholder posts
  const placeholderPosts = [
    {
      id: "1",
      title: "효과적인 온라인 수업 전략: 학생 참여도를 높이는 방법",
      preview:
        "온라인 수업에서 학생들의 참여도를 높이는 것은 교사들에게 큰 도전입니다. 이 글에서는 학생들의 관심을 끌고 참여를 유도하는 효과적인 전략을 공유합니다.",
      author: {
        name: "김교사",
        image: "/diverse-professional-profiles.png",
      },
      likes: 42,
      comments: 15,
      categories: ["온라인 교육", "교수법"],
    },
    {
      id: "2",
      title: "학생 평가의 새로운 접근법: 형성평가와 총괄평가의 균형",
      preview:
        "학생 평가는 단순히 성적을 매기는 것 이상의 의미가 있습니다. 이 글에서는 형성평가와 총괄평가를 효과적으로 조합하여 학생들의 성장을 촉진하는 방법을 알아봅니다.",
      author: {
        name: "이선생",
        image: "/abstract-user-profile.png",
      },
      likes: 38,
      comments: 9,
      categories: ["학생 평가", "교육 방법론"],
    },
    {
      id: "3",
      title: "교실에서의 갈등 해결: 학생 간 분쟁 중재 기술",
      preview:
        "교실 내 갈등은 학습 환경에 부정적인 영향을 미칠 수 있습니다. 이 글에서는 교사가 학생 간 갈등을 효과적으로 중재하고 해결하는 방법을 소개합니다.",
      author: {
        name: "박교수",
        image: "/abstract-geometric-profile.png",
      },
      likes: 27,
      comments: 12,
      categories: ["학급 관리", "갈등 해결"],
    },
  ]

  return (
    <section className="py-16 bg-background">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-10">
          <div>
            <h2 className="text-3xl font-bold mb-2">인기 게시글</h2>
            <p className="text-muted-foreground">교사들이 공유하는 유용한 정보와 경험</p>
          </div>
          <Button variant="outline" asChild>
            <Link href={isAuthenticated ? "/feed" : "/register"} className="flex items-center">
              더 보기
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {placeholderPosts.map((post) => (
            <PlaceholderPostCard key={post.id} post={post} />
          ))}
        </div>

        <div className="mt-16 text-center">
          <h3 className="text-2xl font-semibold mb-4">지금 가입하고 교사 커뮤니티에 참여하세요</h3>
          <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
            전국의 교사들과 연결하여 교육 경험을 공유하고, 전문성을 개발하며, 함께 성장할 수 있는 기회를 놓치지 마세요.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" asChild>
              <Link href="/register">회원가입</Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="/login">로그인</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}

interface PlaceholderPostCardProps {
  post: {
    id: string
    title: string
    preview: string
    author: {
      name: string
      image: string
    }
    likes: number
    comments: number
    categories: string[]
  }
}

function PlaceholderPostCard({ post }: PlaceholderPostCardProps) {
  // Always link directly to the post detail page without authentication check
  const postLink = `/post/${post.id}`

  return (
    <Card className="h-full flex flex-col hover:shadow-md transition-shadow duration-200">
      <CardHeader className="pb-3">
        <div className="flex items-center space-x-3">
          <Avatar src={post.author.image} alt={post.author.name} />
          <div>
            <div className="font-medium">{post.author.name}</div>
            <div className="text-xs text-muted-foreground">교사</div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="flex-grow">
        <Link href={postLink} className="block group">
          <h3 className="text-xl font-semibold mb-2 group-hover:text-primary transition-colors">{post.title}</h3>
          <p className="text-muted-foreground line-clamp-3">{post.preview}</p>
        </Link>
        <div className="flex flex-wrap gap-2 mt-4">
          {post.categories.map((category) => (
            <span
              key={category}
              className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
            >
              {category}
            </span>
          ))}
        </div>
      </CardContent>
      <CardFooter className="border-t pt-4">
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="sm" className="flex items-center space-x-1 h-8 px-2">
              <Heart className="h-4 w-4" />
              <span>{post.likes}</span>
            </Button>
            <Button variant="ghost" size="sm" className="flex items-center space-x-1 h-8 px-2">
              <MessageSquare className="h-4 w-4" />
              <span>{post.comments}</span>
            </Button>
          </div>
          <ShareButton url={`${window.location.origin}/post/${post.id}`} title={post.title} size="sm" />
        </div>
      </CardFooter>
    </Card>
  )
}
