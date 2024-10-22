"use client";
import { useEffect, useState } from "react";

const messages = [
  "Initializing FeedSage engine...",
  "Scanning the web for the best videos...",
  "Filtering content based on your interests...",
  "Almost there! Preparing personalized results..."
];

export default function StoryLoader() {
  const [currentMessage, setCurrentMessage] = useState(messages[0]);
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prevIndex) => (prevIndex + 1) % messages.length);
      setCurrentMessage(messages[index]);
    }, 1500); // Change message every 1.5 seconds

    return () => clearInterval(interval);
  }, [index]);

  return (
    <div className="text-center mt-4">
      <p className="text-lg font-semibold text-gray-400 animate-pulse">
        {currentMessage}
      </p>
    </div>
  );
}
