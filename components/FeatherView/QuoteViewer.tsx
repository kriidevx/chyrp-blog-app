import React from "react";
import { Quote as QuoteIcon, User } from "lucide-react";

interface QuoteViewerProps {
  quote?: string;
  author?: string;
  source?: string;
}

export default function QuoteViewer({
  quote = "Your inspirational quote will appear here...",
  author = "",
  source = "",
}: QuoteViewerProps) {
  return (
    <div
      className="w-full p-6 rounded-lg bg-gradient-to-br from-blue-50 to-cyan-50 
      border border-blue-200 shadow-sm"
    >
      <div className="relative">
        {/* Decorative Quote Icon (top-left) */}
        <QuoteIcon className="absolute -top-2 -left-2 w-8 h-8 text-blue-400/60" />

        {/* Quote Text */}
        <blockquote className="text-lg font-medium text-slate-900 italic ml-6 mb-4">
          "{quote}"
        </blockquote>

        {/* Author + Source stacked */}
        <div className="flex items-start gap-2 ml-6">
          <User className="w-4 h-4 text-slate-500 mt-1" />
          <div className="text-sm text-slate-600 flex flex-col">
            {author ? (
              <span className="font-medium">— {author}</span>
            ) : (
              <span className="italic">Add author</span>
            )}
            {source ? (
              <span className="italic text-slate-500">{source}</span>
            ) : (
              !author && <span className="italic">Add source</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
