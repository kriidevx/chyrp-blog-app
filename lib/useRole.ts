// lib/useRole.ts
"use client";
import { useEffect, useState } from "react";
import { supabase } from "./supabase";

export function useRole() {
  const [role, setRole] = useState<string | null>(null);

  useEffect(() => {
    async function fetchRole() {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;
      const { data } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", session.user.id)
        .single();
      setRole(data?.role || "user");
    }
    fetchRole();
  }, []);

  return role;
}
