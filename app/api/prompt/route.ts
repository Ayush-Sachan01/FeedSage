import { NextRequest, NextResponse } from "next/server";
import fetch from "node-fetch";
import { db } from "@/lib/astraClient";
const { GoogleGenerativeAI } = require("@google/generative-ai");
require("dotenv").config();

interface YouTubeVideo {
  id: string;
  title: string;
  description: string;
  thumbnailUrl: string;
  channelTitle: string;
  channelId: string;
  publishedAt: string;
}

// Initialize Google Gemini client once
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
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
    const youtubeData: any = await youtubeResponse.json();

    if (!youtubeData.items || youtubeData.items.length === 0) {
      return NextResponse.json({ message: "No videos found for the given prompt" }, { status: 404 });
    }

    const allVideos: YouTubeVideo[] = youtubeData.items.map((item: any) => ({
      id: item.id.videoId,
      title: item.snippet.title,
      description: item.snippet.description,
      thumbnailUrl: item.snippet.thumbnails.medium.url,
      channelTitle: item.snippet.channelTitle,
      channelId: item.snippet.channelId,
      publishedAt: item.snippet.publishedAt,
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
