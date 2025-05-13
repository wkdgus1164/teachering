"use client"

import type { UserSchema } from "@/schema/user-schema"
import type { ApiResponse } from "@/schema/response-schema"
import { User } from "@/model/user-model"
import authService from "./auth-service"
import { handleApiResponse, STATUS, createErrorResponse } from "./api-response"

class UserService {
  async getCurrentUser(): ApiResponse<User | null> {
    if (!authService.isAuthenticated()) {
      return createErrorResponse(STATUS.UNAUTHORIZED, "로그인이 필요합니다.")
    }

    // Simulate API call with our global response format
    return handleApiResponse(
      new Promise<User>((resolve) => {
        setTimeout(() => {
          const currentUser = authService.getUser()
          if (!currentUser) {
            resolve(null as any)
            return
          }

          // Mock user data
          const userData: UserSchema = {
            id: currentUser.id,
            email: currentUser.email,
            username: currentUser.username,
            profileImage: "/abstract-profile.png",
            bio: "Korean public teacher passionate about education.",
            createdAt: new Date().toISOString(),
            connectedAccounts: [
              { provider: "google", connected: true },
              { provider: "github", connected: false },
              { provider: "kakao", connected: true },
            ],
          }

          resolve(new User(userData))
        }, 500)
      }),
      "사용자 정보를 성공적으로 불러왔습니다.",
      "사용자 정보를 불러오는데 실패했습니다.",
    )
  }

  async getUserById(userId: string): ApiResponse<User | null> {
    // Simulate API call with our global response format
    return handleApiResponse(
      new Promise<User>((resolve, reject) => {
        setTimeout(() => {
          if (!userId) {
            reject(new Error("사용자 ID가 필요합니다."))
            return
          }

          // Mock user data
          const userData: UserSchema = {
            id: userId,
            email: `user${userId}@example.com`,
            username: `user${userId}`,
            profileImage: "/abstract-profile.png",
            bio: "Korean public teacher passionate about education.",
            createdAt: new Date().toISOString(),
            connectedAccounts: [
              { provider: "google", connected: true },
              { provider: "github", connected: false },
              { provider: "kakao", connected: true },
            ],
          }

          resolve(new User(userData))
        }, 500)
      }),
      "사용자 정보를 성공적으로 불러왔습니다.",
      "사용자 정보를 불러오는데 실패했습니다.",
    )
  }
}

// Create a singleton instance
const userService = new UserService()
export default userService
