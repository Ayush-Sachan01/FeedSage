"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import axios from "axios";
import {
  ThumbsUp,
  Share2,
  Flag,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { SignedOut, RedirectToSignIn, useUser } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import RecommendedVideos from "@/components/RecommendedVideos";

// Video and Comment interfaces
interface Video {
  id: string;
  title: string;
  channelTitle: string;
  description: string;
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

interface Comment {
  id: string;
  user: string;
  text: string;
  likes: number;
  time: string;
}

export default function VideoPage() {
  const { id } = useParams();
  const router = useRouter();
  const { user, isLoaded, isSignedIn } = useUser();
  const [video, setVideo] = useState<Video | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState(true)
  const [recommendedVideos, setRecommendedVideos] = useState<
    RecommendedVideo[]
  >([]);

  // Fetch the video details
  useEffect(() => {
    const fetchVideo = async () => {
      try {
        const response = await axios.get(`/api/videoplay/${id}`);
        setVideo(response.data);
      } catch (e) {
        console.log("Error fetching video details:", e);
        setError("Failed to load video. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchVideo();
  }, [id]);

  const handleSearchRedirect = () => {
    router.push("/userprompt"); // Redirect to /userprompt
  };
  // Fetch recommended videos
  useEffect(() => {
    const fetchRecommendedVideos = async () => {
      if (!id || !isLoaded || !isSignedIn || !user?.id) return;

      try {
        const response = await axios.post("/api/recommendation", {
          videoId: id,
          userId: user.id,
        });

        const fetchedVideos = response.data.results;
        setRecommendedVideos(fetchedVideos);
      } catch (error) {
        console.error("Error fetching recommended videos:", error);
      }
    };

    fetchRecommendedVideos();
  }, [id, isLoaded, isSignedIn, user?.id]);

  if (loading) {
    return (
      <div className="container mx-auto py-8 px-4 bg-gray-900 text-gray-200">
        {/* Skeleton Loading */}
        <Skeleton className="w-full aspect-video mb-4 bg-gray-800" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto py-8 px-4 text-center text-red-500 bg-gray-900">
        {error}
      </div>
    );
  }

  if (!video) {
    return (
      <div className="container mx-auto py-8 px-4 text-center text-gray-200 bg-gray-900">
        Video not found.
      </div>
    );
  }

  return (
    <>
      <div className="bg-gray-900 mx-auto md:text-right text-center md:pt-8 md:pr-8 pb-4 pt-4">
        <Button
          variant="outline"
          className="bg-gray-800 text-gray-200 hover:bg-gray-700"
          onClick={handleSearchRedirect}
        >
          Go to Search
        </Button>
      </div>
      <div className="min-h-screen bg-gray-900 text-gray-200 md:flex md:justify-center">
        <div className="container mx-auto py-8 px-4 flex flex-col md:flex-row gap-6">
          <div className="md:w-2/3">
            <div className="mb-6">
              <iframe
                width="100%"
                height="480"
                src={`https://www.youtube.com/embed/${video.id}`}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="rounded-lg"
              ></iframe>
            </div>
            <h1 className="text-2xl font-bold mb-2 text-gray-100">
              {video.title}
            </h1>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Avatar>
                  <AvatarFallback>{video.channelTitle[0]}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-semibold text-gray-100">
                    {video.channelTitle}
                  </p>
                  <p className="text-sm text-gray-400">{video.views} views</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="bg-gray-800 text-gray-200 hover:bg-gray-700"
                >
                  <ThumbsUp className="w-4 h-4 mr-2" />
                  {video.likes}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="bg-gray-800 text-gray-200 hover:bg-gray-700"
                >
                  <Share2 className="w-4 h-4 mr-2" />
                  Share
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="bg-gray-800 text-gray-200 hover:bg-gray-700"
                >
                  <Flag className="w-4 h-4 mr-2" />
                  Report
                </Button>
              </div>
            </div>
            <Collapsible
              open={isOpen}
              onOpenChange={setIsOpen}
              className="mb-6 bg-gray-800 p-4 rounded-lg"
            >
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold text-gray-100">
                  Description
                </h3>
                <CollapsibleTrigger asChild>
                  <button className="text-gray-200 hover:bg-gray-700 p-2 rounded">
                    {isOpen ? (
                      <ChevronUp className="h-4 w-4" />
                    ) : (
                      <ChevronDown className="h-4 w-4" />
                    )}
                  </button>
                </CollapsibleTrigger>
              </div>
              <CollapsibleContent className="mt-2">
                <p className="text-gray-300 whitespace-pre-wrap">
                  {video.description}
                </p>
              </CollapsibleContent>
            </Collapsible>

            {/* <div className="mb-6">
            <h2 className="text-xl font-semibold mb-4 text-gray-100">Comments</h2>
            {comments.map((comment) => (
              <div key={comment.id} className="flex gap-4 mb-4">
                <Avatar>
                  <AvatarFallback>{comment.user[0]}</AvatarFallback>
                </Avatar>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <p className="font-semibold text-gray-100">{comment.user}</p>
                    <p className="text-sm text-gray-400">{comment.time}</p>
                  </div>
                  <p className="text-gray-300">{comment.text}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <Button variant="ghost" size="sm" className="text-gray-300 hover:bg-gray-800">
                      <ThumbsUp className="w-4 h-4 mr-2" />
                      {comment.likes}
                    </Button>
                    <Button variant="ghost" size="sm" className="text-gray-300 hover:bg-gray-800">
                      <MessageCircle className="w-4 h-4 mr-2" />
                      Reply
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div> */}
          </div>
          <div className="md:w-1/3">
            <RecommendedVideos recommendedVideos={recommendedVideos} />
          </div>
        </div>
        <SignedOut>
          <RedirectToSignIn />
        </SignedOut>
      </div>
    </>
  );
}
