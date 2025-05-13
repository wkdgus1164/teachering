export interface GlobalResponse<T = any> {
  status: string
  data: T | null
  message: string
}

export type ApiResponse<T = any> = Promise<GlobalResponse<T>>
