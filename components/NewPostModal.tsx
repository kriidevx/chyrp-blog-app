'use client';
import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

type NewPostModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

export default function NewPostModal({ isOpen, onClose }: NewPostModalProps) {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [published, setPublished] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  // 🔑 Close modal + refresh dashboard
  const handleCloseAndRefresh = () => {
    onClose();
    router.refresh();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const { data, error: sessionError } = await supabase.auth.getSession();

      if (sessionError) {
        setError("Session error: " + sessionError.message);
        setLoading(false);
        return;
      }

      const session = data.session;
      if (!session || !session.user) {
        setError("You must be logged in");
        setLoading(false);
        return;
      }

      const accessToken = session.access_token;

      const res = await fetch("/api/posts/new", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({ title, content, published }),
      });

      const result = await res.json();

      if (!res.ok) {
        setError(result.error || "Failed to create post");
        setLoading(false);
        return;
      }

      // ✅ success: close + refresh
      handleCloseAndRefresh();
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
      <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg max-w-2xl w-full relative">
        <button
          onClick={handleCloseAndRefresh} // ❌ also closes + refreshes
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-800 text-xl font-bold"
        >
          ✕
        </button>
        <h2 className="text-2xl font-bold mb-4">Create New Post</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block font-medium">Title</label>
            <input
              type="text"
              className="w-full p-2 rounded border dark:bg-gray-700 dark:border-gray-600"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block font-medium">Content (Markdown allowed)</label>
            <textarea
              className="w-full p-2 rounded border dark:bg-gray-700 dark:border-gray-600"
              rows={6}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              required
            />
          </div>
          <div className="flex items-center space-x-2">
            <input
              id="publish"
              type="checkbox"
              checked={published}
              onChange={(e) => setPublished(e.target.checked)}
            />
            <label htmlFor="publish">Publish immediately</label>
          </div>
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg disabled:opacity-50"
          >
            {loading ? "Publishing..." : "Create Post"}
          </button>
        </form>
      </div>
    </div>
  );
}
