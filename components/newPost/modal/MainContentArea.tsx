"use client";
import React, { useEffect, useState } from "react";
import TagsInput from "@/components/newPost/text/TagsInput";
import MarkdownEditor from "@/components/newPost/text/MarkdownEditor";
import slugify from "slugify";

interface MainContentAreaProps {
  postData: any;
  setPostData: (data: any) => void;
  currentUserName: string;
  selectedFeather: string;
  renderSpecializedInput: () => JSX.Element;
  onSave: () => void;
  onPublish: () => void;
  loading?: boolean;
}

const CategoryAdd = ({ onAdd }: { onAdd: (cat: string) => void }) => {
  const [newCategory, setNewCategory] = useState("");
  return (
    <div className="flex mt-2 space-x-2">
      <input
        type="text"
        value={newCategory}
        onChange={(e) => setNewCategory(e.target.value)}
        placeholder="New category"
        className="flex-grow px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      <button
        disabled={!newCategory.trim()}
        onClick={() => {
          onAdd(newCategory.trim());
          setNewCategory("");
        }}
        className={`px-4 py-2 rounded-xl text-white ${
          newCategory.trim()
            ? "bg-blue-600 hover:bg-blue-700"
            : "bg-gray-300 cursor-not-allowed"
        } transition`}
      >
        Add
      </button>
    </div>
  );
};

const MainContentArea: React.FC<MainContentAreaProps> = ({
  postData,
  setPostData,
  currentUserName,
  selectedFeather,
  renderSpecializedInput,
  onSave,
  onPublish,
  loading = false,
}) => {
  const [errorTitle, setErrorTitle] = useState(false);
  const [errorContent, setErrorContent] = useState(false);

  const validate = () => {
    const isTitleEmpty = !postData.title?.trim();
    const isContentEmpty = !postData.content?.trim();
    setErrorTitle(isTitleEmpty);
    setErrorContent(isContentEmpty);
    return !(isTitleEmpty || isContentEmpty);
  };

  // Auto slug generation
  useEffect(() => {
    if (postData.title) {
      const newSlug = slugify(postData.title, { lower: true, strict: true });
      setPostData((prev) => ({ ...prev, slug: newSlug }));
    }
  }, [postData.title, setPostData]);

  // Set default rights
  useEffect(() => {
    if (!postData.rights && currentUserName) {
      setPostData((prev) => ({ ...prev, rights: currentUserName }));
    }
  }, [postData.rights, currentUserName, setPostData]);

  const [tags, setTags] = useState(postData.tags || []);
  useEffect(() => {
    setPostData((prev) => ({ ...prev, tags }));
  }, [tags, setPostData]);

  const [categories, setCategories] = useState([
    "none",
    "tech",
    "lifestyle",
    "business",
  ]);

  const handleAddCategory = (cat: string) => {
    if (!categories.includes(cat)) {
      const updated = [...categories, cat];
      setCategories(updated);
      setPostData((prev) => ({ ...prev, category: cat }));
    }
  };

  return (
    <div className="flex flex-col space-y-6 border border-gray-200 rounded-xl p-6 bg-white">
      {/* Title */}
      <div>
        <label className="block text-sm font-semibold text-slate-700 mb-2">
          Title <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          value={postData.title || ""}
          onChange={(e) =>
            setPostData((prev) => ({ ...prev, title: e.target.value }))
          }
          className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300 ${
            errorTitle ? "border-red-500" : "border-blue-200"
          }`}
          placeholder="Enter your post title..."
          disabled={loading}
        />
        {errorTitle && (
          <p className="text-xs text-red-600 mt-1">Title is required.</p>
        )}
      </div>

      {/* Content */}
      <div>
        <label className="block text-sm font-semibold text-slate-700 mb-2">
          Content <span className="text-red-500">*</span>
        </label>
        <MarkdownEditor
          value={postData.content || ""}
          onChange={(val) => setPostData({ ...postData, content: val })}
          className="w-full min-h-[150px] border border-blue-200 rounded-xl"
          disabled={loading}
        />
        {errorContent && (
          <p className="text-xs text-red-600 mt-1">Content is required.</p>
        )}
      </div>

      {/* Specialized Input */}
      <div>{renderSpecializedInput()}</div>

      {/* Slug */}
      <div>
        <label className="block text-sm font-semibold text-slate-700 mb-2">
          Slug
        </label>
        <input
          type="text"
          value={postData.slug || ""}
          readOnly
          className="w-full px-4 py-3 bg-gray-100 border border-gray-300 rounded-xl cursor-not-allowed"
          placeholder="auto-generated slug"
          disabled={loading}
        />
      </div>

      {/* Tags */}
      <div>
        <label className="block text-sm font-semibold text-slate-700 mb-2">
          Tags
        </label>
        <TagsInput tags={tags} setTags={setTags} disabled={loading} />
      </div>

      {/* Category */}
      <div>
        <label className="block text-sm font-semibold text-slate-700 mb-2">
          Category
        </label>
        <select
          className="w-full px-4 py-3 bg-white/60 border border-blue-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={postData.category || "none"}
          onChange={(e) =>
            setPostData({ ...postData, category: e.target.value })
          }
          disabled={loading}
        >
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {cat === "none" ? "[None]" : cat.charAt(0).toUpperCase() + cat.slice(1)}
            </option>
          ))}
        </select>
        <CategoryAdd onAdd={handleAddCategory} />
      </div>

      {/* Buttons */}
      <div className="flex space-x-4">
        <button
          type="button"
          onClick={() => validate() && onSave()}
          
          className="flex-1 px-6 py-3 bg-gray-300 rounded-xl hover:bg-gray-400 transition"
          disabled={loading}
        >
          {loading ? "Saving..." : "Save Draft"}
        </button>
        <button
          type="button"
          onClick={() => validate() && onPublish()}
          className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition"
          disabled={loading}
        >
          {loading ? "Publishing..." : "Publish"}
        </button>
      </div>
    </div>
  );
};

export default MainContentArea;
