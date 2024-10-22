import { NextResponse, NextRequest } from "next/server";
import fetch from "node-fetch";

interface YouTubeSearchResult {
    items: {
      id: { videoId: string };
      snippet: {
        title: string;
        description: string;
        thumbnails: { medium: { url: string } };
        channelTitle: string;
        channelId: string;
        publishedAt: string;
      };
    }[];
  }
  

export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        const videoId = searchParams.get('videoId'); // Getting videoId from query params

        if (!videoId) {
            return NextResponse.json({ error: "Video ID is required" }, { status: 400 });
        }

        const youtubeApiKey = process.env.YOUTUBE_API_KEY; // Ensure your API key is set in environment variables

        // Fetch video details from YouTube Data API
        const videoUrl = `https://www.googleapis.com/youtube/v3/videos?part=snippet,contentDetails,statistics&id=${videoId}&key=${youtubeApiKey}`;
        const videoResponse = await fetch(videoUrl);
        const videoData  = await (videoResponse.json()) as YouTubeSearchResult;

        if (!videoData.items.length) {
            return NextResponse.json({ error: "Video not found" }, { status: 404 });
        }

        const videoDetails = videoData.items[0];
        return NextResponse.json(videoDetails);

    } catch (error) {
        console.error("Something went wrong with the request", error);
        return NextResponse.json({ error: "Failed to fetch video details" }, { status: 500 });
    }
}
