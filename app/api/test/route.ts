import { NextResponse, NextRequest } from "next/server";

// This code is about for basic youtube api data testing
export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        const videoId = searchParams.get('videoId');
        const apiKey = process.env.YOUTUBE_API_KEY; // Consider using environment variable
       

        if (!videoId) {
            return NextResponse.json(
                { error: 'Missing videoId parameter' },
                { status: 400 }
            );
        }

        const response = await fetch(
            `https://www.googleapis.com/youtube/v3/videos?part=snippet&id=${videoId}&key=${apiKey}`
        );

        if (!response.ok) {
            throw new Error('Failed to fetch data from YouTube API');
        }

        const data = await response.json();
        return NextResponse.json(data);

    } catch (error) {
        return NextResponse.json(
            { error: error instanceof Error ? error.message : 'An error occurred' },
            { status: 500 }
        );
    }
}