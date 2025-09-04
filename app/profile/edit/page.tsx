'use client';

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";

export default function EditProfilePage() {
  const { user, profile, refreshProfile } = useAuth();
  const router = useRouter();
  const [username, setUsername] = useState(profile?.username || "");
  const [bio, setBio] = useState(profile?.bio || "");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) {
      router.push("/auth/login");
      return;
    }
    setUsername(profile?.username || "");
    setBio(profile?.bio || "");
  }, [user, profile, router]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (!user) {
      setError("User not logged in.");
      setLoading(false);
      return;
    }

    // Update row and select—returns data if the update succeeded
    const { data, error: dbError } = await supabase
      .from("users")
      .update({
        username,
        bio,
      })
      .eq("id", user.id)
      .select();

    setLoading(false);

    if (dbError) {
      setError(dbError.message);
      return;
    }
    if (!data || data.length === 0) {
      setError(
        "Profile row not found. Please contact support or create your profile."
      );
      return;
    }

    await refreshProfile();
    router.push(`/profile/${username}`);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8">
        <h1 className="text-2xl font-bold mb-6 text-center">Edit Profile</h1>
        <form onSubmit={handleSave} className="space-y-4">
          <input
            type="text"
            placeholder="Choose a username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            className="w-full rounded-lg border px-3 py-2"
          />
          <textarea
            placeholder="Tell us about yourself"
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            className="w-full rounded-lg border px-3 py-2"
          />
          {error && (
            <p className="text-red-500 text-sm">{error}</p>
          )}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-2 rounded-lg font-semibold"
          >
            {loading ? "Saving..." : "Save Profile"}
          </button>
        </form>
      </div>
    </div>
  );
}
