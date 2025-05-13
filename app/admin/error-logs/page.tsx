"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { format } from "date-fns"
import { ko } from "date-fns/locale"
import { MainLayout } from "@/components/layouts/main-layout"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import { Badge } from "@/components/ui/badge"
import { useSupabase } from "@/infra/supabase/provider"
import { useToast } from "@/hooks/use-toast"
import type { Database } from "@/schema/database.types"

type ErrorLog = Database["public"]["Tables"]["error_logs"]["Row"]

export default function ErrorLogsPage() {
  const { supabase } = useSupabase()
  const router = useRouter()
  const { toast } = useToast()
  const [loading, setLoading] = useState(true)
  const [errorLogs, setErrorLogs] = useState<ErrorLog[]>([])
  const [totalCount, setTotalCount] = useState(0)
  const [page, setPage] = useState(1)
  const [filter, setFilter] = useState<"all" | "resolved" | "unresolved">("all")
  const [severity, setSeverity] = useState<string>("all")
  const [isAdmin, setIsAdmin] = useState(false)
  const limit = 10

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
      fetchErrorLogs()
    }

    checkAdminStatus()
  }, [supabase, router, toast])

  useEffect(() => {
    if (isAdmin) {
      fetchErrorLogs()
    }
  }, [page, filter, severity, isAdmin])

  const fetchErrorLogs = async () => {
    setLoading(true)

    try {
      let query = supabase.from("error_logs").select("*", { count: "exact" }).order("created_at", { ascending: false })

      // Apply filters
      if (filter === "resolved") {
        query = query.eq("resolved", true)
      } else if (filter === "unresolved") {
        query = query.eq("resolved", false)
      }

      if (severity !== "all") {
        query = query.eq("severity", severity)
      }

      // Apply pagination
      const from = (page - 1) * limit
      const to = from + limit - 1
      query = query.range(from, to)

      const { data, error, count } = await query

      if (error) throw error

      setErrorLogs(data || [])
      setTotalCount(count || 0)
    } catch (error) {
      console.error("Error fetching error logs:", error)
      toast({
        title: "오류 로그 조회 실패",
        description: "오류 로그를 불러오는 중 문제가 발생했습니다",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleResolveError = async (errorId: string) => {
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
        })
        .eq("id", errorId)

      if (error) throw error

      toast({
        title: "오류 해결 완료",
        description: "오류가 해결된 것으로 표시되었습니다",
      })

      fetchErrorLogs()
    } catch (error) {
      console.error("Error resolving error log:", error)
      toast({
        title: "오류 해결 실패",
        description: "오류를 해결하는 중 문제가 발생했습니다",
        variant: "destructive",
      })
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

  if (!isAdmin) {
    return null
  }

  const totalPages = Math.ceil(totalCount / limit)

  return (
    <MainLayout>
      <div className="container py-6">
        <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl font-bold">오류 로그</h1>
            <p className="text-muted-foreground">시스템에서 발생한 오류를 확인하고 관리합니다</p>
          </div>

          <div className="flex flex-col gap-2 sm:flex-row">
            <Select value={filter} onValueChange={(value: "all" | "resolved" | "unresolved") => setFilter(value)}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="상태 필터" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">모든 오류</SelectItem>
                <SelectItem value="resolved">해결됨</SelectItem>
                <SelectItem value="unresolved">미해결</SelectItem>
              </SelectContent>
            </Select>

            <Select value={severity} onValueChange={(value) => setSeverity(value)}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="심각도 필터" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">모든 심각도</SelectItem>
                <SelectItem value="critical">심각</SelectItem>
                <SelectItem value="error">오류</SelectItem>
                <SelectItem value="warning">경고</SelectItem>
                <SelectItem value="info">정보</SelectItem>
                <SelectItem value="debug">디버그</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>시간</TableHead>
                <TableHead>심각도</TableHead>
                <TableHead className="w-[300px]">오류 메시지</TableHead>
                <TableHead>컴포넌트</TableHead>
                <TableHead>상태</TableHead>
                <TableHead className="text-right">작업</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={6} className="h-24 text-center">
                    로딩 중...
                  </TableCell>
                </TableRow>
              ) : errorLogs.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="h-24 text-center">
                    오류 로그가 없습니다
                  </TableCell>
                </TableRow>
              ) : (
                errorLogs.map((log) => (
                  <TableRow key={log.id}>
                    <TableCell className="font-mono text-xs">
                      {format(new Date(log.created_at), "yyyy-MM-dd HH:mm:ss", { locale: ko })}
                    </TableCell>
                    <TableCell>{getSeverityBadge(log.severity)}</TableCell>
                    <TableCell className="max-w-[300px] truncate font-mono text-xs">{log.error_message}</TableCell>
                    <TableCell>{log.component || "-"}</TableCell>
                    <TableCell>
                      {log.resolved ? (
                        <Badge variant="outline" className="border-green-500 text-green-500">
                          해결됨
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="border-orange-500 text-orange-500">
                          미해결
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="outline" size="sm" onClick={() => router.push(`/admin/error-logs/${log.id}`)}>
                          상세보기
                        </Button>
                        {!log.resolved && (
                          <Button variant="outline" size="sm" onClick={() => handleResolveError(log.id)}>
                            해결 표시
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        {totalPages > 1 && (
          <Pagination className="mt-4">
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className={page === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                />
              </PaginationItem>

              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                let pageNum = page
                if (page <= 3) {
                  pageNum = i + 1
                } else if (page >= totalPages - 2) {
                  pageNum = totalPages - 4 + i
                } else {
                  pageNum = page - 2 + i
                }

                if (pageNum > 0 && pageNum <= totalPages) {
                  return (
                    <PaginationItem key={pageNum}>
                      <PaginationLink onClick={() => setPage(pageNum)} isActive={page === pageNum}>
                        {pageNum}
                      </PaginationLink>
                    </PaginationItem>
                  )
                }
                return null
              })}

              <PaginationItem>
                <PaginationNext
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className={page === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        )}
      </div>
    </MainLayout>
  )
}
