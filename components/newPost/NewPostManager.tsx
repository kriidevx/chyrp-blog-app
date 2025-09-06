"use client";
import React, { useState, useEffect } from "react";
import { PenTool } from "lucide-react";
import NewPostModal from "./modal/NewPostModal";
import { supabase } from "@/lib/supabase";

interface PostData {
  title: string;
  content: string;
  tags: string[];
  category: string;
  slug: string;
  rights: string;
  feather_type: string;
  audioFile: File | null;
  videoFile: File | null;
  imageFile: File | null;
  link: string;
  linkDescription: string;
  quote: string;
  author: string;
  source: string;
}

interface NewPostManagerProps {
  currentUserName: string;
  onPostSaved: (newPost: any) => void; // callback to refresh posts in dashboard
}

export default function NewPostManager({
  currentUserName,
  onPostSaved,
}: NewPostManagerProps) {
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [postData, setPostData] = useState<PostData>({
    title: "",
    content: "",
    tags: [],
    category: "none",
    slug: "",
    rights: "",
    feather_type: "text",
    audioFile: null,
    videoFile: null,
    imageFile: null,
    link: "",
    linkDescription: "",
    quote: "",
    author: "",
    source: "",
  });

  // Validate file size
  const isValidFileSize = (file: File | null, feather: string) => {
    if (!file) return true;
    const MAX_SIZES: Record<string, number> = {
      audio: 6e6,
      video: 1e8,
      photo: 1e7,
    };
    return file.size <= (MAX_SIZES[feather] || 5e6);
  };

  // Save / Publish handler
  const handleSavePost = async (publish: boolean) => {
    if (!postData.title.trim()) {
      alert("Title is required");
      return;
    }

    setLoading(true);

    try {
      const {
        data: { session },
        error: sessionErr,
      } = await supabase.auth.getSession();
      if (sessionErr || !session?.user) {
        alert("Not logged in");
        return;
      }

      const user = session.user;
      const token = session.access_token;
      const formData = new FormData();

      // Only attach media if it's a media post
      let fileToUpload: File | null = null;
      if (postData.feather_type === "audio") fileToUpload = postData.audioFile;
      else if (postData.feather_type === "video")
        fileToUpload = postData.videoFile;
      else if (postData.feather_type === "photo")
        fileToUpload = postData.imageFile;

      if (fileToUpload) formData.append("mediaFile", fileToUpload);

      const usernameStr =
        user.user_metadata?.username || currentUserName || user.email || "";

      formData.append("title", postData.title);
      formData.append("content", postData.content || "");
      formData.append("tags", JSON.stringify(postData.tags || []));
      formData.append("category", postData.category || "none");
      formData.append("slug", postData.slug);
      formData.append("rights", postData.rights || usernameStr);
      formData.append("feather_type", postData.feather_type);
      formData.append("published", publish ? "true" : "false");
      formData.append("user_id", user.id);

      if (postData.feather_type === "link") {
        formData.append("link", postData.link || "");
        formData.append("linkDescription", postData.linkDescription || "");
      }

      if (postData.feather_type === "quote") {
        formData.append("quote", postData.quote || "");
        formData.append("author", postData.author || "");
        formData.append("source", postData.source || "");
      }

      const res = await fetch("/api/posts/new", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });

      const resData = await res.json();
      if (!res.ok) throw new Error(resData.message || "Error saving post");

      // Close modal safely
      if (typeof setModalOpen === "function") setModalOpen(false);

      // Reset postData
      setPostData({
        title: "",
        content: "",
        tags: [],
        category: "none",
        slug: "",
        rights: "",
        feather_type: "text",
        audioFile: null,
        videoFile: null,
        imageFile: null,
        link: "",
        linkDescription: "",
        quote: "",
        author: "",
        source: "",
      });

      // Refresh posts safely
      if (typeof onPostSaved === "function") onPostSaved(resData.post);
      // Show success message
      setSuccessMessage("Post successfully saved!");
      // Clear success message after 3 seconds to avoid stuck UI
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err: any) {
      console.error("Error saving post:", err);
      alert(err.message || "Failed to save post");
    } finally {
      setLoading(false); // Ensure loading always stops
    }
  };

  return (
    <>
      {successMessage && (
        <div className="mb-4 p-3 text-green-700 bg-green-100 rounded-lg border border-green-300">
          {successMessage}
        </div>
      )}

      <button
        onClick={() => setModalOpen(true)}
        disabled={loading}
        className="px-6 py-3 bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-semibold rounded-2xl hover:scale-105 transition-transform"
      >
        <span className="flex items-center gap-2">
          <PenTool className="w-5 h-5" /> New Post
        </span>
      </button>

      {modalOpen && (
        <NewPostModal
          show={modalOpen}
          onClose={() => setModalOpen(false)}
          postData={postData}
          setPostData={setPostData}
          handleSavePost={handleSavePost}
          currentUserName={currentUserName}
          loading={loading}
        />
      )}
    </>
  );
}
