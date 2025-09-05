import React, { useState } from 'react';
import { ExternalLink, Globe, Edit3 } from 'lucide-react';

interface ExternalLinkClickableProps {
  url?: string;
  title?: string;
  description?: string;
  thumbnail?: string;
  onChange?: (data: { url: string; title: string; description: string }) => void;
  isEditing?: boolean;
}

export default function ExternalLinkClickable({ 
  url = "", 
  title = "", 
  description = "",
  thumbnail,
  onChange,
  isEditing = false
}: ExternalLinkClickableProps) {
  const [localUrl, setLocalUrl] = useState(url);
  const [localTitle, setLocalTitle] = useState(title);
  const [localDescription, setLocalDescription] = useState(description);

  const handleChange = () => {
    onChange?.({ url: localUrl, title: localTitle, description: localDescription });
  };

  if (isEditing) {
    return (
      <div className="w-full p-6 rounded-lg border border-slate-200 bg-white shadow-sm">
        <div className="flex items-center gap-2 mb-4">
          <ExternalLink className="w-5 h-5 text-blue-600" />
          <h3 className="font-medium text-slate-900">External Link</h3>
        </div>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              URL
            </label>
            <input
              value={localUrl}
              onChange={(e) => {
                setLocalUrl(e.target.value);
                handleChange();
              }}
              placeholder="https://example.com"
              className="w-full px-3 py-2 border border-slate-200 rounded-lg 
                focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Title
            </label>
            <input
              value={localTitle}
              onChange={(e) => {
                setLocalTitle(e.target.value);
                handleChange();
              }}
              placeholder="Link title"
              className="w-full px-3 py-2 border border-slate-200 rounded-lg 
                focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Description
            </label>
            <textarea
              value={localDescription}
              onChange={(e) => {
                setLocalDescription(e.target.value);
                handleChange();
              }}
              placeholder="Brief description of the link"
              className="w-full px-3 py-2 border border-slate-200 rounded-lg 
                focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={2}
            />
          </div>
        </div>
      </div>
    );
  }

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
            <div className="w-16 h-16 rounded-lg bg-gradient-to-br from-blue-100 to-cyan-100 
              flex items-center justify-center">
              <Globe className="w-8 h-8 text-blue-600" />
            </div>
          )}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="font-medium text-slate-900 group-hover:text-blue-700 
                transition-colors duration-200 line-clamp-1">
                {title || "Link Title"}
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
            
            <ExternalLink className="w-4 h-4 text-slate-400 group-hover:text-blue-600 
              transition-colors duration-200 flex-shrink-0" />
          </div>
        </div>
      </div>
    </a>
  );
}
