"use client"

import { Calendar, Mail } from "lucide-react"
import type { User } from "@/model/user-model"

interface ProfileDetailsProps {
  user: User
}

export function ProfileDetails({ user }: ProfileDetailsProps) {
  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h1 className="text-2xl font-bold">{user.username}</h1>
        <div className="flex items-center text-muted-foreground">
          <Mail className="mr-1 h-4 w-4" />
          <span>{user.email}</span>
        </div>
        <div className="flex items-center text-muted-foreground">
          <Calendar className="mr-1 h-4 w-4" />
          <span>Joined {user.formattedCreatedAt}</span>
        </div>
      </div>

      {user.bio && (
        <div>
          <h2 className="text-lg font-semibold mb-2">Bio</h2>
          <p>{user.bio}</p>
        </div>
      )}
    </div>
  )
}
