import { NextRequest, NextResponse } from "next/server";
import fetch from "node-fetch";
import { db } from "@/lib/astraClient"; 

// Import Google Gemini Generative AI SDK
const { GoogleGenerativeAI } = require("@google/generative-ai");
require('dotenv').config();

// Define YouTube video structure
interface YouTubeVideo {
  id: string;
  title: string;
  description: string;
  thumbnailUrl: string;
  channelTitle: string;
  channelId: string;
  publishedAt: string;
}

// Google Gemini Embedding Function
async function embedding(text: string): Promise<number[]> {
  // Initialize Google Gemini client
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  
  // Use the embeddings model
  const model = genAI.getGenerativeModel({ model: "text-embedding-004" });

  // Perform embedding
  const result = await model.embedContent(text);
  
  return result.embedding.values;
}

// POST route to fetch YouTube data based on user prompt and save to Astra DB
export async function POST(req: NextRequest) {
  const youtubeApiKey: string | undefined = process.env.YOUTUBE_API_KEY;

  // Check if YouTube API key is set
  if (!youtubeApiKey) {
    return NextResponse.json({ error: "YouTube API key is not set" }, { status: 400 });
  }

  try {
    const body = await req.json();
    const { prompt, userId } = body;
    console.log("User Prompt:", prompt, "UserId:", userId);

    // Step 1: Search YouTube using the prompt
    const youtubeSearchUrl = `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${encodeURIComponent(prompt)}&key=${youtubeApiKey}&maxResults=10&type=video&relevanceLanguage=en&videoEmbeddable=true`;

    const youtubeResponse = await fetch(youtubeSearchUrl);
    const youtubeData: any = await youtubeResponse.json();

    // Check if there are items in the response
    if (!youtubeData.items || youtubeData.items.length === 0) {
      return NextResponse.json({ message: "No videos found for the given prompt" }, { status: 404 });
    }

    // Step 2: Process the YouTube data
    const allVideos: YouTubeVideo[] = youtubeData.items.map((item: any) => ({
      id: item.id.videoId,
      title: item.snippet.title,
      description: item.snippet.description,
      thumbnailUrl: item.snippet.thumbnails.medium.url,
      channelTitle: item.snippet.channelTitle,
      channelId: item.snippet.channelId,
      publishedAt: item.snippet.publishedAt,
    }));

    // Step 3: Save videos in Astra DB under the user's document, one by one
    const collection = db.collection("videos");
    const savedVideos: YouTubeVideo[] = [];

   

    for (const video of allVideos) {
      
      const videoDocument = {
        userId,
        video,
        createdAt: new Date().toISOString(),
        $vector: await embedding(video.description), // Generate embedding using Google Gemini
      };

      try {
        // Insert individual video document into Astra DB
        const astraResponse = await collection.insertOne(videoDocument);
        console.log(`Saved video ${video.id} in AstraDB:`, astraResponse);
        savedVideos.push(video);
      } catch (dbError) {
        console.error(`Error saving video ${video.id} to AstraDB:`, dbError);
        // Continue with the next video even if one fails
      }
    }

    // Step 4: Return response (include saved videos array in response)
    return NextResponse.json({
      message: "YouTube search results saved to Astra DB",
      videos: savedVideos, // Return the successfully saved video data
    });

  } catch (error) {
    console.error("Error processing request", error);
    return NextResponse.json({ error: "Failed to process request" }, { status: 500 });
  }
}
