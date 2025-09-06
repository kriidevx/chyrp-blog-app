"use client";
import React, { useState } from "react";

interface TagsInputProps {
  tags: string[];
  setTags: (tags: string[]) => void;
    disabled?: boolean;
}

const TagsInput: React.FC<TagsInputProps> = ({ tags, setTags }) => {
  const [inputValue, setInputValue] = useState("");

  // Add new tag if input is valid and not duplicate
  const addTag = () => {
    const newTag = inputValue.trim();
    if (newTag && !tags.includes(newTag)) {
      setTags([...tags, newTag]);
      setInputValue("");
    }
  };

  // Remove a tag by index
  const removeTag = (index: number) => {
    setTags(tags.filter((_, i) => i !== index));
  };

  // Handle Enter key to add tag
  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addTag();
    }
  };

  return (
    <div>
      <div className="flex items-center space-x-2 mb-2">
        <input
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={onKeyDown}
          type="text"
          placeholder="Add a tag"
          className="flex-grow px-4 py-2 border border-blue-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder:text-gray-400"
        />
        <button
          type="button"
          onClick={addTag}
          className="px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition"
          aria-label="Add tag"
        >
          +
        </button>
      </div>

      <div className="flex flex-wrap gap-2">
        {tags.map((tag, idx) => (
          <div
            key={idx}
            className="flex items-center bg-blue-100 px-3 py-1 rounded-full text-blue-700 font-semibold"
          >
            <span>{tag}</span>
            <button
              type="button"
              onClick={() => removeTag(idx)}
              aria-label={`Remove tag ${tag}`}
              className="ml-2 text-blue-600 hover:text-blue-900 font-bold"
            >
              &times;
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TagsInput;
