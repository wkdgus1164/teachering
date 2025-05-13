"use client"

import { useEffect, useState } from "react"
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from "lucide-react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"
import type { ToastType } from "@/model/toast-model"

const toastVariants = cva(
  "group pointer-events-auto relative flex w-full items-center justify-between space-x-4 overflow-hidden rounded-md border p-4 pr-8 shadow-lg transition-all",
  {
    variants: {
      variant: {
        success: "bg-green-50 border-green-200 text-green-800",
        error: "bg-red-50 border-red-200 text-red-800",
        info: "bg-blue-50 border-blue-200 text-blue-800",
        warning: "bg-yellow-50 border-yellow-200 text-yellow-800",
      },
    },
    defaultVariants: {
      variant: "info",
    },
  },
)

interface ToastIconProps {
  type: ToastType
}

function ToastIcon({ type }: ToastIconProps) {
  const iconClasses = "h-5 w-5 mr-2"

  switch (type) {
    case "success":
      return <CheckCircle className={`${iconClasses} text-green-500`} />
    case "error":
      return <AlertCircle className={`${iconClasses} text-red-500`} />
    case "warning":
      return <AlertTriangle className={`${iconClasses} text-yellow-500`} />
    case "info":
    default:
      return <Info className={`${iconClasses} text-blue-500`} />
  }
}

export interface ToastProps extends VariantProps<typeof toastVariants> {
  id: string
  type: ToastType
  title?: string
  message: string
  onDismiss: (id: string) => void
  duration?: number
}

export function Toast({ id, type, title, message, onDismiss, duration = 3000, variant }: ToastProps) {
  const [progress, setProgress] = useState(100)
  const [visible, setVisible] = useState(true)

  useEffect(() => {
    if (!duration) return

    const interval = setInterval(() => {
      setProgress((prev) => {
        const newProgress = prev - 100 / (duration / 1000)
        return newProgress < 0 ? 0 : newProgress
      })
    }, 100)

    const timeout = setTimeout(() => {
      setVisible(false)
      setTimeout(() => onDismiss(id), 300) // Allow time for exit animation
    }, duration)

    return () => {
      clearInterval(interval)
      clearTimeout(timeout)
    }
  }, [duration, id, onDismiss])

  return (
    <div
      className={cn(
        toastVariants({ variant: variant || (type as any) }),
        "data-[state=open]:animate-in data-[state=closed]:animate-out data-[swipe=end]:animate-out data-[state=closed]:fade-out-80 data-[state=open]:slide-in-from-top-full data-[state=closed]:slide-out-to-right-full",
        visible ? "opacity-100" : "opacity-0 translate-x-full",
        "transition-all duration-300",
      )}
      data-state={visible ? "open" : "closed"}
    >
      <div className="flex items-start gap-2 w-full">
        <ToastIcon type={type} />
        <div className="grid gap-1 w-full">
          {title && <div className="text-sm font-semibold">{title}</div>}
          <div className="text-sm opacity-90">{message}</div>
          {duration > 0 && (
            <div className="h-1 w-full bg-gray-200 rounded-full mt-1 overflow-hidden">
              <div
                className={cn(
                  "h-full rounded-full transition-all duration-100",
                  type === "success" && "bg-green-500",
                  type === "error" && "bg-red-500",
                  type === "warning" && "bg-yellow-500",
                  type === "info" && "bg-blue-500",
                )}
                style={{ width: `${progress}%` }}
              />
            </div>
          )}
        </div>
      </div>
      <button
        onClick={() => {
          setVisible(false)
          setTimeout(() => onDismiss(id), 300)
        }}
        className="absolute top-2 right-2 rounded-md p-1 text-foreground/50 opacity-0 transition-opacity hover:text-foreground focus:opacity-100 focus:outline-none focus:ring-2 group-hover:opacity-100"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  )
}
