import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import fetch from "node-fetch";


//This route is about getting youtube data recommendation after user prompt 


interface YouTubeVideo {
  id: string;
  title: string;
  description: string;
  thumbnailUrl: string;
  channelTitle: string;
  channelId : string;
  publishedAt: string;
}

export async function POST(req: NextRequest) {
  const apiKey: string | undefined = process.env.GEMINI_API_KEY;
  const youtubeApiKey: string | undefined = process.env.YOUTUBE_API_KEY;

  if (!apiKey || !youtubeApiKey) {
    return NextResponse.json({ error: "API keys are not set" }, { status: 400 });
  }

  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  try {
    const body = await req.json();
    const { prompt } = body;
    console.log(prompt);

    // Step 1: Get multiple search queries from the LLM
    const recommendationPrompt = `Based on the user's interest in "${prompt}", return an array of 3-4 different but related search queries, each focusing on a different aspect or subtopic. Return only a JSON array, with no additional text. For example: ["advanced javascript tutorials", "javascript project ideas", "javascript best practices 2024", "javascript frameworks comparison"].`;
    
    const response = await model.generateContent([recommendationPrompt]);
    const searchQueries = JSON.parse(response.response.text());

    // Step 2: Search YouTube using multiple queries
    const allVideos: YouTubeVideo[] = [];

    for (const query of searchQueries) {
      const youtubeSearchUrl = `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${encodeURIComponent(query)}&key=${youtubeApiKey}&maxResults=10&type=video&relevanceLanguage=en&videoEmbeddable=true`;

      const youtubeResponse = await fetch(youtubeSearchUrl);
      const youtubeData: any = await youtubeResponse.json();

      const videos = youtubeData.items.map((item: any) => ({
        id: item.id.videoId,
        title: item.snippet.title,
        description: item.snippet.description,
        thumbnailUrl: item.snippet.thumbnails.medium.url,
        channelTitle: item.snippet.channelTitle,
        channelId : item.snippet.channelId,
        publishedAt: item.snippet.publishedAt
      }));

      allVideos.push(...videos);
    }

    // Step 3: Remove duplicates and get video statistics
    const uniqueVideos = Array.from(new Map(allVideos.map(video => [video.id, video])).values());
    const videoIds = uniqueVideos.map(video => video.id).join(',');

    const statisticsUrl = `https://www.googleapis.com/youtube/v3/videos?part=statistics&id=${videoIds}&key=${youtubeApiKey}`;
    const statisticsResponse = await fetch(statisticsUrl);
    const statisticsData: any = await statisticsResponse.json();

    // Step 4: Merge statistics with video data
    const videosWithStats = uniqueVideos.map(video => {
      const stats = statisticsData.items.find((item: any) => item.id === video.id)?.statistics;
      return {
        ...video,
        url: `https://www.youtube.com/watch?v=${video.id}`,
        views: stats?.viewCount || '0',
        likes: stats?.likeCount || '0'
      };
    });

    // Step 5: Sort by views and return top 20
    const sortedVideos = videosWithStats
      .sort((a, b) => parseInt(b.views) - parseInt(a.views))
      .slice(0, 30);

    return NextResponse.json({ 
      searchQueries,
      videos: sortedVideos
    });

  } catch (error) {
    console.error("Error processing request", error);
    return NextResponse.json({ error: "Failed to process request" }, { status: 500 });
  }
} 