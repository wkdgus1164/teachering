"use client"

import { createContext, useCallback, useContext, useEffect, useState } from "react"
import type { ReactNode } from "react"
import { ToastModel, type ToastType } from "@/model/toast-model"
import toastService from "./toast-service"

interface ToastContextType {
  toasts: ToastModel[]
  showToast: (type: ToastType, message: string, title?: string, duration?: number) => void
  dismissToast: (id: string) => void
  dismissAllToasts: () => void
}

const ToastContext = createContext<ToastContextType | undefined>(undefined)

interface ToastProviderProps {
  children: ReactNode
}

export function ToastProvider({ children }: ToastProviderProps) {
  const [toasts, setToasts] = useState<ToastModel[]>([])

  const showToast = useCallback((type: ToastType, message: string, title?: string, duration?: number) => {
    const newToast = new ToastModel({ type, message, title, duration })
    setToasts((prev) => [...prev, newToast])
    return newToast.id
  }, [])

  const dismissToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id))
  }, [])

  const dismissAllToasts = useCallback(() => {
    setToasts([])
  }, [])

  // Initialize the toast service
  useEffect(() => {
    toastService.initialize(showToast)
  }, [showToast])

  // Auto-dismiss expired toasts
  useEffect(() => {
    if (toasts.length === 0) return

    const interval = setInterval(() => {
      setToasts((prev) => prev.filter((toast) => !toast.isExpired))
    }, 1000)

    return () => clearInterval(interval)
  }, [toasts])

  const value = {
    toasts,
    showToast,
    dismissToast,
    dismissAllToasts,
  }

  return <ToastContext.Provider value={value}>{children}</ToastContext.Provider>
}

export function useToast() {
  const context = useContext(ToastContext)
  if (context === undefined) {
    throw new Error("useToast must be used within a ToastProvider")
  }
  return context
}
