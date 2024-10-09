interface VideoCardProps {
   
    imageUrl: string;
    title: string;
    channelName: string;
    views: string;
  }
  
  export default function VideoCard({
    
    imageUrl,
    title,
    channelName,
    views,
  }: VideoCardProps) {
    return (
      <div className="w-full max-w-xs rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300 hover:bg-white hover:bg-opacity-5">
        {/* Thumbnail */}
        <div className="relative h-40 w-full">
          <img
            src={imageUrl}
            alt={title}
            className="w-full h-full object-cover rounded-t-lg"
          />
        </div>
  
        {/* Content */}
        <div className="p-4">
          {/* Title */}
          <h3 className="text-white text-lg font-semibold mb-2 line-clamp-2">
            {title}
          </h3>
  
          {/* Channel Info */}
          <div className="flex items-center space-x-2 mb-2">
            <img
              src="https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png"
              alt={channelName}
              className="w-8 h-8 rounded-full"
            />
            <div className="text-gray-400 text-sm">{channelName}</div>
          </div>
  
          {/* Views */}
          <div className="text-gray-500 text-sm">{`${views} views`}</div>
        </div>
      </div>
    );
  }
  