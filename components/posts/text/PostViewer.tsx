// components/posts/text/PostViewer.tsx

import React from "react";

interface PostViewerProps {
  featherType: string;
  content?: string;        // For text or markdown content
  videoUrl?: string;       // For video post
  audioUrl?: string;       // For audio post
  imageUrl?: string;       // For image post
  linkUrl?: string;        // For link post
  quoteText?: string;      // For quote post
  quoteAuthor?: string;
}

export default function PostViewer({
  featherType,
  content,
  videoUrl,
  audioUrl,
  imageUrl,
  linkUrl,
  quoteText,
  quoteAuthor,
}: PostViewerProps) {
  switch (featherType) {
    case "video":
      return videoUrl ? (
        <video controls className="w-full rounded-lg">
          <source src={videoUrl} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      ) : (
        <p>No video available</p>
      );

    case "audio":
      return audioUrl ? (
        <audio controls className="w-full">
          <source src={audioUrl} type="audio/mpeg" />
          Your browser does not support the audio element.
        </audio>
      ) : (
        <p>No audio available</p>
      );

    case "photo":
    case "image":
      return imageUrl ? (
        <img src={imageUrl} alt="Post visual content" className="rounded-lg max-w-full" />
      ) : (
        <p>No image available</p>
      );

    case "link":
      return linkUrl ? (
        <a
          href={linkUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="underline text-blue-600 hover:text-blue-800"
        >
          {linkUrl}
        </a>
      ) : (
        <p>No link available</p>
      );

    case "quote":
      return (
        <blockquote className="border-l-4 border-blue-600 pl-4 italic text-gray-700">
          {quoteText}
          {quoteAuthor && <footer className="mt-2 text-right">— {quoteAuthor}</footer>}
        </blockquote>
      );

    case "text":
    default:
      return <div className="whitespace-pre-wrap text-gray-800">{content}</div>;
  }
}
