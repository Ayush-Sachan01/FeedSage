import { NextResponse } from 'next/server';
import axios from 'axios';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const id = params.id;
  try {
    // Replace with your actual YouTube API call
    const response = await axios.get(`https://www.googleapis.com/youtube/v3/videos`, {
      params: {
        part: 'snippet,statistics',
        id: id,
        key: process.env.YOUTUBE_API_KEY,
      },
    });

    const videoData = response.data.items[0];
    
    return NextResponse.json({
      id: videoData.id,
      title: videoData.snippet.title,
      description: videoData.snippet.description,
      channelTitle: videoData.snippet.channelTitle,
      views: videoData.statistics.viewCount,
      videoUrl: `https://www.youtube.com/watch?v=${videoData.id}`,
    });
  } catch (error) {
    console.error('Error fetching video data:', error);
    return NextResponse.json({ error: 'Failed to fetch video data' }, { status: 500 });
  }
}