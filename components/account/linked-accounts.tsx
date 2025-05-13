"use client"

import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import type { LucideIcon } from "lucide-react"
import {
  Facebook,
  Github,
  Globe,
  ChromeIcon as Google,
  MessageCircle,
  MessageSquare,
  Twitter,
  CheckCircle,
  BadgeCheck,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { useLinkedAccounts } from "@/hooks/use-linked-accounts"
import { PROVIDERS } from "@/model/linked-account/linked-account-client"
import type { Provider } from "@/model/linked-account/linked-account-types"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

export function LinkedAccounts() {
  const { linkedAccounts, loading, isLinking, isUnlinking, linkAccount, unlinkAccount } = useLinkedAccounts()
  const [unlinkingId, setUnlinkingId] = useState<string | null>(null)
  const [newlyLinkedProvider, setNewlyLinkedProvider] = useState<string | null>(null)
  const searchParams = useSearchParams()

  // Check if we just returned from a successful account linking
  useEffect(() => {
    const status = searchParams.get("status")
    const provider = searchParams.get("provider")

    if (status === "success" && provider) {
      setNewlyLinkedProvider(provider)

      // Clear the notification after 5 seconds
      const timer = setTimeout(() => {
        setNewlyLinkedProvider(null)
      }, 5000)

      return () => clearTimeout(timer)
    }
  }, [searchParams])

  const handleUnlink = async () => {
    if (unlinkingId) {
      await unlinkAccount(unlinkingId)
      setUnlinkingId(null)
    }
  }

  const getProviderIcon = (provider: string): LucideIcon => {
    switch (provider.toLowerCase()) {
      case "google":
        return Google
      case "facebook":
        return Facebook
      case "github":
        return Github
      case "twitter":
        return Twitter
      case "kakao":
        return MessageCircle
      case "line":
        return MessageSquare
      default:
        return Globe
    }
  }

  // Check if an account is verified
  const isAccountVerified = (account: any) => {
    // Consider an account verified if it has an email or username from the provider
    return Boolean(account.providerEmail || account.providerUsername)
  }

  const linkedProviders = linkedAccounts?.map((account) => account.provider.toLowerCase()) || []

  return (
    <TooltipProvider>
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold">연결된 계정</h2>
          <p className="text-muted-foreground">
            소셜 미디어 계정을 연결하여 간편하게 로그인하고 프로필 정보를 공유하세요.
          </p>
        </div>

        {newlyLinkedProvider && (
          <Alert className="bg-green-50 border-green-200">
            <CheckCircle className="h-4 w-4 text-green-600" />
            <AlertTitle className="text-green-800">계정 연결 성공</AlertTitle>
            <AlertDescription className="text-green-700">
              {PROVIDERS[newlyLinkedProvider.toLowerCase() as Provider]?.name || newlyLinkedProvider} 계정이 성공적으로
              연결되었습니다.
            </AlertDescription>
          </Alert>
        )}

        <div className="grid gap-4 md:grid-cols-2">
          {loading ? (
            Array(2)
              .fill(0)
              .map((_, i) => (
                <Card key={i} className="animate-pulse">
                  <CardHeader className="pb-2">
                    <div className="flex items-center gap-2">
                      <div className="h-8 w-8 rounded-full bg-muted"></div>
                      <div className="h-5 w-32 bg-muted rounded"></div>
                    </div>
                  </CardHeader>
                  <CardContent className="pb-2">
                    <div className="h-4 w-48 bg-muted/60 rounded"></div>
                  </CardContent>
                  <CardFooter>
                    <div className="h-9 w-24 bg-muted/60 rounded"></div>
                  </CardFooter>
                </Card>
              ))
          ) : linkedAccounts && linkedAccounts.length > 0 ? (
            linkedAccounts.map((account) => {
              const provider = account.provider.toLowerCase() as Provider
              const providerInfo = PROVIDERS[provider] || {
                name: account.provider,
                icon: "globe",
                color: "#666",
              }
              const Icon = getProviderIcon(account.provider)
              const verified = isAccountVerified(account)

              return (
                <Card key={account.id} className={verified ? "border-blue-200" : ""}>
                  <CardHeader className="pb-2">
                    <div className="flex items-center gap-2">
                      <div
                        className="flex h-8 w-8 items-center justify-center rounded-full"
                        style={{ backgroundColor: providerInfo.color }}
                      >
                        <Icon className="h-4 w-4 text-white" />
                      </div>
                      <div className="flex items-center gap-2">
                        <CardTitle className="text-lg">{providerInfo.name}</CardTitle>
                        {verified && (
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <div className="flex items-center">
                                <BadgeCheck className="h-5 w-5 text-blue-500" />
                              </div>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>인증된 계정</p>
                            </TooltipContent>
                          </Tooltip>
                        )}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="pb-2">
                    <div className="flex items-center gap-2">
                      <p className="text-sm text-muted-foreground">
                        {account.providerEmail || account.providerUsername || "계정 연결됨"}
                      </p>
                      {verified && (
                        <span className="inline-flex items-center rounded-full bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-600/20">
                          인증됨
                        </span>
                      )}
                    </div>
                  </CardContent>
                  <CardFooter>
                    <AlertDialog
                      open={unlinkingId === account.id}
                      onOpenChange={(open) => !open && setUnlinkingId(null)}
                    >
                      <AlertDialogTrigger asChild>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setUnlinkingId(account.id)}
                          disabled={isUnlinking === account.id}
                        >
                          {isUnlinking === account.id ? "연결 해제 중..." : "연결 해제"}
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>계정 연결 해제</AlertDialogTitle>
                          <AlertDialogDescription>
                            정말로 {providerInfo.name} 계정 연결을 해제하시겠습니까? 이 작업은 되돌릴 수 없습니다.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>취소</AlertDialogCancel>
                          <AlertDialogAction onClick={handleUnlink}>연결 해제</AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </CardFooter>
                </Card>
              )
            })
          ) : (
            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle>연결된 계정 없음</CardTitle>
                <CardDescription>아래에서 소셜 미디어 계정을 연결할 수 있습니다.</CardDescription>
              </CardHeader>
            </Card>
          )}
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-medium">계정 연결하기</h3>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {Object.entries(PROVIDERS).map(([key, provider]) => {
              const isLinked = linkedProviders.includes(key.toLowerCase())
              const Icon = getProviderIcon(key)

              return (
                <Button
                  key={key}
                  variant="outline"
                  className="justify-start gap-2"
                  style={{
                    borderColor: isLinked ? undefined : provider.color,
                    opacity: isLinked ? 0.5 : 1,
                  }}
                  disabled={isLinked || isLinking}
                  onClick={() => !isLinked && linkAccount(key as Provider)}
                >
                  <div
                    className="flex h-5 w-5 items-center justify-center rounded-full"
                    style={{ backgroundColor: provider.color }}
                  >
                    <Icon className="h-3 w-3 text-white" />
                  </div>
                  <span>
                    {isLinked
                      ? `${provider.name} 연결됨`
                      : `${provider.name}${isLinking ? " 연결 중..." : " 연결하기"}`}
                  </span>
                </Button>
              )
            })}
          </div>
        </div>
      </div>
    </TooltipProvider>
  )
}
