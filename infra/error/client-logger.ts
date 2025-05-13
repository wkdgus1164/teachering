"use client"

export interface ClientErrorData {
  errorMessage: string
  errorStack?: string
  errorType?: string
  component?: string
  requestParams?: Record<string, any>
  severity?: "debug" | "info" | "warning" | "error" | "critical"
}

/**
 * Logs an error from the client side
 */
export async function logClientError(data: ClientErrorData): Promise<{ success: boolean; errorId?: string }> {
  try {
    const response = await fetch("/api/error/log", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })

    if (!response.ok) {
      console.error("Failed to log error to server:", await response.text())
      return { success: false }
    }

    const result = await response.json()
    return { success: true, errorId: result.errorId }
  } catch (err) {
    // Fallback to console if API call fails
    console.error("Error logging to server failed:", err)
    console.error("Original error:", data.errorMessage)
    return { success: false }
  }
}

/**
 * Global error handler for unhandled exceptions
 */
export function setupGlobalErrorHandler() {
  if (typeof window !== "undefined") {
    window.addEventListener("error", (event) => {
      logClientError({
        errorMessage: event.message,
        errorStack: event.error?.stack,
        errorType: "unhandled",
        severity: "error",
      })
    })

    window.addEventListener("unhandledrejection", (event) => {
      logClientError({
        errorMessage: event.reason?.message || "Unhandled Promise Rejection",
        errorStack: event.reason?.stack,
        errorType: "unhandledRejection",
        severity: "error",
      })
    })
  }
}
