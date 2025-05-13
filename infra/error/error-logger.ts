import { createServerSupabase } from "@/infra/supabase/server"
import type { Database } from "@/schema/database.types"

export type ErrorSeverity = "debug" | "info" | "warning" | "error" | "critical"

export interface ErrorLogData {
  errorMessage: string
  errorStack?: string
  errorType?: string
  component?: string
  userId?: string
  userAgent?: string
  requestPath?: string
  requestMethod?: string
  requestParams?: Record<string, any>
  severity?: ErrorSeverity
}

export interface ErrorLogResponse {
  success: boolean
  errorId?: string
  error?: string
}

/**
 * Logs an error to the database
 */
export async function logError(data: ErrorLogData): Promise<ErrorLogResponse> {
  try {
    // Sanitize error data to remove sensitive information
    const sanitizedData = sanitizeErrorData(data)

    const supabase = createServerSupabase()

    const { data: insertedData, error } = await supabase
      .from("error_logs")
      .insert({
        error_message: sanitizedData.errorMessage,
        error_stack: sanitizedData.errorStack,
        error_type: sanitizedData.errorType,
        component: sanitizedData.component,
        user_id: sanitizedData.userId,
        user_agent: sanitizedData.userAgent,
        request_path: sanitizedData.requestPath,
        request_method: sanitizedData.requestMethod,
        request_params: sanitizedData.requestParams,
        severity: sanitizedData.severity || "error",
        resolved: false,
      })
      .select("id")
      .single()

    if (error) {
      console.error("Failed to log error:", error)
      return { success: false, error: error.message }
    }

    return { success: true, errorId: insertedData?.id }
  } catch (err) {
    // Fallback to console if database logging fails
    console.error("Error logging failed:", err)
    console.error("Original error:", data.errorMessage)
    return { success: false, error: err instanceof Error ? err.message : String(err) }
  }
}

/**
 * Sanitizes error data to remove sensitive information
 */
function sanitizeErrorData(data: ErrorLogData): ErrorLogData {
  // Create a copy to avoid mutating the original
  const sanitized = { ...data }

  // Sanitize request params to remove sensitive information
  if (sanitized.requestParams) {
    const sensitiveKeys = ["password", "token", "secret", "authorization", "key", "apiKey", "api_key"]
    const sanitizedParams = { ...sanitized.requestParams }

    for (const key of Object.keys(sanitizedParams)) {
      if (sensitiveKeys.some((sensitiveKey) => key.toLowerCase().includes(sensitiveKey))) {
        sanitizedParams[key] = "[REDACTED]"
      }
    }

    sanitized.requestParams = sanitizedParams
  }

  return sanitized
}

/**
 * Retrieves error logs with pagination
 */
export async function getErrorLogs(
  page = 1,
  limit = 20,
  filters: { resolved?: boolean; severity?: ErrorSeverity } = {},
): Promise<{ data: Database["public"]["Tables"]["error_logs"]["Row"][]; count: number }> {
  try {
    const supabase = createServerSupabase()
    const from = (page - 1) * limit
    const to = from + limit - 1

    let query = supabase.from("error_logs").select("*", { count: "exact" }).order("created_at", { ascending: false })

    // Apply filters
    if (filters.resolved !== undefined) {
      query = query.eq("resolved", filters.resolved)
    }

    if (filters.severity) {
      query = query.eq("severity", filters.severity)
    }

    // Apply pagination
    query = query.range(from, to)

    const { data, error, count } = await query

    if (error) {
      console.error("Failed to fetch error logs:", error)
      return { data: [], count: 0 }
    }

    return { data: data || [], count: count || 0 }
  } catch (err) {
    console.error("Error fetching logs:", err)
    return { data: [], count: 0 }
  }
}

/**
 * Marks an error as resolved
 */
export async function resolveError(
  errorId: string,
  userId: string,
  notes?: string,
): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = createServerSupabase()

    const { error } = await supabase
      .from("error_logs")
      .update({
        resolved: true,
        resolved_at: new Date().toISOString(),
        resolved_by: userId,
        resolution_notes: notes,
      })
      .eq("id", errorId)

    if (error) {
      return { success: false, error: error.message }
    }

    return { success: true }
  } catch (err) {
    console.error("Error resolving error log:", err)
    return { success: false, error: err instanceof Error ? err.message : String(err) }
  }
}
