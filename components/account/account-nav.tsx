"use client"

import type React from "react"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"
import { User, LinkIcon, Bell, Shield, LogOut } from "lucide-react"

interface NavItem {
  title: string
  href: string
  icon: React.ReactNode
}

export function AccountNav() {
  const pathname = usePathname()

  const navItems: NavItem[] = [
    {
      title: "프로필",
      href: "/profile/edit",
      icon: <User className="mr-2 h-4 w-4" />,
    },
    {
      title: "연결된 계정",
      href: "/account/linked-accounts",
      icon: <LinkIcon className="mr-2 h-4 w-4" />,
    },
    {
      title: "알림 설정",
      href: "/account/notifications",
      icon: <Bell className="mr-2 h-4 w-4" />,
    },
    {
      title: "보안",
      href: "/account/security",
      icon: <Shield className="mr-2 h-4 w-4" />,
    },
  ]

  return (
    <nav className="flex flex-col space-y-1">
      {navItems.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className={cn(
            buttonVariants({ variant: "ghost" }),
            pathname === item.href ? "bg-muted hover:bg-muted" : "hover:bg-transparent hover:underline",
            "justify-start",
          )}
        >
          {item.icon}
          {item.title}
        </Link>
      ))}
      <Link
        href="/api/auth/signout"
        className={cn(
          buttonVariants({ variant: "ghost" }),
          "hover:bg-transparent hover:underline justify-start text-destructive",
        )}
      >
        <LogOut className="mr-2 h-4 w-4" />
        로그아웃
      </Link>
    </nav>
  )
}
