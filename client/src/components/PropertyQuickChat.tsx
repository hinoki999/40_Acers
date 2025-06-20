import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MessageSquare, Video, Users, ExternalLink } from "lucide-react";
import { Link } from "wouter";

interface PropertyQuickChatProps {
  propertyId: number;
  propertyAddress: string;
}

export default function PropertyQuickChat({ propertyId, propertyAddress }: PropertyQuickChatProps) {
  const [onlineUsers] = useState(8); // Mock online users count
  const [activeZoomRooms] = useState(2); // Mock active rooms

  return (
    <Card className="mb-4">
      <CardHeader>
        <CardTitle className="flex items-center justify-between text-lg">
          <div className="flex items-center gap-2">
            <MessageSquare size={20} />
            Property Chat
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="bg-green-100 text-green-800">
              <Users size={12} className="mr-1" />
              {onlineUsers} online
            </Badge>
            {activeZoomRooms > 0 && (
              <Badge className="bg-blue-600">
                <Video size={12} className="mr-1" />
                {activeZoomRooms} live rooms
              </Badge>
            )}
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <p className="text-sm text-neutral-600">
            Join the conversation about {propertyAddress}. Connect with other investors, 
            ask questions, and participate in live property tours.
          </p>
          
          <div className="flex gap-2">
            <Link href={`/community/${propertyId}`}>
              <Button className="bg-blue-600 hover:bg-blue-700">
                <MessageSquare size={16} className="mr-2" />
                Join Chat
              </Button>
            </Link>
            
            {activeZoomRooms > 0 && (
              <Link href={`/community/${propertyId}`}>
                <Button variant="outline" className="border-blue-200 text-blue-600 hover:bg-blue-50">
                  <Video size={16} className="mr-2" />
                  Join Live Tour
                </Button>
              </Link>
            )}
          </div>

          <div className="mt-3 p-2 bg-blue-50 rounded text-xs text-blue-700">
            <strong>Live Features:</strong> Real-time chat, instant Zoom room creation, 
            property Q&A, and investor networking. Chat is active 24/7 with property owners and investors.
          </div>
          
          <div className="mt-2 text-xs text-neutral-500">
            Last activity: 2 minutes ago • Most active: 2-6 PM EST
          </div>
        </div>
      </CardContent>
    </Card>
  );
}