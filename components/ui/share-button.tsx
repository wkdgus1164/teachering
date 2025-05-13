"use client"

import { useState, useEffect } from "react"
import { Share2, Copy, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { STATUS } from "@/infra/api-response"
import { useApiToast } from "@/hooks/use-api-toast"
import { copyToClipboard, isBrowser } from "@/lib/clipboard-utils"

interface ShareButtonProps {
  url: string
  title?: string
  variant?: "default" | "outline" | "ghost"
  size?: "default" | "sm" | "lg"
  className?: string
}

export function ShareButton({
  url,
  title = "Check out this post",
  variant = "ghost",
  size = "sm",
  className = "",
}: ShareButtonProps) {
  const [copied, setCopied] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const [canUseShareApi, setCanUseShareApi] = useState(false)
  const { toastResponse } = useApiToast()

  // Check if Web Share API is available and likely to work
  useEffect(() => {
    // Only check on client side
    if (isBrowser()) {
      // Check if running in a secure context (required for Web Share API)
      const isSecureContext = window.isSecureContext

      // Check if Share API exists and we're in a secure context
      setCanUseShareApi(!!navigator.share && isSecureContext)
    }
  }, [])

  const handleShare = async () => {
    // Always show popover first for better UX
    setIsOpen(true)

    // Only try Web Share API if we think it will work
    if (canUseShareApi) {
      try {
        await navigator.share({
          title,
          url,
        })
        toastResponse({
          status: STATUS.SUCCESS,
          data: null,
          message: "공유되었습니다.",
        })
        setIsOpen(false)
      } catch (error) {
        console.log("Share failed:", error)
        // Keep popover open to show copy option
        // We don't need to do anything special here as the popover is already open
      }
    }
    // If Web Share API is not available or we chose not to use it,
    // the popover is already open showing the copy option
  }

  const handleCopy = async () => {
    const success = await copyToClipboard(url)

    if (success) {
      setCopied(true)
      toastResponse({
        status: STATUS.SUCCESS,
        data: null,
        message: "링크가 클립보드에 복사되었습니다.",
      })

      // Reset copied state after 2 seconds
      setTimeout(() => {
        setCopied(false)
        setIsOpen(false)
      }, 2000)
    } else {
      toastResponse({
        status: STATUS.ERROR,
        data: null,
        message: "링크 복사에 실패했습니다.",
      })
    }
  }

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          variant={variant}
          size={size}
          className={`flex items-center space-x-1 ${className}`}
          onClick={handleShare}
        >
          <Share2 className="h-4 w-4" />
          <span>공유</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-2" align="end">
        <Button
          variant="ghost"
          size="sm"
          className="flex items-center space-x-2 w-full justify-start"
          onClick={handleCopy}
        >
          {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
          <span>{copied ? "복사됨" : "링크 복사"}</span>
        </Button>
      </PopoverContent>
    </Popover>
  )
}
