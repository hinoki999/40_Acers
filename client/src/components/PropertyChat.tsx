import { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { 
  MessageSquare, 
  Send, 
  Video, 
  Users, 
  Calendar,
  Clock,
  Phone,
  Share2,
  Settings,
  Mic,
  Camera,
  MoreHorizontal
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";

interface PropertyChatProps {
  propertyId: number;
  propertyAddress: string;
}

interface ChatMessage {
  id: number;
  userId: string;
  userName: string;
  userAvatar?: string;
  message: string;
  timestamp: string;
  type: 'message' | 'zoom_created' | 'user_joined' | 'investment' | 'property_update';
  metadata?: any;
}

interface ZoomRoom {
  id: string;
  roomName: string;
  meetingUrl: string;
  meetingId: string;
  password?: string;
  createdBy: string;
  createdAt: string;
  participants: number;
  isActive: boolean;
  scheduledFor?: string;
}

export default function PropertyChat({ propertyId, propertyAddress }: PropertyChatProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [activeZoomRooms, setActiveZoomRooms] = useState<ZoomRoom[]>([]);
  const [showZoomCreator, setShowZoomCreator] = useState(false);
  const [newZoomName, setNewZoomName] = useState("");
  const [scheduledTime, setScheduledTime] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  const { data: user } = useQuery({
    queryKey: ["/api/auth/user"],
  });

  // WebSocket connection for real-time chat
  useEffect(() => {
    if (!user || !propertyId) return;

    const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
    const wsUrl = `${protocol}//${window.location.host}/ws/chat?propertyId=${propertyId}&userId=${user.id}`;
    
    const ws = new WebSocket(wsUrl);
    
    ws.onopen = () => {
      console.log('Connected to property chat');
    };
    
    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        
        switch (data.type) {
          case 'message_history':
            setMessages(data.messages);
            break;
          case 'new_message':
            setMessages(prev => [...prev, data.message]);
            break;
          case 'zoom_rooms':
            setActiveZoomRooms(data.rooms);
            break;
          case 'zoom_room_created':
            setActiveZoomRooms(prev => [...prev, data.room]);
            break;
          case 'zoom_room_removed':
            setActiveZoomRooms(prev => prev.filter(room => room.id !== data.roomId));
            break;
        }
      } catch (error) {
        console.error('WebSocket message parsing error:', error);
      }
    };
    
    ws.onclose = () => {
      console.log('Disconnected from property chat');
    };
    
    ws.onerror = (error) => {
      console.error('WebSocket error:', error);
    };

    // Cleanup on unmount
    return () => {
      ws.close();
    };
  }, [user, propertyId]);

  // Initialize with mock data for demo
  useEffect(() => {
    const mockMessages: ChatMessage[] = [
      {
        id: 1,
        userId: "user1",
        userName: "Sarah Johnson",
        userAvatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150",
        message: "This property looks amazing! What's the expected rental yield?",
        timestamp: "2024-01-20T10:30:00Z",
        type: "message"
      },
      {
        id: 2,
        userId: "owner",
        userName: "Property Owner",
        userAvatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150",
        message: "Thanks for your interest! Expected rental yield is around 8-10% annually. Happy to discuss more details.",
        timestamp: "2024-01-20T10:32:00Z",
        type: "message"
      },
      {
        id: 3,
        userId: "user2",
        userName: "Mike Chen",
        userAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150",
        message: "Just invested $2,500 in this property! 🎉",
        timestamp: "2024-01-20T10:35:00Z",
        type: "investment",
        metadata: { amount: 2500, shares: 12 }
      },
      {
        id: 4,
        userId: "owner",
        userName: "Property Owner",
        message: "Created Zoom room for property tour - join us now!",
        timestamp: "2024-01-20T10:40:00Z",
        type: "zoom_created",
        metadata: { 
          roomName: "Property Tour - 1909 E Ferry",
          meetingUrl: "https://zoom.us/j/123456789",
          meetingId: "123 456 789",
          password: "tour123"
        }
      }
    ];

    const mockZoomRooms: ZoomRoom[] = [
      {
        id: "room1",
        roomName: "Property Tour - 1909 E Ferry",
        meetingUrl: "https://zoom.us/j/123456789",
        meetingId: "123 456 789",
        password: "tour123",
        createdBy: "Property Owner",
        createdAt: "2024-01-20T10:40:00Z",
        participants: 5,
        isActive: true
      },
      {
        id: "room2",
        roomName: "Investment Q&A Session",
        meetingUrl: "https://zoom.us/j/987654321",
        meetingId: "987 654 321",
        password: "invest2024",
        createdBy: "Sarah Johnson",
        createdAt: "2024-01-20T09:15:00Z",
        participants: 12,
        isActive: true
      }
    ];

    setMessages(mockMessages);
    setActiveZoomRooms(mockZoomRooms);
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = () => {
    if (!newMessage.trim() || !user) return;

    // Send via WebSocket for real-time delivery
    const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
    const wsUrl = `${protocol}//${window.location.host}/ws/chat?propertyId=${propertyId}&userId=${user.id}`;
    
    try {
      const ws = new WebSocket(wsUrl);
      ws.onopen = () => {
        ws.send(JSON.stringify({
          type: 'send_message',
          message: newMessage,
          userName: `${user.firstName} ${user.lastName}` || user.email,
          userAvatar: user.profileImageUrl
        }));
        ws.close();
      };
    } catch (error) {
      console.error('Error sending message:', error);
    }

    setNewMessage("");

    toast({
      title: "Message Sent",
      description: "Your message has been posted to the community.",
    });
  };

  const handleCreateZoom = async () => {
    if (!newZoomName.trim() || !user) return;

    try {
      // Create via API for persistence
      const response = await fetch(`/api/chat/${propertyId}/zoom-rooms`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          roomName: newZoomName,
          scheduledFor: scheduledTime || undefined
        })
      });

      if (response.ok) {
        const zoomRoom = await response.json();
        
        // Also send via WebSocket for real-time updates
        const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
        const wsUrl = `${protocol}//${window.location.host}/ws/chat?propertyId=${propertyId}&userId=${user.id}`;
        
        const ws = new WebSocket(wsUrl);
        ws.onopen = () => {
          ws.send(JSON.stringify({
            type: 'create_zoom',
            roomName: newZoomName,
            scheduledFor: scheduledTime || undefined
          }));
          ws.close();
        };

        setNewZoomName("");
        setScheduledTime("");
        setShowZoomCreator(false);

        toast({
          title: "Zoom Room Created",
          description: `${newZoomName} is ready for participants.`,
        });
      }
    } catch (error) {
      console.error('Error creating zoom room:', error);
      toast({
        title: "Error",
        description: "Failed to create zoom room. Please try again.",
        variant: "destructive"
      });
    }
  };

  const joinZoomRoom = (room: ZoomRoom) => {
    window.open(room.meetingUrl, '_blank');
    toast({
      title: "Joining Zoom",
      description: `Opening ${room.roomName}`,
    });
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);

    if (diffInHours < 1) {
      const minutes = Math.floor(diffInHours * 60);
      return `${minutes}m ago`;
    } else if (diffInHours < 24) {
      return `${Math.floor(diffInHours)}h ago`;
    } else {
      return date.toLocaleDateString();
    }
  };

  const renderMessage = (message: ChatMessage) => {
    switch (message.type) {
      case "investment":
        return (
          <div className="flex items-center gap-2 p-3 bg-green-50 rounded-lg border border-green-200">
            <Avatar className="w-8 h-8">
              <AvatarImage src={message.userAvatar} />
              <AvatarFallback>{message.userName.split(' ').map(n => n[0]).join('')}</AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-green-800">{message.userName}</span>
                <Badge className="bg-green-600">Investment</Badge>
              </div>
              <p className="text-green-700 text-sm">
                Invested ${message.metadata?.amount?.toLocaleString()} ({message.metadata?.shares} shares)
              </p>
            </div>
            <span className="text-xs text-green-600">{formatTimestamp(message.timestamp)}</span>
          </div>
        );

      case "zoom_created":
        return (
          <div className="flex items-center gap-2 p-3 bg-blue-50 rounded-lg border border-blue-200">
            <Avatar className="w-8 h-8">
              <AvatarImage src={message.userAvatar} />
              <AvatarFallback>{message.userName.split(' ').map(n => n[0]).join('')}</AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-blue-800">{message.userName}</span>
                <Badge className="bg-blue-600">Zoom Room</Badge>
              </div>
              <p className="text-blue-700 text-sm">{message.message}</p>
              {message.metadata && (
                <div className="mt-2 p-2 bg-white rounded border">
                  <div className="text-xs text-blue-600 space-y-1">
                    <div>Meeting ID: {message.metadata.meetingId}</div>
                    <div>Password: {message.metadata.password}</div>
                  </div>
                  <Button 
                    size="sm" 
                    className="mt-2 bg-blue-600 hover:bg-blue-700"
                    onClick={() => window.open(message.metadata.meetingUrl, '_blank')}
                  >
                    <Video size={14} className="mr-1" />
                    Join Room
                  </Button>
                </div>
              )}
            </div>
            <span className="text-xs text-blue-600">{formatTimestamp(message.timestamp)}</span>
          </div>
        );

      default:
        return (
          <div className="flex items-start gap-3 p-3 hover:bg-neutral-50 rounded-lg">
            <Avatar className="w-8 h-8">
              <AvatarImage src={message.userAvatar} />
              <AvatarFallback>{message.userName.split(' ').map(n => n[0]).join('')}</AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-neutral-900">{message.userName}</span>
                <span className="text-xs text-neutral-500">{formatTimestamp(message.timestamp)}</span>
              </div>
              <p className="text-neutral-700 text-sm mt-1">{message.message}</p>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* Active Zoom Rooms */}
      {activeZoomRooms.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Video size={20} />
              Active Zoom Rooms ({activeZoomRooms.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {activeZoomRooms.map((room) => (
                <div key={room.id} className="flex items-center justify-between p-3 bg-blue-50 rounded-lg border border-blue-200">
                  <div className="flex-1">
                    <h4 className="font-semibold text-blue-900">{room.roomName}</h4>
                    <div className="text-sm text-blue-700 space-y-1">
                      <div>Created by {room.createdBy} • {room.participants} participants</div>
                      <div className="flex items-center gap-4">
                        <span>ID: {room.meetingId}</span>
                        <span>Password: {room.password}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className="bg-green-600">Live</Badge>
                    <Button 
                      onClick={() => joinZoomRoom(room)}
                      className="bg-blue-600 hover:bg-blue-700"
                    >
                      <Video size={16} className="mr-1" />
                      Join
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Chat Messages */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <MessageSquare size={20} />
              Property Chat
            </CardTitle>
            <Button 
              onClick={() => setShowZoomCreator(!showZoomCreator)}
              className="bg-blue-600 hover:bg-blue-700"
            >
              <Video size={16} className="mr-1" />
              Create Zoom
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {/* Zoom Creator */}
          {showZoomCreator && (
            <div className="mb-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
              <h4 className="font-semibold text-blue-900 mb-3">Create Zoom Room</h4>
              <div className="space-y-3">
                <Input
                  placeholder="Room name (e.g., Property Tour, Q&A Session)"
                  value={newZoomName}
                  onChange={(e) => setNewZoomName(e.target.value)}
                />
                <Input
                  type="datetime-local"
                  placeholder="Schedule for later (optional)"
                  value={scheduledTime}
                  onChange={(e) => setScheduledTime(e.target.value)}
                />
                <div className="flex gap-2">
                  <Button 
                    onClick={handleCreateZoom}
                    disabled={!newZoomName.trim()}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    Create Room
                  </Button>
                  <Button 
                    variant="outline"
                    onClick={() => setShowZoomCreator(false)}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* Messages */}
          <div className="h-96 overflow-y-auto border rounded-lg bg-neutral-50 p-4 space-y-3">
            {messages.map((message) => (
              <div key={message.id}>
                {renderMessage(message)}
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Message Input */}
          <div className="mt-4 flex gap-2">
            <Input
              placeholder="Type your message..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              className="flex-1"
            />
            <Button 
              onClick={handleSendMessage}
              disabled={!newMessage.trim()}
              className="bg-blue-600 hover:bg-blue-700"
            >
              <Send size={16} />
            </Button>
          </div>

          {/* Chat Guidelines */}
          <div className="mt-3 p-3 bg-yellow-50 rounded-lg border border-yellow-200">
            <h5 className="font-semibold text-yellow-800 text-sm mb-1">Community Guidelines</h5>
            <p className="text-yellow-700 text-xs">
              Keep discussions focused on the property and investment opportunity. 
              Be respectful and professional in all communications.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}