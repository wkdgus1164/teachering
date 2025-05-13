"use client"

import { useState } from "react"
import { Heart, MoreHorizontal, Edit, Trash } from "lucide-react"
import { Avatar } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Markdown } from "@/components/ui/markdown"
import { Textarea } from "@/components/ui/textarea"
import type { Comment } from "@/model/comment-model"
import { useUser } from "@/hooks/use-user"
import { useAuth } from "@/hooks/use-auth"
import authService from "@/infra/auth-service"

interface CommentItemProps {
  comment: Comment
  onLike: (commentId: string) => Promise<void>
  onUpdate: (commentId: string, content: string) => Promise<void>
  onDelete: (commentId: string) => Promise<void>
}

export function CommentItem({ comment, onLike, onUpdate, onDelete }: CommentItemProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [editContent, setEditContent] = useState(comment.content)
  const { user: author } = useUser(comment.authorId)
  const { isAuthenticated } = useAuth()
  const currentUser = authService.getUser()
  const isAuthor = currentUser?.id === comment.authorId

  const handleEdit = () => {
    setIsEditing(true)
    setIsMenuOpen(false)
  }

  const handleCancelEdit = () => {
    setIsEditing(false)
    setEditContent(comment.content)
  }

  const handleSaveEdit = async () => {
    await onUpdate(comment.id, editContent)
    setIsEditing(false)
  }

  const handleDelete = async () => {
    await onDelete(comment.id)
    setIsMenuOpen(false)
  }

  return (
    <div className="flex space-x-4 py-4 border-b last:border-b-0">
      <Avatar
        src={author?.profileImage || `/placeholder.svg?height=200&width=200&query=profile${comment.authorId}`}
        alt={author?.username || "User"}
        userId={comment.authorId}
      />
      <div className="flex-1">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="font-medium">{author?.username || "User"}</span>
            <span className="text-xs text-muted-foreground">{comment.formattedCreatedAt}</span>
          </div>
          {isAuthor && (
            <div className="relative">
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={() => setIsMenuOpen(!isMenuOpen)}>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
              {isMenuOpen && (
                <div className="absolute right-0 top-full mt-1 w-32 rounded-md border bg-background shadow-md z-10">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="flex w-full items-center justify-start px-3"
                    onClick={handleEdit}
                  >
                    <Edit className="mr-2 h-4 w-4" />
                    Edit
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="flex w-full items-center justify-start px-3 text-red-500 hover:text-red-600"
                    onClick={handleDelete}
                  >
                    <Trash className="mr-2 h-4 w-4" />
                    Delete
                  </Button>
                </div>
              )}
            </div>
          )}
        </div>

        {isEditing ? (
          <div className="mt-2 space-y-2">
            <Textarea value={editContent} onChange={(e) => setEditContent(e.target.value)} className="min-h-[100px]" />
            <div className="flex space-x-2">
              <Button size="sm" onClick={handleSaveEdit}>
                Save
              </Button>
              <Button size="sm" variant="outline" onClick={handleCancelEdit}>
                Cancel
              </Button>
            </div>
          </div>
        ) : (
          <div className="mt-1">
            <Markdown content={comment.content} />
          </div>
        )}

        <div className="mt-2 flex items-center space-x-4">
          <Button
            variant="ghost"
            size="sm"
            className="flex items-center space-x-1 h-8 px-2"
            onClick={() => onLike(comment.id)}
            disabled={!isAuthenticated}
            title={!isAuthenticated ? "로그인이 필요합니다" : ""}
          >
            <Heart className="h-4 w-4" />
            <span>{comment.likes}</span>
          </Button>
        </div>
      </div>
    </div>
  )
}
