"use client";

import { useState } from "react";

export default function DummyAudioPostTestPage() {
  const [status, setStatus] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus("Uploading...");

    const formData = new FormData();
    formData.append("user_id", "dada995c-9200-4c9d-90fc-a99d93b11369"); // ✅ your user_id
    formData.append("title", "Dummy Audio Post");
    formData.append("content", "This is a dummy audio test post.");
    formData.append("slug", "dummy-audio-post");
    formData.append("feather_type", "audio"); // ✅ required type
    formData.append("published", "true");
    formData.append("tags", JSON.stringify(["test", "audio", "dummy"]));

    const fileInput = e.currentTarget.elements.namedItem(
      "mediaFile"
    ) as HTMLInputElement;

    if (!fileInput?.files?.[0]) {
      setStatus("❌ Please select an audio file before submitting.");
      return;
    }

    formData.append("mediaFile", fileInput.files[0]);

    try {
      const res = await fetch("/api/posts/new", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (res.ok) {
        setStatus("✅ Success:\n" + JSON.stringify(data, null, 2));
      } else {
        setStatus("❌ Error:\n" + JSON.stringify(data, null, 2));
      }
    } catch (err: any) {
      setStatus("❌ Exception: " + err.message);
    }
  };

  return (
    <div className="p-6 max-w-lg mx-auto">
      <h1 className="text-xl font-bold mb-4">Dummy Audio Post API Test</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="file"
          name="mediaFile"
          accept="audio/*"
          className="block w-full"
          required
        />
        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Send Dummy Audio Post
        </button>
      </form>
      {status && (
        <pre className="mt-4 p-2 bg-gray-100 text-sm overflow-x-auto whitespace-pre-wrap">
          {status}
        </pre>
      )}
    </div>
  );
}
