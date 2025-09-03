import { createClient as createSupabaseClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

// ✅ Option 1: Export a reusable client instance
export const supabase = createSupabaseClient(supabaseUrl, supabaseAnonKey)

// ✅ Option 2: Export a factory if you ever need fresh clients
export function createClient() {
  return createSupabaseClient(supabaseUrl, supabaseAnonKey)
}
