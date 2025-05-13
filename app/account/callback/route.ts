import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get("code")
  const next = requestUrl.searchParams.get("next") || "/profile/edit?tab=linked-accounts"
  let provider = null
  let status = "error"

  if (code) {
    const cookieStore = cookies()
    const supabase = createRouteHandlerClient({ cookies: () => cookieStore })

    // Get the current user before exchanging the code
    const { data: currentUserData } = await supabase.auth.getUser()
    const currentUser = currentUserData?.user

    if (!currentUser) {
      // If no user is logged in, this is a regular sign-in flow
      const { error } = await supabase.auth.exchangeCodeForSession(code)
      if (!error) {
        status = "signin"
      }
    } else {
      // If a user is already logged in, this is an account linking flow

      // First, we need to get the provider info from the code
      // We'll use a temporary session to get the provider details
      const tempSupabase = createRouteHandlerClient({ cookies: () => cookieStore })
      const { data, error: exchangeError } = await tempSupabase.auth.exchangeCodeForSession(code)

      if (exchangeError || !data?.user) {
        console.error("Error exchanging code for session:", exchangeError)
      } else {
        // Get the provider info from the temporary session
        provider = data.user.app_metadata.provider
        const providerId = data.user.identities?.find((i) => i.provider === provider)?.id

        if (provider && providerId) {
          // Check if this provider is already linked to the current user
          const { data: existingLinks, error: linkCheckError } = await supabase
            .from("linked_accounts")
            .select("id")
            .eq("user_id", currentUser.id)
            .eq("provider", provider)
            .eq("provider_id", providerId)
            .maybeSingle()

          if (linkCheckError) {
            console.error("Error checking existing links:", linkCheckError)
          } else if (existingLinks) {
            // This provider is already linked to the current user
            status = "already-linked"
          } else {
            // Store the linked account in our database
            const { error: insertError } = await supabase.from("linked_accounts").insert({
              user_id: currentUser.id,
              provider,
              provider_id: providerId,
              provider_email: data.user.email,
              provider_username: data.user.user_metadata.full_name || data.user.user_metadata.name,
              provider_avatar: data.user.user_metadata.avatar_url,
              access_token: null, // We don't have access to this in this flow
              refresh_token: null, // We don't have access to this in this flow
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString(),
            })

            if (insertError) {
              console.error("Error inserting linked account:", insertError)
            } else {
              status = "success"
            }
          }
        }
      }
    }
  }

  // Add provider and status to the redirect URL
  const redirectUrl = new URL(next, requestUrl.origin)
  if (provider) {
    redirectUrl.searchParams.set("provider", provider)
    redirectUrl.searchParams.set("status", status)
  }

  // Redirect back to the linked accounts page
  return NextResponse.redirect(redirectUrl)
}
