import { NextResponse, NextRequest } from "next/server";
import fetch from "node-fetch";


//This route is about getting channel details 

interface Video {
    videoId: string;
    videoTitle: string;
    videoDescription: string;
    videoCoverImage: string;
}

interface ChannelDetails {
    channelName: string;
    channelDescription: string;
    channelCoverImage: string;
    channelBanner: string;
}

interface ChannelData {
    items: Array<{
        snippet: {
            title: string;
            description: string;
            thumbnails: {
                default: { url: string };
                high: { url: string };
            };
        };
    }>;
}

interface VideoData {
    items: Array<{
        id: { videoId: string };
        snippet: {
            title: string;
            description: string;
            thumbnails: {
                default: { url: string };
            };
        };
    }>;
}

//check for database hibernation for database problems and unexpected error 404

export async function POST(req: NextRequest) {
    const youtubeApiKey = process.env.YOUTUBE_API_KEY; // Ensure your API key is set in environment variables

    try {
        const body = await req.json();
        const { channelId } = body;

        // Step 1: Fetch Channel Details
        const channelUrl = `https://www.googleapis.com/youtube/v3/channels?part=snippet&id=${channelId}&key=${youtubeApiKey}`;
        const channelResponse = await fetch(channelUrl);
        const channelData: ChannelData = await channelResponse.json() as ChannelData; // Use type assertion

        if (channelData.items.length === 0) {
            return NextResponse.json({ error: "Channel not found" }, { status: 404 });
        }

        const channelInfo = channelData.items[0].snippet;
        const channelDetails: ChannelDetails = {
            channelName: channelInfo.title,
            channelDescription: channelInfo.description,
            channelCoverImage: channelInfo.thumbnails.default.url,
            channelBanner: channelInfo.thumbnails.high.url // This may vary based on available thumbnails
        };

        // Step 2: Fetch Videos from the Channel
        const videoUrl = `https://www.googleapis.com/youtube/v3/search?key=${youtubeApiKey}&channelId=${channelId}&part=snippet,id&order=date&maxResults=10`;
        const videoResponse = await fetch(videoUrl);
        const videoData: VideoData = await videoResponse.json() as VideoData; // Use type assertion

        const videos: Video[] = videoData.items.map(video => ({
            videoId: video.id.videoId,
            videoTitle: video.snippet.title,
            videoDescription: video.snippet.description,
            videoCoverImage: video.snippet.thumbnails.default.url
        }));

        // Step 3: Return the channel details and videos
        return NextResponse.json({ channelDetails, videos });

    } catch (error) {
        console.error("Error fetching data", error);
        return NextResponse.json({ error: "Failed to process request" }, { status: 500 });
    }
}
