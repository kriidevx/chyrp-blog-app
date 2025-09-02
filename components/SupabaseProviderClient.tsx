"use client"; // Mark this as a Client Component

import { useState, ReactNode } from "react";
import { createBrowserSupabaseClient } from "@supabase/auth-helpers-nextjs";
import { SessionContextProvider } from "@supabase/auth-helpers-react";

export default function SupabaseProviderClient({ children }: { children: ReactNode }) {
  const [supabaseClient] = useState(() => createBrowserSupabaseClient());

  return (
    <SessionContextProvider supabaseClient={supabaseClient} initialSession={null}>
      {children}
    </SessionContextProvider>
  );
}
