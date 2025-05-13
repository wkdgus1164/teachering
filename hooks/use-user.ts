"use client"

import { useState, useEffect } from "react"
import userService from "@/infra/user-service"
import type { User } from "@/model/user-model"
import { STATUS } from "@/infra/api-response"

export function useUser(userId?: string) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchUser = async () => {
      setIsLoading(true)
      setError(null)

      try {
        let response

        if (userId) {
          response = await userService.getUserById(userId)
        } else {
          response = await userService.getCurrentUser()
        }

        if (response.status === STATUS.SUCCESS) {
          setUser(response.data)
        } else {
          setError(response.message)
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "사용자 정보를 불러오는데 실패했습니다.")
      } finally {
        setIsLoading(false)
      }
    }

    fetchUser()
  }, [userId])

  return { user, isLoading, error }
}
