import { supabase } from "./supabase/client"

export const addToWaitlist = async (userId: string, email: string, fullName?: string, avatarUrl?: string) => {
  try {
    const { data, error } = await supabase
      .from("waitlist_users")
      .upsert(
        {
          user_id: userId,
          email,
          full_name: fullName,
          avatar_url: avatarUrl,
          updated_at: new Date().toISOString(),
        },
        {
          onConflict: "user_id",
        },
      )
      .select()

    if (error) {
      console.error("Error adding to waitlist:", error.message)
      return { success: false, error: error.message }
    }

    return { success: true, data }
  } catch (error) {
    console.error("Unexpected error adding to waitlist:", error)
    return { success: false, error: "An unexpected error occurred" }
  }
}

export const getWaitlistEntry = async (userId: string) => {
  try {
    const { data, error } = await supabase.from("waitlist_users").select("*").eq("user_id", userId).single()

    if (error && error.code !== "PGRST116") {
      // PGRST116 is "not found"
      console.error("Error getting waitlist entry:", error.message)
      return { data: null, error: error.message }
    }

    return { data, error: null }
  } catch (error) {
    console.error("Unexpected error getting waitlist entry:", error)
    return { data: null, error: "An unexpected error occurred" }
  }
}
