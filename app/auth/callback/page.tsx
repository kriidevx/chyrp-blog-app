"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function AuthCallback() {
  const router = useRouter();

  useEffect(() => {
    const handleAuth = async () => {
      // Supabase automatically parses the hash fragment (#access_token)
      const { data, error } = await supabase.auth.getSession();

      if (error) {
        console.error("Auth error:", error);
        router.push("/login");
      } else {
        router.push("/profile"); // redirect after login
      }
    };

    handleAuth();
  }, [router]);

  return <p>Loading...</p>;
}
