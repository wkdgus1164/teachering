"use client"

import type { AuthResponse, LoginCredentials, RegisterCredentials } from "@/schema/auth-schema"
import type { ApiResponse } from "@/schema/response-schema"
import { handleApiResponse } from "./api-response"

class AuthService {
  private accessToken: string | null = null
  private user: { id: string; email: string; username: string } | null = null

  constructor() {
    // In a real app, we would check localStorage for existing token
    if (typeof window !== "undefined") {
      this.accessToken = localStorage.getItem("accessToken")
      const userStr = localStorage.getItem("user")
      if (userStr) {
        try {
          this.user = JSON.parse(userStr)
        } catch (e) {
          console.error("Failed to parse user from localStorage")
        }
      }
    }
  }

  async login(credentials: LoginCredentials): ApiResponse<AuthResponse> {
    // Simulate API call with our global response format
    return handleApiResponse(
      new Promise<AuthResponse>((resolve, reject) => {
        setTimeout(() => {
          if (!credentials.email || !credentials.password) {
            reject(new Error("이메일과 비밀번호를 입력해주세요."))
            return
          }

          // Mock response
          const response: AuthResponse = {
            user: {
              id: "1",
              email: credentials.email,
              username: "user1",
            },
            accessToken: "mock_token_12345",
          }

          // Store token and user
          this.accessToken = response.accessToken
          this.user = response.user

          if (typeof window !== "undefined") {
            localStorage.setItem("accessToken", response.accessToken)
            localStorage.setItem("user", JSON.stringify(response.user))
          }

          resolve(response)
        }, 1000)
      }),
      "로그인에 성공했습니다.",
      "로그인에 실패했습니다.",
    )
  }

  async register(credentials: RegisterCredentials): ApiResponse<AuthResponse> {
    // Simulate API call with our global response format
    return handleApiResponse(
      new Promise<AuthResponse>((resolve, reject) => {
        setTimeout(() => {
          if (!credentials.email || !credentials.password || !credentials.username) {
            reject(new Error("모든 필드를 입력해주세요."))
            return
          }

          if (credentials.password !== credentials.confirmPassword) {
            reject(new Error("비밀번호가 일치하지 않습니다."))
            return
          }

          // Mock response
          const response: AuthResponse = {
            user: {
              id: "1",
              email: credentials.email,
              username: credentials.username,
            },
            accessToken: "mock_token_12345",
          }

          // Store token and user
          this.accessToken = response.accessToken
          this.user = response.user

          if (typeof window !== "undefined") {
            localStorage.setItem("accessToken", response.accessToken)
            localStorage.setItem("user", JSON.stringify(response.user))
          }

          resolve(response)
        }, 1000)
      }),
      "회원가입에 성공했습니다.",
      "회원가입에 실패했습니다.",
    )
  }

  async loginWithSNS(provider: "google" | "github" | "kakao"): ApiResponse<AuthResponse> {
    // Simulate API call with our global response format
    return handleApiResponse(
      new Promise<AuthResponse>((resolve) => {
        setTimeout(() => {
          // Mock response
          const response: AuthResponse = {
            user: {
              id: "1",
              email: `user@${provider}.com`,
              username: `${provider}User`,
            },
            accessToken: `mock_token_${provider}_12345`,
          }

          // Store token and user
          this.accessToken = response.accessToken
          this.user = response.user

          if (typeof window !== "undefined") {
            localStorage.setItem("accessToken", response.accessToken)
            localStorage.setItem("user", JSON.stringify(response.user))
          }

          resolve(response)
        }, 1000)
      }),
      `${provider} 로그인에 성공했습니다.`,
      `${provider} 로그인에 실패했습니다.`,
    )
  }

  logout(): void {
    this.accessToken = null
    this.user = null

    if (typeof window !== "undefined") {
      localStorage.removeItem("accessToken")
      localStorage.removeItem("user")
    }
  }

  getToken(): string | null {
    return this.accessToken
  }

  getUser(): { id: string; email: string; username: string } | null {
    return this.user
  }

  isAuthenticated(): boolean {
    return !!this.accessToken
  }
}

// Create a singleton instance
const authService = new AuthService()
export default authService
