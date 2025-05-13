import { type NextRequest, NextResponse } from "next/server"
import { logError } from "@/infra/error/error-logger"
import { createServerSupabase } from "@/infra/supabase/server"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Get user ID if authenticated
    const supabase = createServerSupabase()
    const {
      data: { session },
    } = await supabase.auth.getSession()
    const userId = session?.user?.id

    // Extract request information
    const requestPath = request.nextUrl.pathname
    const requestMethod = request.method
    const userAgent = request.headers.get("user-agent") || undefined

    // Log the error
    const result = await logError({
      ...body,
      userId,
      userAgent,
      requestPath,
      requestMethod,
      requestParams: body.requestParams || {},
    })

    if (!result.success) {
      return NextResponse.json({ error: "Failed to log error", details: result.error }, { status: 500 })
    }

    return NextResponse.json({ success: true, errorId: result.errorId })
  } catch (error) {
    console.error("Error in error logging API:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
