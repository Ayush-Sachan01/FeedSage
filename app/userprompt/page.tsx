"use client"
import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import axios from 'axios';
import { Youtube, Search, Menu, Bell, User } from "lucide-react"

export default function Component() {
  const [searchQuery, setSearchQuery] = useState('')

  const fetchData = async(prompt : string) =>{
    try{
        const response = await axios.post('/api/prompt' , {prompt});
        const responseData = response.data;
        console.log(responseData);
        return responseData; 
    }
    catch(e){
        console.log("There is some fucking error with this shit " , e);
    }
  }

  const handleSearch = (e: React.FormEvent) => {
     e.preventDefault(); 
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
            <span className="text-xl font-bold">VideoTube</span>
          </div>
          <form onSubmit={handleSearch} className="flex-grow max-w-2xl mx-4">
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
      <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <h1 className="text-2xl font-bold mb-4">Welcome to VideoTube</h1>
        <p className="text-gray-400">Use the search bar above to find videos.</p>
      </main>
    </div>
  )
}