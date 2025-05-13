"use client"

import Link from "next/link"
import { Pencil } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/hooks/use-auth"
import { useProfile } from "@/hooks/use-profile"
import type { UserWithStats } from "@/model/user/user-types"

interface ProfileHeaderProps {
  user: UserWithStats
}

export function ProfileHeader({ user }: ProfileHeaderProps) {
  const { user: currentUser } = useAuth()
  const { populateSampleData, isLoading } = useProfile()

  const isCurrentUser = currentUser?.id === user.id

  return (
    <div className="bg-muted/40 border-b">
      <div className="container py-8">
        <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
          <Avatar className="h-24 w-24 md:h-32 md:w-32">
            <AvatarImage src={user.avatarUrl || ""} alt={user.fullName || ""} />
            <AvatarFallback className="text-2xl">{user.fullName?.charAt(0) || "U"}</AvatarFallback>
          </Avatar>

          <div className="flex-1 text-center md:text-left">
            <div className="flex flex-col md:flex-row md:items-center gap-4 mb-4">
              <h1 className="text-2xl font-bold">{user.fullName}</h1>
              {isCurrentUser && (
                <Button asChild variant="outline" size="sm">
                  <Link href="/profile/edit">
                    <Pencil className="mr-2 h-4 w-4" />
                    프로필 수정
                  </Link>
                </Button>
              )}
            </div>

            <div className="flex flex-wrap justify-center md:justify-start gap-x-6 gap-y-2 mb-4">
              {user.school && (
                <div className="text-sm">
                  <span className="text-muted-foreground">학교:</span> <span>{user.school}</span>
                </div>
              )}
              {user.subject && (
                <div className="text-sm">
                  <span className="text-muted-foreground">과목:</span> <span>{user.subject}</span>
                </div>
              )}
              <div className="text-sm">
                <span className="text-muted-foreground">가입일:</span>{" "}
                <span>{new Date(user.createdAt).toLocaleDateString("ko-KR")}</span>
              </div>
            </div>

            <div className="flex justify-center md:justify-start gap-6">
              <div className="text-center">
                <div className="font-bold">{user.postCount}</div>
                <div className="text-sm text-muted-foreground">게시글</div>
              </div>
              <div className="text-center">
                <div className="font-bold">{user.commentCount}</div>
                <div className="text-sm text-muted-foreground">댓글</div>
              </div>
            </div>

            {user.bio && <div className="mt-4 text-sm">{user.bio}</div>}
          </div>
        </div>
      </div>
    </div>
  )
}
