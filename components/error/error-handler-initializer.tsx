"use client"

import { useEffect } from "react"
import { setupGlobalErrorHandler } from "@/infra/error/client-logger"

export function ErrorHandlerInitializer() {
  useEffect(() => {
    setupGlobalErrorHandler()
  }, [])

  return null
}
