"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { format } from "date-fns"
import { ko } from "date-fns/locale"
import { MainLayout } from "@/components/layouts/main-layout"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { useSupabase } from "@/infra/supabase/provider"
import { useToast } from "@/hooks/use-toast"
import type { Database } from "@/schema/database.types"

type ErrorLog = Database["public"]["Tables"]["error_logs"]["Row"]

export default function ErrorLogDetailPage() {
  const params = useParams()
  const errorId = params?.id as string
  const { supabase } = useSupabase()
  const router = useRouter()
  const { toast } = useToast()
  const [loading, setLoading] = useState(true)
  const [errorLog, setErrorLog] = useState<ErrorLog | null>(null)
  const [resolutionNotes, setResolutionNotes] = useState("")
  const [isAdmin, setIsAdmin] = useState(false)
  const [resolving, setResolving] = useState(false)

  useEffect(() => {
    const checkAdminStatus = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) {
        toast({
          title: "접근 권한이 없습니다",
          description: "관리자 페이지에 접근하려면 로그인이 필요합니다",
          variant: "destructive",
        })
        router.push("/auth/sign-in")
        return
      }

      // Check if user is admin
      const { data: roles } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", user.id)
        .eq("role", "admin")
        .maybeSingle()

      if (!roles) {
        toast({
          title: "접근 권한이 없습니다",
          description: "이 페이지는 관리자만 접근할 수 있습니다",
          variant: "destructive",
        })
        router.push("/")
        return
      }

      setIsAdmin(true)
      fetchErrorLog()
    }

    checkAdminStatus()
  }, [supabase, router, toast, errorId])

  const fetchErrorLog = async () => {
    setLoading(true)

    try {
      const { data, error } = await supabase.from("error_logs").select("*").eq("id", errorId).single()

      if (error) throw error

      setErrorLog(data)
      setResolutionNotes(data.resolution_notes || "")
    } catch (error) {
      console.error("Error fetching error log:", error)
      toast({
        title: "오류 로그 조회 실패",
        description: "오류 로그를 불러오는 중 문제가 발생했습니다",
        variant: "destructive",
      })
      router.push("/admin/error-logs")
    } finally {
      setLoading(false)
    }
  }

  const handleResolveError = async () => {
    setResolving(true)

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) {
        toast({
          title: "로그인이 필요합니다",
          description: "오류를 해결하려면 로그인이 필요합니다",
          variant: "destructive",
        })
        return
      }

      const { error } = await supabase
        .from("error_logs")
        .update({
          resolved: true,
          resolved_at: new Date().toISOString(),
          resolved_by: user.id,
          resolution_notes: resolutionNotes,
        })
        .eq("id", errorId)

      if (error) throw error

      toast({
        title: "오류 해결 완료",
        description: "오류가 해결된 것으로 표시되었습니다",
      })

      fetchErrorLog()
    } catch (error) {
      console.error("Error resolving error log:", error)
      toast({
        title: "오류 해결 실패",
        description: "오류를 해결하는 중 문제가 발생했습니다",
        variant: "destructive",
      })
    } finally {
      setResolving(false)
    }
  }

  const getSeverityBadge = (severity: string) => {
    switch (severity) {
      case "critical":
        return <Badge variant="destructive">심각</Badge>
      case "error":
        return (
          <Badge variant="destructive" className="bg-red-500">
            오류
          </Badge>
        )
      case "warning":
        return (
          <Badge variant="outline" className="border-yellow-500 text-yellow-500">
            경고
          </Badge>
        )
      case "info":
        return (
          <Badge variant="outline" className="border-blue-500 text-blue-500">
            정보
          </Badge>
        )
      case "debug":
        return (
          <Badge variant="outline" className="border-gray-500 text-gray-500">
            디버그
          </Badge>
        )
      default:
        return <Badge variant="outline">{severity}</Badge>
    }
  }

  if (!isAdmin || loading) {
    return (
      <MainLayout>
        <div className="container py-6">
          <div className="flex items-center justify-center py-12">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
          </div>
        </div>
      </MainLayout>
    )
  }

  if (!errorLog) {
    return (
      <MainLayout>
        <div className="container py-6">
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <h2 className="text-xl font-semibold">오류 로그를 찾을 수 없습니다</h2>
            <p className="mt-2 text-muted-foreground">요청하신 오류 로그가 존재하지 않습니다</p>
            <Button className="mt-4" onClick={() => router.push("/admin/error-logs")}>
              오류 로그 목록으로 돌아가기
            </Button>
          </div>
        </div>
      </MainLayout>
    )
  }

  return (
    <MainLayout>
      <div className="container py-6">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-2xl font-bold">오류 로그 상세</h1>
          <Button variant="outline" onClick={() => router.push("/admin/error-logs")}>
            목록으로 돌아가기
          </Button>
        </div>

        <div className="grid gap-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>오류 정보</CardTitle>
                  <CardDescription>
                    {format(new Date(errorLog.created_at), "yyyy년 MM월 dd일 HH:mm:ss", { locale: ko })}
                  </CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  {getSeverityBadge(errorLog.severity)}
                  {errorLog.resolved ? (
                    <Badge variant="outline" className="border-green-500 text-green-500">
                      해결됨
                    </Badge>
                  ) : (
                    <Badge variant="outline" className="border-orange-500 text-orange-500">
                      미해결
                    </Badge>
                  )}
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="mb-1 text-sm font-medium text-muted-foreground">오류 메시지</h3>
                <div className="rounded-md bg-muted p-3 font-mono text-sm">{errorLog.error_message}</div>
              </div>

              {errorLog.error_stack && (
                <div>
                  <h3 className="mb-1 text-sm font-medium text-muted-foreground">스택 트레이스</h3>
                  <pre className="max-h-[300px] overflow-auto rounded-md bg-muted p-3 font-mono text-xs">
                    {errorLog.error_stack}
                  </pre>
                </div>
              )}

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                  <h3 className="mb-1 text-sm font-medium text-muted-foreground">컴포넌트</h3>
                  <div className="rounded-md bg-muted p-3 text-sm">{errorLog.component || "-"}</div>
                </div>

                <div>
                  <h3 className="mb-1 text-sm font-medium text-muted-foreground">오류 타입</h3>
                  <div className="rounded-md bg-muted p-3 text-sm">{errorLog.error_type || "-"}</div>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                  <h3 className="mb-1 text-sm font-medium text-muted-foreground">요청 경로</h3>
                  <div className="rounded-md bg-muted p-3 text-sm">{errorLog.request_path || "-"}</div>
                </div>

                <div>
                  <h3 className="mb-1 text-sm font-medium text-muted-foreground">요청 메소드</h3>
                  <div className="rounded-md bg-muted p-3 text-sm">{errorLog.request_method || "-"}</div>
                </div>
              </div>

              {errorLog.request_params && Object.keys(errorLog.request_params).length > 0 && (
                <div>
                  <h3 className="mb-1 text-sm font-medium text-muted-foreground">요청 파라미터</h3>
                  <pre className="max-h-[200px] overflow-auto rounded-md bg-muted p-3 font-mono text-xs">
                    {JSON.stringify(errorLog.request_params, null, 2)}
                  </pre>
                </div>
              )}

              {errorLog.user_agent && (
                <div>
                  <h3 className="mb-1 text-sm font-medium text-muted-foreground">User Agent</h3>
                  <div className="rounded-md bg-muted p-3 text-xs">{errorLog.user_agent}</div>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>해결 정보</CardTitle>
              {errorLog.resolved && (
                <CardDescription>
                  {format(new Date(errorLog.resolved_at!), "yyyy년 MM월 dd일 HH:mm:ss", { locale: ko })}에 해결됨
                </CardDescription>
              )}
            </CardHeader>
            <CardContent>
              <Textarea
                placeholder="해결 방법 또는 메모를 입력하세요"
                className="min-h-[100px]"
                value={resolutionNotes}
                onChange={(e) => setResolutionNotes(e.target.value)}
                disabled={errorLog.resolved}
              />
            </CardContent>
            {!errorLog.resolved && (
              <CardFooter className="flex justify-end">
                <Button onClick={handleResolveError} disabled={resolving}>
                  {resolving ? "처리 중..." : "해결 표시"}
                </Button>
              </CardFooter>
            )}
          </Card>
        </div>
      </div>
    </MainLayout>
  )
}
