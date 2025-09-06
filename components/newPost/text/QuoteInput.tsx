// QuoteInput.tsx
'use client';
import React from 'react';

interface QuoteInputProps {
  value: string;
  onChangeQuote: (newValue: string) => void;
  author: string;
  onChangeAuthor: (newValue: string) => void;
  source: string;
  onChangeSource: (newValue: string) => void;
  title?: string;
  placeholderQuote?: string;
  placeholderAuthor?: string;
  placeholderSource?: string;
    disabled?: boolean;
}

const QuoteInput: React.FC<QuoteInputProps> = ({
  value,
  onChangeQuote,
  author,
  onChangeAuthor,
  source,
  onChangeSource,
  title = 'Add Your Quote',
  placeholderQuote = 'Enter your quotation here...',
  placeholderAuthor = 'Author name',
  placeholderSource = 'Source or reference',
}) => {
  return (
    <div className="w-full max-w-lg mx-auto">
      <h2 className="text-lg font-semibold text-gray-800 mb-4">{title}</h2>

      {/* Quote textarea with icon styled like LinkInput */}
      <div className="mb-4 relative">
        <label className="block mb-1 font-medium text-gray-700" htmlFor="quote">
          Quote
        </label>
        <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
          <svg
            className="w-5 h-5 text-blue-500"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 19h6M9 15h6m-9-7h10a1 1 0 011 1v7a1 1 0 01-1 1H6a1 1 0 01-1-1v-7a1 1 0 011-1z" />
          </svg>
        </div>
        <textarea
          id="quote"
          value={value}
          onChange={(e) => onChangeQuote(e.target.value)}
          placeholder={placeholderQuote}
          className="w-full h-28 p-3 pl-10 pt-4 bg-white/60 border border-blue-200 rounded-xl resize-y focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300 placeholder:text-gray-400 leading-6"
        />
      </div>

      {/* Author input with icon */}
      <div className="mb-4 relative">
        <label className="block mb-1 font-medium text-gray-700" htmlFor="author">
          Author
        </label>
        <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
          <svg
            className="w-5 h-5 text-blue-500"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M5.121 17.804A6 6 0 0112 14a6 6 0 016.879 3.804M12 12a4 4 0 100-8 4 4 0 000 8z" />
          </svg>
        </div>
        <input
          id="author"
          type="text"
          value={author}
          onChange={(e) => onChangeAuthor(e.target.value)}
          placeholder={placeholderAuthor}
          className="w-full p-3 pl-10 bg-white/60 border border-blue-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300 placeholder:text-gray-400"
        />
      </div>

      {/* Source input with icon */}
      <div className="relative">
        <label className="block mb-1 font-medium text-gray-700" htmlFor="source">
          Source
        </label>
        <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
          <svg
            className="w-5 h-5 text-blue-500"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 5v14m7-7H5" />
          </svg>
        </div>
        <input
          id="source"
          type="text"
          value={source}
          onChange={(e) => onChangeSource(e.target.value)}
          placeholder={placeholderSource}
          className="w-full p-3 pl-10 bg-white/60 border border-blue-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300 placeholder:text-gray-400"
        />
      </div>
    </div>
  );
};

export default QuoteInput;
