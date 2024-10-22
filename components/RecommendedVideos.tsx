"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link"; // Import Next.js Link
import "../app/globals.css";

interface Video {
  id: string;
  title: string;
  description: string;
  channelTitle: string;
  views: string;
  likes: string;
  videoUrl: string;
  thumbnailUrl: string;
  publishedAt?: string;
}

interface RecommendedVideo {
  _id: string;
  userId: string;
  video: Video;
  createdAt: string;
}

interface RecommendedVideosProps {
  recommendedVideos: RecommendedVideo[];
}

const RecommendedVideos: React.FC<RecommendedVideosProps> = ({
  recommendedVideos,
}) => {
  const [isLoading, setIsLoading] = useState(true);

  // Simulate loading (can replace with actual loading logic)
  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 2000); // Loader visible for 2 seconds
    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-60">
        <div className="text-center">
          <div className="loader mb-4 w-10 h-10 border-4 border-t-transparent border-gray-400 rounded-full animate-spin"></div>
          <p className="text-gray-100 text-sm font-medium">
            Recommending best videos...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="mt-8">
      <h2 className="text-xl font-semibold text-gray-100 mb-4">
        Recommended Videos
      </h2>
      <div className="flex flex-col gap-6">
        {recommendedVideos.map((video) => {
          if (video?.video) {
            return (
              <Link
                key={video._id}
                href={`/video/${video.video.id}`} // Dynamic route to video details page
                passHref
              >
                <div className="flex gap-4 items-start w-full max-w-xl cursor-pointer">
                  {/* Thumbnail */}
                  <img
                    src={video.video.thumbnailUrl}
                    alt={video.video.title}
                    className="w-40 h-24 object-cover rounded-lg"
                  />

                  {/* Video Info */}
                  <div className="flex flex-col">
                    <h3 className="font-semibold text-gray-100 text-sm mb-1 line-clamp-2">
                      {video.video.title}
                    </h3>
                    <p className="text-gray-400 text-xs mb-1">
                      {video.video.channelTitle}
                    </p>
                    <p className="text-gray-500 text-xs">
                      {video.video.views} views • {video.video.publishedAt}
                    </p>
                  </div>
                </div>
              </Link>
            );
          }
          return null;
        })}
      </div>
    </div>
  );
};

export default RecommendedVideos;
