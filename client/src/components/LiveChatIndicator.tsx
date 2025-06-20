import { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { MessageSquare, Video, Users } from "lucide-react";

interface LiveChatIndicatorProps {
  propertyId: number;
}

export default function LiveChatIndicator({ propertyId }: LiveChatIndicatorProps) {
  const [liveData, setLiveData] = useState({
    onlineUsers: 0,
    activeRooms: 0,
    recentMessages: 0
  });

  useEffect(() => {
    // Simulate live data updates
    const interval = setInterval(() => {
      setLiveData({
        onlineUsers: Math.floor(Math.random() * 15) + 3,
        activeRooms: Math.floor(Math.random() * 3),
        recentMessages: Math.floor(Math.random() * 5)
      });
    }, 5000);

    return () => clearInterval(interval);
  }, [propertyId]);

  if (liveData.onlineUsers === 0) return null;

  return (
    <div className="flex items-center gap-2 text-xs">
      <Badge variant="secondary" className="bg-green-100 text-green-800 animate-pulse">
        <Users size={10} className="mr-1" />
        {liveData.onlineUsers} online
      </Badge>
      
      {liveData.activeRooms > 0 && (
        <Badge className="bg-blue-600 animate-pulse">
          <Video size={10} className="mr-1" />
          {liveData.activeRooms} live
        </Badge>
      )}
      
      {liveData.recentMessages > 0 && (
        <Badge variant="outline" className="border-orange-200 text-orange-600">
          <MessageSquare size={10} className="mr-1" />
          {liveData.recentMessages} new
        </Badge>
      )}
    </div>
  );
}