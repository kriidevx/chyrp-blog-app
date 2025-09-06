import React from "react";
import { ExternalLink, Globe } from "lucide-react";

interface LinkViewerProps {
  url?: string;
  title?: string;
  description?: string;
  thumbnail?: string;
}

export default function LinkViewer({
  url = "https://example.com",
  title = "Link Title",
  description,
  thumbnail,
}: LinkViewerProps) {
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="block w-full p-4 rounded-lg border border-slate-200 bg-white 
        hover:bg-slate-50 hover:border-blue-300 hover:shadow-md 
        transition-all duration-200 group"
    >
      <div className="flex items-start gap-4">
        {/* Thumbnail or Icon */}
        <div className="flex-shrink-0">
          {thumbnail ? (
            <img
              src={thumbnail}
              alt=""
              className="w-16 h-16 rounded-lg object-cover"
            />
          ) : (
            <div
              className="w-16 h-16 rounded-lg bg-gradient-to-br from-blue-100 to-cyan-100 
              flex items-center justify-center"
            >
              <Globe className="w-8 h-8 text-blue-600" />
            </div>
          )}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between">
            <div>
              <h3
                className="font-medium text-slate-900 group-hover:text-blue-700 
                transition-colors duration-200 line-clamp-1"
              >
                {title}
              </h3>
              {description && (
                <p className="text-sm text-slate-600 mt-1 line-clamp-2">
                  {description}
                </p>
              )}
              <div className="flex items-center gap-1 mt-2 text-xs text-slate-500">
                <Globe className="w-3 h-3" />
                <span className="truncate">
                  {url ? new URL(url).hostname : "example.com"}
                </span>
              </div>
            </div>

            {/* External link icon */}
            <ExternalLink
              className="w-4 h-4 text-slate-400 group-hover:text-blue-600 
              transition-colors duration-200 flex-shrink-0"
            />
          </div>
        </div>
      </div>
    </a>
  );
}
