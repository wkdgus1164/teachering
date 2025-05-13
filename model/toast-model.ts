export type ToastType = "success" | "error" | "info" | "warning"

export interface Toast {
  id: string
  type: ToastType
  title?: string
  message: string
  duration?: number
  createdAt: Date
}

export class ToastModel implements Toast {
  id: string
  type: ToastType
  title?: string
  message: string
  duration: number
  createdAt: Date

  constructor(data: Omit<Toast, "id" | "createdAt"> & { id?: string; createdAt?: Date }) {
    this.id = data.id || crypto.randomUUID()
    this.type = data.type
    this.title = data.title
    this.message = data.message
    this.duration = data.duration || this.getDefaultDuration(data.type)
    this.createdAt = data.createdAt || new Date()
  }

  private getDefaultDuration(type: ToastType): number {
    switch (type) {
      case "success":
        return 3000
      case "error":
        return 5000
      case "info":
        return 4000
      case "warning":
        return 4000
      default:
        return 3000
    }
  }

  get isExpired(): boolean {
    const now = new Date()
    return now.getTime() - this.createdAt.getTime() > this.duration
  }
}
