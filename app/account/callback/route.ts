import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get("code")
  const next = requestUrl.searchParams.get("next") || "/profile/edit?tab=linked-accounts"

  if (code) {
    const cookieStore = cookies()
    const supabase = createRouteHandlerClient({ cookies: () => cookieStore })

    // Exchange the code for a session
    const { data, error } = await supabase.auth.exchangeCodeForSession(code)

    if (!error && data?.user) {
      // Check if this is a new link or a sign-in
      const { data: existingUser } = await supabase.auth.getUser()

      if (existingUser?.user) {
        // This is a link operation - store the provider info
        const provider = data.user.app_metadata.provider
        const providerId = data.user.identities?.find((i) => i.provider === provider)?.id

        if (provider && providerId) {
          // Store the linked account
          await supabase.from("linked_accounts").insert({
            user_id: existingUser.user.id,
            provider,
            provider_id: providerId,
            provider_email: data.user.email,
            provider_username: data.user.user_metadata.full_name || data.user.user_metadata.name,
            provider_avatar: data.user.user_metadata.avatar_url,
          })
        }
      }
    }
  }

  // Redirect back to the linked accounts page
  return NextResponse.redirect(new URL(next, requestUrl.origin))
}
