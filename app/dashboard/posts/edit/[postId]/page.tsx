"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@supabase/supabase-js";

import { ArrowLeft, Save, Send } from "lucide-react";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function EditPage() {
  const params = useParams();
  const router = useRouter();
  const slug = Array.isArray(params.slug) ? params.slug[0] : params.slug || "";

  const [loading, setLoading] = useState(false);
  const [postData, setPostData] = useState({
    title: "",
    content: "",
    status: "draft",
    slug: "",
    tags: "",
    category: "none",
    comments: "open",
    createdAt: "",
    views: 0,
    commentCount: 0,
  });

  // Fetch post data on mount
  useEffect(() => {
    if (!slug) return;
    async function fetchPost() {
      setLoading(true);
      const { data, error } = await supabase
        .from("posts")
        .select(
          `
          title,
          content,
          status,
          slug,
          tags,
          category,
          comments,
          created_at,
          view_count,
          comment_count
          `
        )
        .eq("slug", slug)
        .single();

      if (error || !data) {
        alert("Post not found.");
        router.push("/posts");
      } else {
        setPostData({
          title: data.title ?? "",
          content: data.content ?? "",
          status: data.status ?? "draft",
          slug: data.slug ?? "",
          tags: data.tags ?? "",
          category: data.category ?? "none",
          comments: data.comments ?? "open",
          createdAt: data.created_at
            ? new Date(data.created_at).toLocaleDateString()
            : "",
          views: data.view_count ?? 0,
          commentCount: data.comment_count ?? 0,
        });
      }
      setLoading(false);
    }
    fetchPost();
  }, [slug, router]);

  // Save post updates
  async function handleSavePost(publish = false) {
    setLoading(true);
    try {
      const updates = {
        title: postData.title,
        content: postData.content,
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
        .eq("slug", slug);

      if (error) {
        alert("Failed to save: " + error.message);
      } else {
        alert(`Post ${publish ? "published" : "saved"} successfully!`);
        router.push("/dashboard");
      }
    } catch (e) {
      alert("An error occurred.");
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-600">
        Loading...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-cyan-50">
      <header className="bg-white/80 backdrop-blur-xl border-b border-blue-200 shadow-lg">
        <div className="max-w-7xl mx-auto flex justify-between items-center px-6 py-4">
          <button
            aria-label="Go back"
            className="p-2 rounded-lg hover:bg-blue-50"
            onClick={() => router.back()}
          >
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </button>
          <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-cyan-500">
            Edit Post
          </h1>
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-white font-bold">
            A
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto p-6">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSavePost(postData.status !== "published");
          }}
          className="bg-white rounded-xl shadow-lg p-6"
        >
          <div className="mb-4">
            <label className="block text-sm font-semibold mb-1" htmlFor="title">
              Title
            </label>
            <input
              id="title"
              type="text"
              value={postData.title}
              onChange={(e) =>
                setPostData({ ...postData, title: e.target.value })
              }
              className="w-full border border-gray-300 rounded px-3 py-2"
              required
            />
          </div>

          <div className="mb-4">
            <label
              className="block text-sm font-semibold mb-1"
              htmlFor="content"
            >
              Content
            </label>
            <textarea
              id="content"
              rows={10}
              value={postData.content}
              onChange={(e) =>
                setPostData({ ...postData, content: e.target.value })
              }
              className="w-full border border-gray-300 rounded px-3 py-2 resize-none"
              required
            />
          </div>

          {/* Additional Inputs for category, tags, slug, comments */}

          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label
                className="block text-sm font-semibold mb-1"
                htmlFor="category"
              >
                Category
              </label>
              <select
                id="category"
                value={postData.category}
                onChange={(e) =>
                  setPostData({ ...postData, category: e.target.value })
                }
                className="w-full border border-gray-300 rounded px-3 py-2"
              >
                <option value="none">None</option>
                <option value="tech">Tech</option>
                <option value="lifestyle">Lifestyle</option>
                <option value="business">Business</option>
              </select>
            </div>

            <div>
              <label
                className="block text-sm font-semibold mb-1"
                htmlFor="tags"
              >
                Tags
              </label>
              <input
                id="tags"
                type="text"
                value={postData.tags}
                onChange={(e) =>
                  setPostData({ ...postData, tags: e.target.value })
                }
                className="w-full border border-gray-300 rounded px-3 py-2"
                placeholder="Comma separated"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label
                className="block text-sm font-semibold mb-1"
                htmlFor="slug"
              >
                Slug
              </label>
              <input
                id="slug"
                type="text"
                value={postData.slug}
                onChange={(e) =>
                  setPostData({ ...postData, slug: e.target.value })
                }
                className="w-full border border-gray-300 rounded px-3 py-2"
                required
              />
            </div>

            <div>
              <label
                className="block text-sm font-semibold mb-1"
                htmlFor="comments"
              >
                Comments
              </label>
              <select
                id="comments"
                value={postData.comments}
                onChange={(e) =>
                  setPostData({ ...postData, comments: e.target.value })
                }
                className="w-full border border-gray-300 rounded px-3 py-2"
              >
                <option value="open">Open</option>
                <option value="closed">Closed</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={() => handleSavePost(false)}
              disabled={loading}
              className="inline-flex items-center px-6 py-2 border border-gray-300 rounded shadow-sm bg-white text-gray-700 hover:bg-gray-50"
            >
              <Save className="mr-2" />
              Save Draft
            </button>
            <button
              type="button"
              onClick={() => handleSavePost(true)}
              disabled={loading}
              className="inline-flex items-center px-6 py-2 rounded shadow bg-gradient-to-r from-blue-600 to-cyan-500 text-white hover:brightness-110"
            >
              <Send className="mr-2" />
              {postData.status === "published" ? "Update" : "Publish"}
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}
