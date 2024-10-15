"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import axios from "axios";

interface Video {
  id: string;
  title: string;
  description: string;
  channelTitle: string;
  views: string;
  videoUrl: string;
}

export default function VideoPage() {
  const { id } = useParams();
  const [video, setVideo] = useState<Video | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchVideo = async () => {
      try {
        const response = await axios.get(`/api/videoplay/${id}`);
        setVideo(response.data);
      } catch (e) {
        console.log("Error fetching video details:", e);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchVideo();
  }, [id]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!video) {
    return <div>Video not found.</div>;
  }

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100">
      <div className="container mx-auto py-8 px-4">
        <h1 className="text-2xl font-bold mb-4">{video.title}</h1>
        <div className="mb-6">
          <iframe
            width="100%"
            height="500"
            src={`https://www.youtube.com/embed/${video.id}`}
            frameBorder="0"
            allowFullScreen
          ></iframe>
        </div>
        <p>{video.description}</p>
        <div className="mt-4">
          <p className="text-gray-400">Channel: {video.channelTitle}</p>
          <p className="text-gray-400">Views: {video.views}</p>
        </div>
      </div>
    </div>
  );
}