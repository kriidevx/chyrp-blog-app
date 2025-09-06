"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import FeathersSelector from "@/components/newPost/modal/FeathersSelector";
import MainContentArea from "@/components/newPost/modal/MainContentArea";
import SpecializedInputArea from "@/components/newPost/modal/SpecializedInputArea";

import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function EditPostPage() {
  const router = useRouter();
  const params = useSearchParams();
  const slug = params.get("slug") ?? "";

  const [postData, setPostData] = useState<any>(null);
  const [selectedFeather, setSelectedFeather] = useState<string>("text");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!slug) {
      router.push("/dashboard");
      return;
    }
    setLoading(true);
    (async () => {
      try {
        const { data, error } = await supabase
          .from("posts")
          .select("*")
          .eq("slug", slug)
          .single();

        if (error || !data) {
          alert("Post not found");
          router.push("/dashboard");
          return;
        }
        setPostData(data);
      } catch (err) {
        console.error("Error fetching post:", err);
        alert("Failed to load post data");
        router.push("/dashboard");
      } finally {
        setLoading(false);
      }
    })();
  }, [slug, router]);

  useEffect(() => {
    if (!postData) return;
    setPostData((prev: any) => ({ ...prev, feather_type: selectedFeather }));
  }, [selectedFeather]);

  async function handleSavePost(publish: boolean) {
    if (!postData) return;
    setLoading(true);
    try {
      const updates = {
        title: postData.title,
        content: postData.content,
        feather_type: postData.feather_type,
        status: publish ? "published" : postData.status,
        slug: postData.slug,
        tags: postData.tags,
        category: postData.category,
        comments: postData.comments,
        published_at: publish ? new Date().toISOString() : null,
      };

      const { error } = await supabase
        .from("posts")
        .update(updates)
        .eq("id", postData.id);

      if (error) throw error;

      alert(`Post ${publish ? "published" : "saved"} successfully`);
      router.push("/dashboard");
    } catch (err: any) {
      alert("Error saving post: " + err.message);
    } finally {
      setLoading(false);
    }
  }

  if (loading || !postData) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-600">
        Loading post data...
      </div>
    );
  }

  const statusColor =
    postData.status === "published"
      ? "bg-green-100 text-green-800"
      : "bg-yellow-100 text-yellow-800";

  return (
    <div className="min-h-screen bg-slate-50 p-8">
      <header className="max-w-7xl mx-auto mb-8 flex items-center justify-between">
        <h1 className="text-4xl font-bold text-slate-900">Edit Post</h1>
      </header>
      <div className="max-w-7xl mx-auto flex gap-8">
        <aside className="w-64 sticky top-8 bg-white p-6 rounded-xl shadow-lg overflow-auto">
          <h2 className="text-xl font-semibold mb-6">Feathers</h2>
          <FeathersSelector
            selectedFeather={selectedFeather}
            setSelectedFeather={setSelectedFeather}
            disabled={loading}
          />
          <div className="mt-8 bg-slate-100 rounded-xl p-4">
            <h3 className="font-semibold text-slate-700 mb-3">Post Status</h3>
            <ul className="text-sm text-slate-600 space-y-2">
              <li>
                Status:{" "}
                <span
                  className={`px-2 py-1 rounded ${statusColor} font-semibold`}
                >
                  {postData.status}
                </span>
              </li>
              <li>Views: {postData.views ?? 0}</li>
              <li>Comments: {postData.comments ?? 0}</li>
              <li>
                Created:{" "}
                {postData.created_at
                  ? new Date(postData.created_at).toLocaleDateString()
                  : "--"}
              </li>
            </ul>
          </div>
        </aside>

        <main className="flex-1 bg-white rounded-xl shadow-lg p-8 max-h-[80vh] overflow-y-auto flex flex-col gap-6">
          <MainContentArea
            postData={postData}
            setPostData={setPostData}
            selectedFeather={selectedFeather}
            currentUserName={postData.author || "Unknown"}
            renderSpecializedInput={() => (
              <SpecializedInputArea
                selectedFeather={selectedFeather}
                postData={postData}
                setPostData={setPostData}
              />
            )}
            onSave={() => handleSavePost(false)}
            onPublish={() => handleSavePost(true)}
            loading={loading}
          />
        </main>
      </div>
    </div>
  );
}
