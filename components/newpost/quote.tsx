import React, { useState } from 'react';
import { Quote as QuoteIcon, User } from 'lucide-react';

interface QuoteProps {
  quote?: string;
  author?: string;
  source?: string;
  onChange?: (data: { quote: string; author: string; source: string }) => void;
  isEditing?: boolean;
}

export default function Quote({ 
  quote = "", 
  author = "", 
  source = "",
  onChange,
  isEditing = false
}: QuoteProps) {
  const [localQuote, setLocalQuote] = useState(quote);
  const [localAuthor, setLocalAuthor] = useState(author);
  const [localSource, setLocalSource] = useState(source);

  const handleChange = () => {
    onChange?.({ quote: localQuote, author: localAuthor, source: localSource });
  };

  if (isEditing) {
    return (
      <div className="w-full p-6 rounded-lg border border-slate-200 bg-white shadow-sm">
        <div className="flex items-center gap-2 mb-4">
          <QuoteIcon className="w-5 h-5 text-blue-600" />
          <h3 className="font-medium text-slate-900">Quote</h3>
        </div>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Quote Text
            </label>
            <textarea
              value={localQuote}
              onChange={(e) => {
                setLocalQuote(e.target.value);
                handleChange();
              }}
              placeholder="Enter the quote text..."
              className="w-full px-3 py-2 border border-slate-200 rounded-lg 
                focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={3}
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Author
              </label>
              <input
                value={localAuthor}
                onChange={(e) => {
                  setLocalAuthor(e.target.value);
                  handleChange();
                }}
                placeholder="Quote author"
                className="w-full px-3 py-2 border border-slate-200 rounded-lg 
                  focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Source
              </label>
              <input
                value={localSource}
                onChange={(e) => {
                  setLocalSource(e.target.value);
                  handleChange();
                }}
                placeholder="Book, speech, etc."
                className="w-full px-3 py-2 border border-slate-200 rounded-lg 
                  focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full p-6 rounded-lg bg-gradient-to-br from-blue-50 to-cyan-50 
      border border-blue-200 shadow-sm">
      
      <div className="relative">
        {/* Quote Icon */}
        <QuoteIcon className="absolute -top-2 -left-2 w-8 h-8 text-blue-400/60" />
        
        {/* Quote Text */}
        <blockquote className="text-lg font-medium text-slate-900 italic ml-6 mb-4">
          "{quote || "Your inspirational quote will appear here..."}"
        </blockquote>
        
        {/* Attribution */}
        <div className="flex items-center gap-2 ml-6">
          <User className="w-4 h-4 text-slate-500" />
          <div className="text-sm text-slate-600">
            {author && (
              <span className="font-medium">— {author}</span>
            )}
            {source && author && <span>, </span>}
            {source && (
              <span className="italic">{source}</span>
            )}
            {!author && !source && (
              <span className="italic">Add author and source</span>
            )}
          </div>
        </div>
      </div>
    </div>