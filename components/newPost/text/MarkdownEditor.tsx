'use client';
import React, { useRef, useState, useEffect } from 'react';
import { Bold, Italic, Link, List, Code, Eye } from 'lucide-react';
import { marked } from 'marked';

interface MarkdownProps {
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  className?: string;
    disabled?: boolean;
}

declare global {
  interface Window {
    MathJax?: any;
  }
}

export default function Markdown({
  value = '',
  onChange,
  placeholder = 'Write your content in Markdown...',
  className = '',
}: MarkdownProps) {
  const [isPreview, setIsPreview] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const previewRef = useRef<HTMLDivElement>(null);

  /** Inserts markdown syntax at the cursor or wraps selected text */
  const insertMarkdown = (syntax: string, wrap = false) => {
    if (!textareaRef.current) return;
    const textarea = textareaRef.current;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = textarea.value.substring(start, end);

    let newText: string;
    if (wrap) {
      newText =
        textarea.value.substring(0, start) +
        syntax +
        selectedText +
        syntax +
        textarea.value.substring(end);
      textarea.selectionStart = start + syntax.length;
      textarea.selectionEnd = end + syntax.length;
    } else {
      newText =
        textarea.value.substring(0, start) + syntax + textarea.value.substring(end);
      textarea.selectionStart = textarea.selectionEnd = start + syntax.length;
    }

    onChange?.(newText);
    textarea.focus();
  };

  /** Re-render MathJax when preview or value changes */
  useEffect(() => {
    if (isPreview && window.MathJax) {
      window.MathJax.typesetPromise?.([previewRef.current]);
    }
  }, [isPreview, value]);

  return (
    <div className={`w-full rounded-lg border border-slate-200 bg-white shadow-sm ${className}`}>
      {/* Toolbar */}
      <div className="flex items-center justify-between p-3 border-b border-slate-200">
        <div className="flex items-center gap-1">
          <button
            onClick={() => insertMarkdown('**', true)}
            className="p-2 rounded hover:bg-slate-100 transition-colors duration-200"
            title="Bold"
            type="button"
          >
            <Bold className="w-4 h-4 text-slate-600" />
          </button>
          <button
            onClick={() => insertMarkdown('*', true)}
            className="p-2 rounded hover:bg-slate-100 transition-colors duration-200"
            title="Italic"
            type="button"
          >
            <Italic className="w-4 h-4 text-slate-600" />
          </button>
          <button
            onClick={() => insertMarkdown('[text](url)')}
            className="p-2 rounded hover:bg-slate-100 transition-colors duration-200"
            title="Link"
            type="button"
          >
            <Link className="w-4 h-4 text-slate-600" />
          </button>
          <button
            onClick={() => insertMarkdown('- ')}
            className="p-2 rounded hover:bg-slate-100 transition-colors duration-200"
            title="List"
            type="button"
          >
            <List className="w-4 h-4 text-slate-600" />
          </button>
          <button
            onClick={() => insertMarkdown('`', true)}
            className="p-2 rounded hover:bg-slate-100 transition-colors duration-200"
            title="Code"
            type="button"
          >
            <Code className="w-4 h-4 text-slate-600" />
          </button>
        </div>

        <button
          onClick={() => setIsPreview(!isPreview)}
          type="button"
          className={`flex items-center gap-2 px-3 py-1 rounded-lg text-sm transition-all duration-200 ${
            isPreview
              ? 'bg-blue-100 text-blue-700'
              : 'hover:bg-slate-100 text-slate-600'
          }`}
        >
          <Eye className="w-4 h-4" />
          {isPreview ? 'Edit' : 'Preview'}
        </button>
      </div>

      {/* Content Area */}
      <div className="p-4">
        {isPreview ? (
          <div
            ref={previewRef}
            className="min-h-[200px] prose prose-slate max-w-none"
            dangerouslySetInnerHTML={{ __html: marked(value) }}
          />
        ) : (
          <textarea
            ref={textareaRef}
            value={value}
            onChange={(e) => onChange?.(e.target.value)}
            placeholder={placeholder}
            className="w-full min-h-[200px] resize-none border-0 outline-none text-slate-900 placeholder-slate-400"
          />
        )}
      </div>
    </div>
  );
}
