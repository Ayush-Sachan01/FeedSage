import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/astraClient"; 


export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { videoId, userId } = body; 
    console.log("Currently Watching Video ID:", videoId);
    console.log("User ID:", userId);


    const videoCollection = db.collection("videos");
    const currentVideo = await videoCollection.findOne({ "video.id": videoId },{projection :{$vector : 1}} );
    console.log(currentVideo);
    if (!currentVideo) {
      return NextResponse.json({ message: "Video not found" }, { status: 404 });
    }

    const currentEmbedding = currentVideo.$vector;

    console.log(currentEmbedding);
    // Step 3: Perform similarity search in Astra DB for recommendations
    
    const similarVideos = await videoCollection
      .find(
        {
          // Exclude the currently watched video from the results
          "video.id": { $ne: videoId },
          userId: userId,
        },
        {
          vector: currentEmbedding, 
          limit: 10,
          
          projection: { $vector: 0 },
          
         
        }
      )
      .toArray();

    return NextResponse.json({
      message: "Recommended similar videos",
      results: similarVideos, 
    });

  } catch (error) {
    console.error("Error processing recommendation request", error);
    return NextResponse.json({ error: "Failed to process recommendation request" }, { status: 500 });
  }
}
