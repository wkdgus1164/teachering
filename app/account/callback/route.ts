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

      try {
        // Create a new client for the OAuth exchange to avoid affecting the current session
        const tempCookieStore = new Map()
        const tempSupabase = createRouteHandlerClient({
          cookies: () => ({
            getAll: () => [],
            get: () => null,
            set: (name, value) => tempCookieStore.set(name, value),
            delete: () => {},
          }),
        })

        // Exchange the code for a session without affecting the current user's session
        const { data: oauthData, error: oauthError } = await tempSupabase.auth.exchangeCodeForSession(code)

        if (oauthError || !oauthData?.user) {
          console.error("Error exchanging code for OAuth data:", oauthError)
          status = "error"
        } else {
          // Extract provider information from the OAuth response
          provider = oauthData.user.app_metadata.provider
          const providerId = oauthData.user.identities?.[0]?.id

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
              status = "error"
            } else if (existingLinks) {
              // This provider is already linked to the current user
              status = "already-linked"
            } else {
              // Store the linked account in our database
              const { error: insertError } = await supabase.from("linked_accounts").insert({
                user_id: currentUser.id,
                provider,
                provider_id: providerId,
                provider_email: oauthData.user.email,
                provider_username: oauthData.user.user_metadata.full_name || oauthData.user.user_metadata.name,
                provider_avatar: oauthData.user.user_metadata.avatar_url,
                access_token: oauthData.session?.access_token || null,
                refresh_token: oauthData.session?.refresh_token || null,
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString(),
              })

              if (insertError) {
                console.error("Error inserting linked account:", insertError)
                status = "error"
              } else {
                status = "success"
              }
            }
          }
        }
      } catch (error) {
        console.error("Error in account linking process:", error)
        status = "error"
      }
    }
  }

  // Add provider and status to the redirect URL
  const redirectUrl = new URL(next, requestUrl.origin)
  if (provider) {
    redirectUrl.searchParams.set("provider", provider)
  }
  redirectUrl.searchParams.set("status", status)

  // Redirect back to the linked accounts page
  return NextResponse.redirect(redirectUrl)
}
