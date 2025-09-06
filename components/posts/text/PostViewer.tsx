'use client';

import React from "react";

interface PostViewerProps {
  featherType: string;
}

export default function PostViewer({ featherType }: PostViewerProps) {
  return (
    <div className="w-full h-64 bg-gray-200 rounded-xl flex items-center justify-center text-gray-700 font-semibold text-lg mb-6">
      Viewer for feather_type: {featherType}
    </div>
  );
}
