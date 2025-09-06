"use client";
import React, { useEffect, useState } from "react";
import { X } from "lucide-react";
import FeathersSelector from "./FeathersSelector";
import MainContentArea from "./MainContentArea";
import SpecializedInputArea from "./SpecializedInputArea";

interface NewPostModalProps {
  show: boolean;
  onClose: () => void;
  postData: any;
  setPostData: (data: any) => void;
  handleSavePost: (publish: boolean) => void;
  currentUserName: string;
  loading: boolean;
}

const NewPostModal: React.FC<NewPostModalProps> = ({
  show,
  onClose,
  postData,
  setPostData,
  handleSavePost,
  currentUserName,
  loading,
}) => {
  const [selectedFeather, setSelectedFeather] = useState<string>("text");

  useEffect(() => {
    setPostData((prev) => ({ ...prev, feather_type: selectedFeather }));
  }, [selectedFeather, setPostData]);

  if (!show) return null;

  const renderSpecializedInput = () => (
    <SpecializedInputArea
      postData={postData}
      setPostData={setPostData}
      selectedFeather={selectedFeather}
      loading={loading}
    />
  );

  return (
    <>
      {/* Modal */}
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
        <div className="relative bg-white/90 backdrop-blur-xl rounded-3xl border border-white/40 shadow-2xl shadow-blue-500/20 w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden">
          {/* Header */}
          <div className="p-6 border-b border-blue-100/50 bg-gradient-to-r from-blue-50/50 to-cyan-50/50 flex-shrink-0">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-slate-800">
                Create New Post
              </h2>
              <button
                onClick={onClose}
                className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-all duration-200"
                aria-label="Close modal"
                disabled={loading}
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Body */}
          <div className="flex flex-1 min-h-0">
            {/* Sidebar */}
            <div className="w-64 border-r border-blue-100/50 bg-gradient-to-b from-blue-50/30 to-cyan-50/30 overflow-y-auto sticky top-0 h-[90vh]">
              <FeathersSelector
                selectedFeather={selectedFeather}
                setSelectedFeather={setSelectedFeather}
                disabled={loading}
              />
            </div>

            {/* Main content */}
            <div className="flex-1 overflow-y-auto p-6 min-h-0">
              <MainContentArea
                postData={postData}
                setPostData={setPostData}
                currentUserName={currentUserName}
                selectedFeather={selectedFeather}
                renderSpecializedInput={renderSpecializedInput}
                onSave={() => handleSavePost(false)}
                onPublish={() => handleSavePost(true)}
                loading={loading}
              />
            </div>
          </div>

          {/* Loading overlay inside modal */}
          {loading && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-50 rounded-3xl">
              <div className="bg-white p-6 rounded-xl shadow-md text-lg font-semibold">
                Uploading post, please wait...
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default NewPostModal;
