import { type NextRequest, NextResponse } from "next/server"
import { createSupabaseServerClient } from "@/lib/supabase/server"

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get("code")

  if (code) {
    const supabase = createSupabaseServerClient()

    try {
      const { error } = await supabase.auth.exchangeCodeForSession(code)

      if (error) {
        console.error("Error exchanging code for session:", error.message)
        return NextResponse.redirect(`${requestUrl.origin}/?error=auth_error`)
      }
    } catch (error) {
      console.error("Unexpected error during auth callback:", error)
      return NextResponse.redirect(`${requestUrl.origin}/?error=auth_error`)
    }
  }

  // Redirect to waitlist page after successful authentication
  return NextResponse.redirect(`${requestUrl.origin}/waitlist`)
}
