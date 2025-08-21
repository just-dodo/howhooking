import { supabase } from "./supabase/client"

export const signInWithGoogle = async () => {
  try {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/waitlist`,
      },
    })

    if (error) {
      console.error("Error signing in with Google:", error.message)
      return { success: false, error: error.message }
    }

    return { success: true, data }
  } catch (error) {
    console.error("Unexpected error during Google sign in:", error)
    return { success: false, error: "An unexpected error occurred" }
  }
}

export const signOut = async () => {
  try {
    const { error } = await supabase.auth.signOut()
    if (error) {
      console.error("Error signing out:", error.message)
      return { success: false, error: error.message }
    }
    return { success: true }
  } catch (error) {
    console.error("Unexpected error during sign out:", error)
    return { success: false, error: "An unexpected error occurred" }
  }
}

export const getCurrentUser = async () => {
  try {
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser()
    if (error) {
      console.error("Error getting current user:", error.message)
      return { user: null, error: error.message }
    }
    return { user, error: null }
  } catch (error) {
    console.error("Unexpected error getting current user:", error)
    return { user: null, error: "An unexpected error occurred" }
  }
}
