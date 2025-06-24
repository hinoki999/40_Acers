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

  return null;
}