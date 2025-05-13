"use client"

import { Avatar } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import type { User } from "@/model/user-model"
import authService from "@/infra/auth-service"

interface ProfileHeaderProps {
  user: User
}

export function ProfileHeader({ user }: ProfileHeaderProps) {
  const currentUser = authService.getUser()
  const isCurrentUser = currentUser?.id === user.id

  return (
    <div className="relative">
      <div className="h-32 bg-gradient-to-r from-primary/20 to-primary/40 rounded-t-lg"></div>
      <div className="absolute -bottom-16 left-6">
        <Avatar src={user.profileImage} alt={user.username} size="lg" className="border-4 border-background" />
      </div>
      <div className="absolute bottom-4 right-6">{isCurrentUser && <Button size="sm">Edit Profile</Button>}</div>
    </div>
  )
}
