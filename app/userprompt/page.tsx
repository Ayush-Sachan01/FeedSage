"use client"
import { useState , useEffect, use } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import axios from 'axios';
import VideoCard from '@/components/VideoCard';
import { Youtube, Search, Menu, Bell, User } from "lucide-react"
import { div } from 'framer-motion/client';


interface Video{
    id : string ,
    thumbnailUrl: string;
    title: string;
    channelTitle: string;
    views: string;
}


export default function Component() {
  const [searchQuery, setSearchQuery] = useState('')
  const [loading , setLoading] = useState(false);
  const [videos , setVideos] = useState<Video[]>([])


  const fetchData = async(prompt : string) =>{
    try{
        
        const response = await axios.post('/api/prompt' , {prompt});
        setVideos(response.data.videos);
        console.log(response);
       
    }
    catch(e){
        console.log("There is some fucking error with this shit " , e);
    }
    finally{
        setLoading(false);
    }
  }

  const handleSearch = (e: React.FormEvent) => {
     e.preventDefault(); 
     setLoading(true);
     fetchData(searchQuery);
   
  }

  return (
<div className="min-h-screen bg-gray-900 text-gray-100">
  <nav className="bg-gray-800 py-2 px-4 md:px-6 lg:px-8">
    <div className="max-w-7xl mx-auto flex items-center justify-between">
      <div className="flex items-center">
        <Button variant="ghost" size="icon" className="mr-2 text-gray-300 hover:text-white">
          <Menu className="h-6 w-6" />
        </Button>
        <Youtube className="h-8 w-8 text-red-500 mr-2" />
        <span className="text-xl font-bold">FeedSage</span>
      </div>
      <form onSubmit={handleSearch} className="flex-grow max-w-md mx-4 sm:max-w-xl md:max-w-2xl lg:max-w-3xl">
        <div className="relative">
          <Input
            type="search"
            placeholder="Search"
            className="w-full bg-gray-700 border-gray-600 text-white placeholder-gray-400 pr-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <Button 
            type="submit" 
            size="icon"
            className="absolute right-0 top-0 bg-gray-600 hover:bg-gray-500"
          >
            <Search className="h-4 w-4" />
          </Button>
        </div>
      </form>
      <div className="flex items-center">
        <Button variant="ghost" size="icon" className="text-gray-300 hover:text-white">
          <Bell className="h-6 w-6" />
        </Button>
        <Button variant="ghost" size="icon" className="text-gray-300 hover:text-white ml-2">
          <User className="h-6 w-6" />
        </Button>
      </div>
    </div>
  </nav>
  {/* <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
    <h1 className="text-2xl font-bold mb-4">Welcome to VideoTube</h1>
    <p className="text-gray-400">Use the search bar above to find videos.</p>
  </main> */}

  <div className="container mx-auto p-4">
  {videos && videos.length > 0 ? (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {videos.map((video) => (
        <VideoCard
          key={video.id}
          title={video.title}
          imageUrl={video.thumbnailUrl}
          channelName={video.channelTitle}
          views={video.views}
        />
      ))}
    </div>
  ) : (
    <div className="text-center text-gray-400">
      Try searching to see some results!
    </div>
  )}


  {loading && <div className='text-center'>
    <div>Loading...</div>
    </div>}


    </div>
</div>





  )
}