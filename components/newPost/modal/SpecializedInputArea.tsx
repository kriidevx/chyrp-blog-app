"use client";
import React from "react";
import ImageUploader from "@/components/newPost/media/PhotoUpload";
import VideoUploader from "@/components/newPost/media/VideoUpload";
import AudioUploader from "@/components/newPost/media/AudioUpload";
import LinkInput from "@/components/newPost/text/LinkInput";
import QuoteInput from "@/components/newPost/text/QuoteInput";

interface SpecializedInputAreaProps {
  postData: any;
  setPostData: (data: any) => void;
  selectedFeather: string;
  loading?: boolean;
}

const SpecializedInputArea: React.FC<SpecializedInputAreaProps> = ({
  postData,
  setPostData,
  selectedFeather,
  loading = false,
}) => {
  switch (selectedFeather) {
    case "photo":
      return (
        <ImageUploader
          onChange={(file) => setPostData({ ...postData, imageFile: file })}
          value={postData.imageFile}
          loading={loading}
        />
      );
    case "video":
      return (
        <VideoUploader
          onChange={(file) => setPostData({ ...postData, videoFile: file })}
          value={postData.videoFile}
          loading={loading}
        />
      );
    case "audio":
      return (
        <AudioUploader
          onChange={(file) => setPostData({ ...postData, audioFile: file })}
          value={postData.audioFile}
          loading={loading}
        />
      );
    case "link":
      return (
        <LinkInput
          link={postData.link || ""}
          onChangeLink={(val) => setPostData({ ...postData, link: val })}
          description={postData.linkDescription || ""}
          onChangeDescription={(val) => setPostData({ ...postData, linkDescription: val })}
          disabled={loading}
        />
      );
    case "quote":
      return (
        <QuoteInput
          value={postData.quote || ""}
          onChangeQuote={(val) => setPostData({ ...postData, quote: val })}
          author={postData.author || ""}
          onChangeAuthor={(val) => setPostData({ ...postData, author: val })}
          source={postData.source || ""}
          onChangeSource={(val) => setPostData({ ...postData, source: val })}
          disabled={loading}
        />
      );
    default:
      return null;
  }
};

export default SpecializedInputArea;
