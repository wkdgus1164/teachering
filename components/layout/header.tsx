"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Menu, X, LogOut, PenSquare } from "lucide-react"
import { useAuth } from "@/hooks/use-auth"
import { useUser } from "@/hooks/use-user"
import { Avatar } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const { isAuthenticated, logout } = useAuth()
  const { user } = useUser()
  const pathname = usePathname()

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  const closeMenu = () => {
    setIsMenuOpen(false)
  }

  const handleLogout = () => {
    logout()
    closeMenu()
  }

  const navItems = [
    { label: "피드", href: "/feed", authRequired: true },
    { label: "내 프로필", href: "/profile", authRequired: true },
    { label: "로그인", href: "/login", authRequired: false },
    { label: "회원가입", href: "/register", authRequired: false },
  ]

  const filteredNavItems = navItems.filter(
    (item) => (item.authRequired && isAuthenticated) || (!item.authRequired && !isAuthenticated),
  )

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur">
      <div className="container flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center space-x-2">
          <span className="text-xl font-bold">Teachering</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex md:items-center md:space-x-4 lg:space-x-6">
          {filteredNavItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`text-sm font-medium transition-colors hover:text-primary ${
                pathname === item.href ? "text-primary" : "text-muted-foreground"
              }`}
            >
              {item.label}
            </Link>
          ))}

          {isAuthenticated && (
            <Button variant="outline" size="sm" asChild className="flex items-center gap-1">
              <Link href="/post/create">
                <PenSquare className="h-4 w-4 mr-1" />
                글쓰기
              </Link>
            </Button>
          )}

          {isAuthenticated && user && (
            <div className="flex items-center space-x-4">
              <Link href="/profile" className="flex items-center space-x-2">
                <Avatar src={user.profileImage} alt={user.username} size="sm" />
                <span className="text-sm font-medium">{user.username}</span>
              </Link>
              <Button variant="ghost" size="sm" onClick={handleLogout}>
                <LogOut className="h-4 w-4 mr-2" />
                로그아웃
              </Button>
            </div>
          )}
        </nav>

        {/* Mobile Menu Button */}
        <button className="md:hidden" onClick={toggleMenu} aria-label={isMenuOpen ? "Close Menu" : "Open Menu"}>
          {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="fixed inset-0 top-16 z-50 bg-background md:hidden">
          <nav className="container grid gap-6 p-6">
            {filteredNavItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center text-lg font-medium ${
                  pathname === item.href ? "text-primary" : "text-muted-foreground"
                }`}
                onClick={closeMenu}
              >
                {item.label}
              </Link>
            ))}

            {isAuthenticated && (
              <Link
                href="/post/create"
                className="flex items-center text-lg font-medium text-primary"
                onClick={closeMenu}
              >
                <PenSquare className="h-5 w-5 mr-2" />
                글쓰기
              </Link>
            )}

            {isAuthenticated && user && (
              <>
                <div className="flex items-center space-x-4 py-4">
                  <Avatar src={user.profileImage} alt={user.username} size="md" />
                  <div>
                    <div className="font-medium">{user.username}</div>
                    <div className="text-sm text-muted-foreground">{user.email}</div>
                  </div>
                </div>
                <Button variant="outline" onClick={handleLogout} className="w-full">
                  <LogOut className="h-4 w-4 mr-2" />
                  로그아웃
                </Button>
              </>
            )}
          </nav>
        </div>
      )}
    </header>
  )
}
