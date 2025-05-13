"use client"

import Image from "next/image"
import Link from "next/link"

interface AvatarProps {
  src: string
  alt: string
  size?: "sm" | "md" | "lg"
  userId?: string
  className?: string
}

export function Avatar({ src, alt, size = "md", userId, className = "" }: AvatarProps) {
  const sizeMap = {
    sm: "w-8 h-8",
    md: "w-10 h-10",
    lg: "w-16 h-16",
  }

  const avatarContent = (
    <div className={`relative rounded-full overflow-hidden ${sizeMap[size]} ${className}`}>
      <Image
        src={src || "/placeholder.svg?height=200&width=200&query=profile"}
        alt={alt}
        fill
        className="object-cover"
      />
    </div>
  )

  if (userId) {
    return (
      <Link href={`/profile/${userId}`} className="block">
        {avatarContent}
      </Link>
    )
  }

  return avatarContent
}
