"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/hooks/use-auth"
import { useToast } from "@/hooks/use-toast"

interface AuthFormProps {
  isSignUp?: boolean
}

export function AuthForm({ isSignUp = false }: AuthFormProps) {
  const router = useRouter()
  const { signInWithGoogle, signInWithFacebook, signInWithKakao } = useAuth()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)

  const handleGoogleSignIn = async () => {
    try {
      setIsLoading(true)
      const { error } = await signInWithGoogle()
      if (error) throw error
    } catch (error) {
      console.error(error)
      toast({
        title: "로그인 실패",
        description: "다시 시도해주세요",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleFacebookSignIn = async () => {
    try {
      setIsLoading(true)
      const { error } = await signInWithFacebook()
      if (error) throw error
    } catch (error) {
      console.error(error)
      toast({
        title: "로그인 실패",
        description: "다시 시도해주세요",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleKakaoSignIn = async () => {
    try {
      setIsLoading(true)
      const { error } = await signInWithKakao()
      if (error) throw error
    } catch (error) {
      console.error(error)
      toast({
        title: "로그인 실패",
        description: "다시 시도해주세요",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="grid gap-4">
      <Button
        variant="outline"
        onClick={handleGoogleSignIn}
        disabled={isLoading}
        className="bg-white text-black hover:bg-gray-100 hover:text-black"
      >
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="mr-2 h-4 w-4">
          <path
            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            fill="#4285F4"
          />
          <path
            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            fill="#34A853"
          />
          <path
            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
            fill="#FBBC05"
          />
          <path
            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
            fill="#EA4335"
          />
          <path d="M1 1h22v22H1z" fill="none" />
        </svg>
        Google로 {isSignUp ? "회원가입" : "로그인"}
      </Button>
      <Button
        variant="outline"
        onClick={handleFacebookSignIn}
        disabled={isLoading}
        className="bg-[#1877F2] text-white hover:bg-[#166FE5] hover:text-white"
      >
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="mr-2 h-4 w-4 fill-current">
          <path d="M9.19795 21.5H13.198V13.4901H16.8021L17.198 9.50977H13.198V7.5C13.198 6.94772 13.6457 6.5 14.198 6.5H17.198V2.5H14.198C11.4365 2.5 9.19795 4.73858 9.19795 7.5V9.50977H7.19795L6.80206 13.4901H9.19795V21.5Z" />
        </svg>
        Facebook으로 {isSignUp ? "회원가입" : "로그인"}
      </Button>
      <Button
        variant="outline"
        onClick={handleKakaoSignIn}
        disabled={isLoading}
        className="bg-[#FEE500] text-black hover:bg-[#FDD835] hover:text-black"
      >
        <svg width="18" height="18" viewBox="0 0 18 18" className="mr-2 h-4 w-4">
          <g fill="none">
            <path
              fill="#000"
              d="M9 1.5C4.5 1.5 1 4.25 1 7.68c0 2.15 1.44 4.03 3.6 5.09.2.08.45.27.51.5.06.2.04.52.02.65 0 0-.08.48-.1.58-.03.17-.15.66.57.36.73-.3 3.94-2.32 5.38-3.15.99-.11 1.96-.34 3.02-.34C13.5 11.37 17 8.63 17 5.19c0-3.43-3.5-6.19-8-6.19"
            />
            <path
              fill="#FFE812"
              d="M9 1.5C4.5 1.5 1 4.25 1 7.68c0 2.15 1.44 4.03 3.6 5.09.2.08.45.27.51.5.06.2.04.52.02.65 0 0-.08.48-.1.58-.03.17-.15.66.57.36.73-.3 3.94-2.32 5.38-3.15.99-.11 1.96-.34 3.02-.34C13.5 11.37 17 8.63 17 5.19c0-3.43-3.5-6.19-8-6.19"
            />
          </g>
        </svg>
        카카오로 {isSignUp ? "회원가입" : "로그인"}
      </Button>
    </div>
  )
}
