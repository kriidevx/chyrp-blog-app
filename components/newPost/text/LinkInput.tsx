// LinkInput.tsx
'use client';
import React from 'react';

interface LinkInputProps {
  link: string;
  onChangeLink: (newValue: string) => void;
  description: string;
  onChangeDescription: (newValue: string) => void;
  placeholderLink?: string;
  placeholderDescription?: string;
    disabled?: boolean;  // add this line

}

const LinkInput: React.FC<LinkInputProps> = ({
  link,
  onChangeLink,
  description,
  onChangeDescription,
  placeholderLink = 'Enter the URL...',
  placeholderDescription = 'Enter link description...',
}) => {
  return (
    <div className="w-full max-w-lg mx-auto space-y-4">
      {/* Link input with icon */}
      <div className="relative">
        <label htmlFor="link" className="sr-only">
          URL
        </label>
        <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
          {/* Link icon SVG */}
          <svg
            className="w-5 h-5 text-blue-500"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M13.828 10.172a4 4 0 015.657 5.656l-3.536 3.535a4 4 0 01-5.657-5.656m-.707-.707a4 4 0 00-5.657-5.657L3.828 7.07a4 4 0 005.656 5.657"
            ></path>
          </svg>
        </div>
        <input
          id="link"
          type="url"
          value={link}
          onChange={(e) => onChangeLink(e.target.value)}
          placeholder={placeholderLink}
          className="w-full pl-10 pr-4 py-3 bg-white/60 border border-blue-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300 placeholder:text-gray-400"
        />
      </div>

      {/* Description input with icon */}
      <div className="relative">
        <label htmlFor="description" className="sr-only">
          Link Description
        </label>
        <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
          {/* Info icon SVG */}
          <svg
            className="w-5 h-5 text-blue-500"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M13 16h-1v-4h-1m1-4h.01M12 20.5a8.5 8.5 0 110-17 8.5 8.5 0 010 17z"
            ></path>
          </svg>
        </div>
        <input
          id="description"
          type="text"
          value={description}
          onChange={(e) => onChangeDescription(e.target.value)}
          placeholder={placeholderDescription}
          className="w-full pl-10 pr-4 py-3 bg-white/60 border border-blue-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300 placeholder:text-gray-400"
        />
      </div>
    </div>
  );
};

export default LinkInput;
