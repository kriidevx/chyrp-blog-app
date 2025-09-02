"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { signUp } from "@/lib/auth";

export default function SignupPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  async function handleSignup(e: React.FormEvent) {
    e.preventDefault();
    try {
      await signUp(email, password);
      alert("Signup successful! You can now log in.");
      router.push("/login");
    } catch (err: any) {
      alert(err.message);
    }
  }

  return (
    <form
      onSubmit={handleSignup}
      className="flex flex-col gap-4 p-6 max-w-sm mx-auto"
    >
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="border p-2 text-black"
        required
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="border p-2 text-black"
        required
      />
      <button type="submit" className="bg-blue-500 text-white p-2 rounded">
        Signup
      </button>
    </form>
  );
}
