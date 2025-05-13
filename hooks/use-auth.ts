"use client"

import { useState, useEffect, useCallback } from "react"
import { useRouter } from "next/navigation"
import authService from "@/infra/auth-service"
import type { LoginCredentials, RegisterCredentials } from "@/schema/auth-schema"
import { STATUS } from "@/infra/api-response"
import { useApiToast } from "./use-api-toast"

export function useAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false)
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()
  const { toastResponse } = useApiToast()

  useEffect(() => {
    // Check if user is authenticated
    const checkAuth = () => {
      const authenticated = authService.isAuthenticated()
      setIsAuthenticated(authenticated)
      setIsLoading(false)
    }

    checkAuth()
  }, [])

  const login = useCallback(
    async (credentials: LoginCredentials, redirectPath = "/feed") => {
      setIsLoading(true)
      setError(null)

      try {
        const response = await authService.login(credentials)
        toastResponse(response)

        if (response.status === STATUS.SUCCESS && response.data) {
          setIsAuthenticated(true)
          router.push(redirectPath)
        } else {
          setError(response.message)
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "로그인에 실패했습니다.")
      } finally {
        setIsLoading(false)
      }
    },
    [router, toastResponse],
  )

  const register = useCallback(
    async (credentials: RegisterCredentials, redirectPath = "/feed") => {
      setIsLoading(true)
      setError(null)

      try {
        const response = await authService.register(credentials)
        toastResponse(response)

        if (response.status === STATUS.SUCCESS && response.data) {
          setIsAuthenticated(true)
          router.push(redirectPath)
        } else {
          setError(response.message)
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "회원가입에 실패했습니다.")
      } finally {
        setIsLoading(false)
      }
    },
    [router, toastResponse],
  )

  const loginWithSNS = useCallback(
    async (provider: "google" | "github" | "kakao", redirectPath = "/feed") => {
      setIsLoading(true)
      setError(null)

      try {
        const response = await authService.loginWithSNS(provider)
        toastResponse(response)

        if (response.status === STATUS.SUCCESS && response.data) {
          setIsAuthenticated(true)
          router.push(redirectPath)
        } else {
          setError(response.message)
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : `${provider} 로그인에 실패했습니다.`)
      } finally {
        setIsLoading(false)
      }
    },
    [router, toastResponse],
  )

  const logout = useCallback(() => {
    authService.logout()
    setIsAuthenticated(false)
    router.push("/login")
  }, [router])

  return {
    isAuthenticated,
    isLoading,
    error,
    login,
    register,
    loginWithSNS,
    logout,
  }
}
