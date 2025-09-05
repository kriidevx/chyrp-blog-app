import React, { useState } from 'react';
import { Bold, Italic, Link, List, Code, Eye } from 'lucide-react';

interface MarkdownProps {
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
}

export default function Markdown({ 
  value = "", 
  onChange,
  placeholder = "Write your content in Markdown..."
}: MarkdownProps) {
  const [isPreview, setIsPreview] = useState(false);

  const insertMarkdown = (syntax: string, wrap = false) => {
    // Simple markdown insertion logic would go here
    const newValue = wrap ? `${syntax}${value}${syntax}` : `${value}${syntax}`;
    onChange?.(newValue);
  };

  return (
    <div className="w-full rounded-lg border border-slate-200 bg-white shadow-sm">
      {/* Toolbar */}
      <div className="flex items-center justify-between p-3 border-b border-slate-200">
        <div className="flex items-center gap-1">
          <button
            onClick={() => insertMarkdown('**', true)}
            className="p-2 rounded hover:bg-slate-100 transition-colors duration-200"
            title="Bold"
          >
            <Bold className="w-4 h-4 text-slate-600" />
          </button>
          <button
            onClick={() => insertMarkdown('*', true)}
            className="p-2 rounded hover:bg-slate-100 transition-colors duration-200"
            title="Italic"
          >
            <Italic className="w-4 h-4 text-slate-600" />
          </button>
          <button
            onClick={() => insertMarkdown('[text](url)')}
            className="p-2 rounded hover:bg-slate-100 transition-colors duration-200"
            title="Link"
          >
            <Link className="w-4 h-4 text-slate-600" />
          </button>
          <button
            onClick={() => insertMarkdown('- ')}
            className="p-2 rounded hover:bg-slate-100 transition-colors duration-200"
            title="List"
          >
            <List className="w-4 h-4 text-slate-600" />
          </button>
          <button
            onClick={() => insertMarkdown('`', true)}
            className="p-2 rounded hover:bg-slate-100 transition-colors duration-200"
            title="Code"
          >
            <Code className="w-4 h-4 text-slate-600" />
          </button>
        </div>
        
        <button
          onClick={() => setIsPreview(!isPreview)}
          className={`flex items-center gap-2 px-3 py-1 rounded-lg text-sm 
            transition-all duration-200 ${
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
          <div className="min-h-[200px] prose prose-slate max-w-none">
            <p className="text-slate-500 italic">Preview would render here...</p>
          </div>
        ) : (
          <textarea
            value={value}
            onChange={(e) => onChange?.(e.target.value)}
            placeholder={placeholder}
            className="w-full min-h-[200px] resize-none border-0 outline-none 
              text-slate-900 placeholder-slate-400"
          />
        )}
      </div>
    </div>
  );
}