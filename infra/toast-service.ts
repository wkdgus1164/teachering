"use client"

import type { ToastType } from "@/model/toast-model"
import type { GlobalResponse } from "@/schema/response-schema"
import { STATUS } from "./api-response"

// This is a singleton service that will be initialized with the toast context
class ToastService {
  private showToastFn: ((type: ToastType, message: string, title?: string, duration?: number) => void) | null = null

  initialize(showToastFn: (type: ToastType, message: string, title?: string, duration?: number) => void) {
    this.showToastFn = showToastFn
  }

  showToast(type: ToastType, message: string, title?: string, duration?: number) {
    if (!this.showToastFn) {
      console.warn("Toast service not initialized. Make sure ToastProvider is mounted.")
      return
    }
    this.showToastFn(type, message, title, duration)
  }

  showSuccess(message: string, title?: string, duration?: number) {
    this.showToast("success", message, title, duration)
  }

  showError(message: string, title?: string, duration?: number) {
    this.showToast("error", message, title, duration)
  }

  showInfo(message: string, title?: string, duration?: number) {
    this.showToast("info", message, title, duration)
  }

  showWarning(message: string, title?: string, duration?: number) {
    this.showToast("warning", message, title, duration)
  }

  showApiResponse<T>(response: GlobalResponse<T>, options?: { showSuccess?: boolean; showError?: boolean }) {
    const { showSuccess = true, showError = true } = options || {}

    if (response.status === STATUS.SUCCESS && showSuccess) {
      this.showSuccess(response.message)
    } else if (response.status !== STATUS.SUCCESS && showError) {
      this.showError(response.message)
    }

    return response
  }
}

// Create a singleton instance
const toastService = new ToastService()
export default toastService
