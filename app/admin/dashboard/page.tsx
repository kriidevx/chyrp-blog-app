"use client";
import { useRole } from "@/lib/useRole";
import { useRouter } from "next/navigation";

export default function AdminDashboard() {
  const role = useRole();
  const router = useRouter();

  if (role === null) return <p>Loading...</p>;
  if (role !== "admin") {
    router.push("/"); // not allowed
    return null;
  }

  return <h1 className="p-6">Admin Dashboard</h1>;
}
