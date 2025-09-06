// components/PostFilters.tsx
"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { supabase } from "@/lib/supabase";

type Category = { id: string; name: string; slug: string };

export default function PostFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialQ = searchParams.get("q") ?? "";
  const initialCategory = searchParams.get("category") ?? "";

  const [q, setQ] = useState(initialQ);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);

  useEffect(() => {
    async function loadMeta() {
      // Fetch categories (simple; safe to call client-side)
      const { data } = await supabase
        .from("categories")
        .select("id, name, slug")
        .order("name");
      setCategories(data ?? []);
    }
    loadMeta();
  }, []);

  // Apply filter by updating the URL query params (so posts/page reads them)
  function applyFilters(newQ = q, newCategory = selectedCategory) {
    const url = new URL(window.location.href);
    if (newQ) url.searchParams.set("q", newQ);
    else url.searchParams.delete("q");

    if (newCategory) url.searchParams.set("category", newCategory);
    else url.searchParams.delete("category");

    // navigate to the same pathname with updated query
    router.push(url.pathname + url.search);
  }

  function clearFilters() {
    setQ("");
    setSelectedCategory("");
    applyFilters("", "");
  }

  return (
    <div className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow">
      <div className="mb-4">
        <label className="block text-sm font-medium mb-2">Search posts</label>
        <div className="flex gap-2">
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") applyFilters();
            }}
            placeholder="Search by title or content..."
            className="flex-1 px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
          />
          <button
            onClick={() => applyFilters()}
            className="px-3 py-2 bg-blue-600 text-white rounded-lg"
          >
            Go
          </button>
        </div>
      </div>

      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-sm font-medium">Categories</h3>
          <button
            onClick={() => {
              setSelectedCategory("");
              applyFilters(q, "");
            }}
            className="text-xs text-gray-500 hover:underline"
          >
            Clear
          </button>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => {
              setSelectedCategory("");
              applyFilters(q, "");
            }}
            className={`px-2 py-1 text-sm rounded ${
              selectedCategory === ""
                ? "bg-blue-600 text-white"
                : "bg-gray-100 dark:bg-gray-700"
            }`}
          >
            All
          </button>

          {categories.map((c) => (
            <button
              key={c.id}
              onClick={() => {
                setSelectedCategory(c.id);
                applyFilters(q, c.id);
              }}
              className={`px-2 py-1 text-sm rounded ${
                selectedCategory === c.id
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 dark:bg-gray-700"
              }`}
            >
              {c.name}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-4 flex gap-2">
        <button
          onClick={() => applyFilters()}
          className="flex-1 px-3 py-2 bg-green-600 text-white rounded-lg"
        >
          Apply
        </button>
        <button onClick={clearFilters} className="px-3 py-2 border rounded-lg">
          Reset
        </button>
      </div>

      <p className="text-xs text-gray-500 mt-3">
        Tip: press Enter in the search box to apply quickly.
      </p>
    </div>
  );
}
