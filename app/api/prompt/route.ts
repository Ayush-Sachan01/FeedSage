import { NextRequest, NextResponse } from "next/server";
import fetch from "node-fetch";
import { db } from "@/lib/astraClient";
import { GoogleGenerativeAI } from  "@google/generative-ai";
import dotenv from 'dotenv';

dotenv.config(); 

interface YouTubeVideo {
  id: string;
  title: string;
  description: string;
  thumbnailUrl: string;
  channelTitle: string;
  channelId: string;
  publishedAt: string;
}

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

interface YouTubeVideoItem {
  id: {
    videoId: string;
  };
  snippet: {
    title: string;
    description: string;
    thumbnails: {
      medium: {
        url: string;
      };
    };
    channelTitle: string;
    channelId: string;
    publishedAt: string;
  };
}

  

const geminiApiKey = process.env.GEMINI_API_KEY;

if (!geminiApiKey) {
  throw new Error("GEMINI_API_KEY is not defined in the environment variables.");
}
// Initialize Google Gemini client once
const genAI = new GoogleGenerativeAI(geminiApiKey);
const model = genAI.getGenerativeModel({ model: "text-embedding-004" });

async function embedding(text: string): Promise<number[]> {
  const result = await model.embedContent(text);
  return result.embedding.values;
}

async function videoExists(videoId: string, userId: string): Promise<boolean> {
  const collection = db.collection("videos");
  const query = { userId, "video.id": videoId };
  const result = await collection.findOne(query);
  return !!result; // Return true if video exists, otherwise false
}

// Main POST handler
export async function POST(req: NextRequest) {
  const youtubeApiKey = process.env.YOUTUBE_API_KEY;

  if (!youtubeApiKey) {
    return NextResponse.json({ error: "YouTube API key is not set" }, { status: 400 });
  }

  try {
    const { prompt, userId } = await req.json();
    console.log("User Prompt:", prompt, "UserId:", userId);

    // Step 1: Search YouTube using the prompt
    const youtubeSearchUrl = `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${encodeURIComponent(
      prompt
    )}&key=${youtubeApiKey}&maxResults=10&type=video&relevanceLanguage=en&videoEmbeddable=true`;

    const youtubeResponse = await fetch(youtubeSearchUrl);
    
    const youtubeData  = await (youtubeResponse.json()) as YouTubeSearchResult;

    if (!youtubeData.items || youtubeData.items.length === 0) {
      return NextResponse.json({ message: "No videos found for the given prompt" }, { status: 404 });
    }
    
    // Extract video IDs from search results
    const videoIds = youtubeData.items.map((item: YouTubeVideoItem) => item.id.videoId).join(",");
    
    // Fetch statistics (views)
    const statsUrl = `https://www.googleapis.com/youtube/v3/videos?part=statistics&id=${videoIds}&key=${youtubeApiKey}`;
    const statsResponse = await fetch(statsUrl);
    const statsData = await statsResponse.json() as { items: { id: string; statistics: { viewCount: string } }[] };
    
    // Build a map of videoId -> viewCount
    const statsMap = new Map(
      statsData.items.map((item) => [item.id, item.statistics.viewCount])
    );
    
    // Merge search data + stats into allVideos
    const allVideos: YouTubeVideo[] = youtubeData.items.map((item: YouTubeVideoItem) => ({
      id: item.id.videoId,
      title: item.snippet.title,
      description: item.snippet.description,
      thumbnailUrl: item.snippet.thumbnails.medium.url,
      channelTitle: item.snippet.channelTitle,
      channelId: item.snippet.channelId,
      publishedAt: item.snippet.publishedAt,
      views: statsMap.get(item.id.videoId) || "N/A",
    }));
    

    const collection = db.collection("videos");

    // Step 2: Check which videos already exist in parallel
    const existingCheckPromises = allVideos.map(video =>
      videoExists(video.id, userId)
    );
    const existingResults = await Promise.all(existingCheckPromises);

    const existingVideos = allVideos.filter((_, index) => existingResults[index]);
    const newVideos = allVideos.filter((_, index) => !existingResults[index]);

    // Step 3: Generate embeddings and prepare new video documents in parallel
    const embeddingPromises = newVideos.map(video =>
      embedding(video.description)
    );

    const embeddings = await Promise.all(embeddingPromises);

    const videoDocuments = newVideos.map((video, index) => ({
      userId,
      video,
      createdAt: new Date().toISOString(),
      $vector: embeddings[index],
    }));

    // Step 4: Insert only new videos in one batch
    if (videoDocuments.length > 0) {
      await collection.insertMany(videoDocuments);
      console.log(`Saved ${videoDocuments.length} videos to AstraDB`);
    }

    // Step 5: Combine both existing and new videos to return to the user
    const combinedVideos = [...existingVideos, ...newVideos];

    // Step 6: Return response with all relevant videos
    return NextResponse.json({
      message: "YouTube search results fetched successfully",
      videos: combinedVideos,
    });
  } catch (error) {
    console.error("Error processing request", error);
    return NextResponse.json({ error: "Failed to process request" }, { status: 500 });
  }
}
