import { NextResponse, NextRequest } from "next/server";

interface RequestBody {
    videoIdArr: number[];
}

// Your YouTube API key
const ytApiKey = process.env.YOUTUBE_API_KEY; // Make sure to store your API key in the .env file

export async function POST(req: NextRequest) {
    try {
        const body: RequestBody = await req.json();
        const { videoIdArr } = body;

        // Check if there are video IDs provided
        if (videoIdArr.length === 0) {
            return NextResponse.json({ error: "No video IDs provided" }, { status: 400 });
        }

        // Join video IDs into a comma-separated string
        const videoIdsString = videoIdArr.join(',');
        

        // Construct the YouTube API URL to fetch video details
        const apiUrl = `https://www.googleapis.com/youtube/v3/videos?id=${videoIdsString}&key=${ytApiKey}&part=snippet`;
        console.log(apiUrl);

        // Fetch video details from YouTube API
        const response = await fetch(apiUrl);
        const data = await response.json();

        // Process the response
        const videos = data.items.map((video: any) => ({
            id: video.id,
            title: video.snippet.title,
            thumbnail: video.snippet.thumbnails.default.url, 
            channelName: video.snippet.channelTitle,
            channelId : video.snippet.channelId
        }));

        return NextResponse.json({ videos });

    } catch (error) {
        console.error("Error fetching video details:", error);
        return NextResponse.json({ error: "An error occurred" }, { status: 500 });
    }
}
