"use client"

import { useCallback } from "react"
import { useToast } from "@/infra/toast-context"
import type { GlobalResponse } from "@/schema/response-schema"
import { STATUS } from "@/infra/api-response"

export function useApiToast<T>() {
  const { showToast } = useToast()

  const toastResponse = useCallback(
    (
      response: GlobalResponse<T>,
      options?: {
        showSuccess?: boolean
        showError?: boolean
      },
    ) => {
      const { showSuccess = true, showError = true } = options || {}

      if (response.status === STATUS.SUCCESS && showSuccess) {
        showToast("success", response.message)
      } else if (response.status !== STATUS.SUCCESS && showError) {
        showToast("error", response.message)
      }

      return response
    },
    [showToast],
  )

  return { toastResponse }
}
