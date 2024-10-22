import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/astraClient"; // Import your Astra DB client

// Route to recommend similar videos based on currently watched video ID
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { videoId, userId } = body; // Assuming your request body contains the currently watched video ID
    console.log("Currently Watching Video ID:", videoId);
    console.log("User ID:", userId);

    // Step 1: Fetch the video data from Astra DB based on videoId
    const videoCollection = db.collection("videos");
    const currentVideo = await videoCollection.findOne({ "video.id": videoId },{projection :{$vector : 1}} );
    console.log(currentVideo);
    if (!currentVideo) {
      return NextResponse.json({ message: "Video not found" }, { status: 404 });
    }

    // Step 2: Retrieve the embedding for the current video
    const currentEmbedding = currentVideo.$vector; // Ensure this matches your document structure
    console.log("This is the current Embedding", currentEmbedding)

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
          vector: currentEmbedding, // Use the retrieved embedding for the search
          limit: 10,
          // Do not include vectors in the output.
          includeSimilarity:true ,
          projection: { $vector: 0 },
          // Sort results by similarity score (assuming you have a score field)
         
        }
      )
      .toArray();

    // Step 4: Return the results
    return NextResponse.json({
      message: "Recommended similar videos",
      results: similarVideos, // Return the matched video data
    });

  } catch (error) {
    console.error("Error processing recommendation request", error);
    return NextResponse.json({ error: "Failed to process recommendation request" }, { status: 500 });
  }
}
