import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Users, 
  MessageCircle, 
  Video, 
  Calendar, 
  FileText,
  Share2,
  Bell,
  Clock,
  UserPlus,
  Settings,
  Phone,
  Monitor,
  Edit3,
  Save,
  Eye,
  Lock,
  Unlock,
  Activity
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface CollaborationSession {
  id: string;
  propertyId: number;
  title: string;
  description: string;
  status: 'active' | 'scheduled' | 'completed';
  participants: Participant[];
  createdBy: string;
  createdAt: string;
  scheduledFor?: string;
  duration?: number;
  documents: SharedDocument[];
  chatMessages: ChatMessage[];
  activityLog: ActivityLog[];
}

interface Participant {
  id: string;
  name: string;
  avatar: string;
  role: 'owner' | 'investor' | 'advisor' | 'viewer';
  status: 'online' | 'offline' | 'away';
  joinedAt?: string;
  permissions: string[];
}

interface SharedDocument {
  id: string;
  name: string;
  type: 'pdf' | 'image' | 'spreadsheet' | 'presentation';
  url: string;
  uploadedBy: string;
  uploadedAt: string;
  isLocked: boolean;
  lockedBy?: string;
  version: number;
  annotations: Annotation[];
}

interface Annotation {
  id: string;
  x: number;
  y: number;
  content: string;
  author: string;
  timestamp: string;
  resolved: boolean;
}

interface ChatMessage {
  id: string;
  userId: string;
  userName: string;
  userAvatar: string;
  content: string;
  timestamp: string;
  type: 'text' | 'file' | 'system';
  mentions?: string[];
}

interface ActivityLog {
  id: string;
  userId: string;
  userName: string;
  action: string;
  details: string;
  timestamp: string;
  type: 'document' | 'chat' | 'meeting' | 'permission';
}

interface RealTimeCollaborationProps {
  isOpen: boolean;
  onClose: () => void;
  propertyId: number;
  currentUser: any;
}

export default function RealTimeCollaboration({ 
  isOpen, 
  onClose, 
  propertyId,
  currentUser 
}: RealTimeCollaborationProps) {
  const [activeTab, setActiveTab] = useState('workspace');
  const [chatMessage, setChatMessage] = useState('');
  const [selectedDocument, setSelectedDocument] = useState<SharedDocument | null>(null);
  const [annotations, setAnnotations] = useState<Annotation[]>([]);
  const [isEditingDocument, setIsEditingDocument] = useState(false);
  const { toast } = useToast();

  // Mock collaboration session data
  const mockSession: CollaborationSession = {
    id: 'session-1',
    propertyId: propertyId,
    title: 'Property Investment Review - 1909 E Ferry Street',
    description: 'Collaborative review of investment documents and due diligence materials',
    status: 'active',
    createdBy: 'owner-1',
    createdAt: '2024-01-15T10:00:00Z',
    participants: [
      {
        id: 'owner-1',
        name: 'Property Owner',
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150',
        role: 'owner',
        status: 'online',
        joinedAt: '2024-01-15T10:00:00Z',
        permissions: ['edit', 'invite', 'manage']
      },
      {
        id: 'investor-1',
        name: 'Sarah Chen',
        avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150',
        role: 'investor',
        status: 'online',
        joinedAt: '2024-01-15T10:15:00Z',
        permissions: ['view', 'comment']
      },
      {
        id: 'advisor-1',
        name: 'Legal Advisor',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
        role: 'advisor',
        status: 'away',
        joinedAt: '2024-01-15T10:30:00Z',
        permissions: ['view', 'comment', 'edit']
      }
    ],
    documents: [
      {
        id: 'doc-1',
        name: 'Property Deed.pdf',
        type: 'pdf',
        url: '/documents/deed.pdf',
        uploadedBy: 'owner-1',
        uploadedAt: '2024-01-15T09:45:00Z',
        isLocked: false,
        version: 1,
        annotations: []
      },
      {
        id: 'doc-2',
        name: 'Financial Analysis.xlsx',
        type: 'spreadsheet',
        url: '/documents/analysis.xlsx',
        uploadedBy: 'advisor-1',
        uploadedAt: '2024-01-15T10:20:00Z',
        isLocked: true,
        lockedBy: 'advisor-1',
        version: 2,
        annotations: []
      },
      {
        id: 'doc-3',
        name: 'Property Photos',
        type: 'image',
        url: '/images/property-gallery',
        uploadedBy: 'owner-1',
        uploadedAt: '2024-01-15T09:30:00Z',
        isLocked: false,
        version: 1,
        annotations: [
          {
            id: 'ann-1',
            x: 150,
            y: 200,
            content: 'Need to address this foundation issue before listing',
            author: 'advisor-1',
            timestamp: '2024-01-15T10:45:00Z',
            resolved: false
          }
        ]
      }
    ],
    chatMessages: [
      {
        id: 'msg-1',
        userId: 'owner-1',
        userName: 'Property Owner',
        userAvatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150',
        content: 'Welcome everyone! Let\'s review the property documents and discuss the investment opportunity.',
        timestamp: '2024-01-15T10:00:00Z',
        type: 'text'
      },
      {
        id: 'msg-2',
        userId: 'investor-1',
        userName: 'Sarah Chen',
        userAvatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150',
        content: 'Thanks for including me! I\'ve reviewed the initial documents. The location looks very promising.',
        timestamp: '2024-01-15T10:16:00Z',
        type: 'text'
      },
      {
        id: 'msg-3',
        userId: 'advisor-1',
        userName: 'Legal Advisor',
        userAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
        content: 'I\'ve uploaded the updated financial analysis. Please review the cash flow projections.',
        timestamp: '2024-01-15T10:32:00Z',
        type: 'text'
      }
    ],
    activityLog: [
      {
        id: 'act-1',
        userId: 'owner-1',
        userName: 'Property Owner',
        action: 'uploaded',
        details: 'Property Deed.pdf',
        timestamp: '2024-01-15T09:45:00Z',
        type: 'document'
      },
      {
        id: 'act-2',
        userId: 'advisor-1',
        userName: 'Legal Advisor',
        action: 'joined',
        details: 'collaboration session',
        timestamp: '2024-01-15T10:30:00Z',
        type: 'meeting'
      },
      {
        id: 'act-3',
        userId: 'investor-1',
        userName: 'Sarah Chen',
        action: 'added annotation',
        details: 'Property Photos',
        timestamp: '2024-01-15T10:45:00Z',
        type: 'document'
      }
    ]
  };

  const handleSendMessage = () => {
    if (!chatMessage.trim()) return;
    
    // Simulate sending message
    setChatMessage('');
    toast({
      title: "Message Sent",
      description: "Your message has been sent to all participants",
    });
  };

  const handleDocumentLock = (documentId: string) => {
    toast({
      title: "Document Locked",
      description: "You now have exclusive editing access to this document",
    });
  };

  const handleAddAnnotation = (x: number, y: number, content: string) => {
    const newAnnotation: Annotation = {
      id: `ann-${Date.now()}`,
      x,
      y,
      content,
      author: currentUser?.name || 'Current User',
      timestamp: new Date().toISOString(),
      resolved: false
    };
    
    setAnnotations(prev => [...prev, newAnnotation]);
    toast({
      title: "Annotation Added",
      description: "Your comment has been added to the document",
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online':
        return 'bg-green-500';
      case 'away':
        return 'bg-yellow-500';
      default:
        return 'bg-gray-500';
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'owner':
        return 'bg-blue-100 text-blue-800';
      case 'investor':
        return 'bg-green-100 text-green-800';
      case 'advisor':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Users className="h-6 w-6" />
            Real-Time Collaboration
          </DialogTitle>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="workspace">Workspace</TabsTrigger>
            <TabsTrigger value="documents">Documents</TabsTrigger>
            <TabsTrigger value="participants">Participants</TabsTrigger>
            <TabsTrigger value="activity">Activity</TabsTrigger>
          </TabsList>

          <TabsContent value="workspace" className="space-y-4">
            <div className="grid grid-cols-3 gap-4">
              {/* Main Content Area */}
              <div className="col-span-2 space-y-4">
                {/* Session Info */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <span>{mockSession.title}</span>
                      <div className="flex items-center gap-2">
                        <Badge className="bg-green-100 text-green-800">
                          <Activity className="h-3 w-3 mr-1" />
                          Active
                        </Badge>
                        <Button size="sm" variant="outline">
                          <Video className="h-4 w-4 mr-1" />
                          Start Video Call
                        </Button>
                      </div>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 mb-4">{mockSession.description}</p>
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <span>Created: {new Date(mockSession.createdAt).toLocaleDateString()}</span>
                      <span>{mockSession.participants.length} participants</span>
                      <span>{mockSession.documents.length} documents</span>
                    </div>
                  </CardContent>
                </Card>

                {/* Document Viewer */}
                {selectedDocument && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center justify-between">
                        <span>{selectedDocument.name}</span>
                        <div className="flex items-center gap-2">
                          {selectedDocument.isLocked ? (
                            <Badge variant="destructive">
                              <Lock className="h-3 w-3 mr-1" />
                              Locked by {selectedDocument.lockedBy}
                            </Badge>
                          ) : (
                            <Button size="sm" onClick={() => handleDocumentLock(selectedDocument.id)}>
                              <Edit3 className="h-4 w-4 mr-1" />
                              Edit
                            </Button>
                          )}
                          <Button size="sm" variant="outline">
                            <Share2 className="h-4 w-4 mr-1" />
                            Share
                          </Button>
                        </div>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="relative bg-gray-100 h-96 rounded-lg flex items-center justify-center">
                        <div className="text-center">
                          <FileText className="h-16 w-16 text-gray-400 mx-auto mb-2" />
                          <p className="text-gray-600">Document viewer would display here</p>
                          <p className="text-sm text-gray-500">Version {selectedDocument.version}</p>
                        </div>
                        
                        {/* Annotations */}
                        {selectedDocument.annotations.map((annotation) => (
                          <div
                            key={annotation.id}
                            className="absolute bg-yellow-200 border border-yellow-400 rounded p-2 max-w-xs"
                            style={{ left: annotation.x, top: annotation.y }}
                          >
                            <div className="text-xs font-medium mb-1">{annotation.author}</div>
                            <div className="text-sm">{annotation.content}</div>
                            <div className="text-xs text-gray-500 mt-1">
                              {new Date(annotation.timestamp).toLocaleString()}
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Document Grid */}
                <div className="grid grid-cols-3 gap-4">
                  {mockSession.documents.map((doc) => (
                    <Card 
                      key={doc.id} 
                      className={`cursor-pointer hover:shadow-md transition-shadow ${
                        selectedDocument?.id === doc.id ? 'ring-2 ring-blue-500' : ''
                      }`}
                      onClick={() => setSelectedDocument(doc)}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-center gap-3">
                          <FileText className="h-8 w-8 text-blue-500" />
                          <div>
                            <div className="font-medium truncate">{doc.name}</div>
                            <div className="text-sm text-gray-500">v{doc.version}</div>
                          </div>
                        </div>
                        {doc.isLocked && (
                          <Badge variant="destructive" className="mt-2">
                            <Lock className="h-3 w-3 mr-1" />
                            Locked
                          </Badge>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>

              {/* Sidebar */}
              <div className="space-y-4">
                {/* Participants */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <span>Participants</span>
                      <Button size="sm" variant="outline">
                        <UserPlus className="h-4 w-4" />
                      </Button>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {mockSession.participants.map((participant) => (
                        <div key={participant.id} className="flex items-center gap-3">
                          <div className="relative">
                            <Avatar className="h-10 w-10">
                              <AvatarImage src={participant.avatar} />
                              <AvatarFallback>{participant.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                            </Avatar>
                            <div className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-white ${getStatusColor(participant.status)}`} />
                          </div>
                          <div className="flex-1">
                            <div className="font-medium text-sm">{participant.name}</div>
                            <Badge className={getRoleColor(participant.role)}>{participant.role}</Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Chat */}
                <Card>
                  <CardHeader>
                    <CardTitle>Team Chat</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3 mb-4 max-h-60 overflow-y-auto">
                      {mockSession.chatMessages.map((message) => (
                        <div key={message.id} className="flex gap-2">
                          <Avatar className="h-8 w-8">
                            <AvatarImage src={message.userAvatar} />
                            <AvatarFallback>{message.userName.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="font-medium text-sm">{message.userName}</span>
                              <span className="text-xs text-gray-500">
                                {new Date(message.timestamp).toLocaleTimeString()}
                              </span>
                            </div>
                            <p className="text-sm text-gray-700">{message.content}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="flex gap-2">
                      <Input
                        placeholder="Type a message..."
                        value={chatMessage}
                        onChange={(e) => setChatMessage(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                        className="flex-1"
                      />
                      <Button size="sm" onClick={handleSendMessage}>
                        Send
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="documents" className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">Shared Documents</h3>
              <Button>
                <FileText className="h-4 w-4 mr-2" />
                Upload Document
              </Button>
            </div>

            <div className="grid grid-cols-1 gap-4">
              {mockSession.documents.map((doc) => (
                <Card key={doc.id}>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <FileText className="h-10 w-10 text-blue-500" />
                        <div>
                          <div className="font-medium">{doc.name}</div>
                          <div className="text-sm text-gray-500">
                            Uploaded by {doc.uploadedBy} • Version {doc.version} • {new Date(doc.uploadedAt).toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {doc.isLocked ? (
                          <Badge variant="destructive">
                            <Lock className="h-3 w-3 mr-1" />
                            Locked
                          </Badge>
                        ) : (
                          <Badge variant="secondary">
                            <Unlock className="h-3 w-3 mr-1" />
                            Available
                          </Badge>
                        )}
                        <Button size="sm" variant="outline">
                          <Eye className="h-4 w-4 mr-1" />
                          View
                        </Button>
                        <Button size="sm" variant="outline">
                          <Edit3 className="h-4 w-4 mr-1" />
                          Edit
                        </Button>
                      </div>
                    </div>
                    {doc.annotations.length > 0 && (
                      <div className="mt-3 pt-3 border-t">
                        <div className="text-sm text-gray-600">
                          {doc.annotations.length} annotation(s) • {doc.annotations.filter(a => !a.resolved).length} unresolved
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="participants" className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">Session Participants</h3>
              <Button>
                <UserPlus className="h-4 w-4 mr-2" />
                Invite Participant
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {mockSession.participants.map((participant) => (
                <Card key={participant.id}>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="relative">
                        <Avatar className="h-16 w-16">
                          <AvatarImage src={participant.avatar} />
                          <AvatarFallback>{participant.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                        </Avatar>
                        <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white ${getStatusColor(participant.status)}`} />
                      </div>
                      <div>
                        <div className="font-semibold">{participant.name}</div>
                        <Badge className={getRoleColor(participant.role)}>{participant.role}</Badge>
                        <div className="text-sm text-gray-500 mt-1">
                          {participant.status} • Joined {participant.joinedAt ? new Date(participant.joinedAt).toLocaleTimeString() : 'Recently'}
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="text-sm font-medium">Permissions:</div>
                      <div className="flex gap-1 flex-wrap">
                        {participant.permissions.map((permission) => (
                          <Badge key={permission} variant="secondary" className="text-xs">
                            {permission}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div className="flex gap-2 mt-4">
                      <Button size="sm" variant="outline">
                        <MessageCircle className="h-4 w-4 mr-1" />
                        Message
                      </Button>
                      {participant.role !== 'owner' && (
                        <Button size="sm" variant="outline">
                          <Settings className="h-4 w-4 mr-1" />
                          Manage
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="activity" className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">Activity Log</h3>
              <Button variant="outline" size="sm">
                <Bell className="h-4 w-4 mr-2" />
                Notifications
              </Button>
            </div>

            <div className="space-y-3">
              {mockSession.activityLog.map((activity) => (
                <Card key={activity.id}>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-blue-500 rounded-full" />
                      <div className="flex-1">
                        <div className="text-sm">
                          <span className="font-medium">{activity.userName}</span>
                          <span className="text-gray-600"> {activity.action} </span>
                          <span className="font-medium">{activity.details}</span>
                        </div>
                        <div className="text-xs text-gray-500 mt-1">
                          {new Date(activity.timestamp).toLocaleString()}
                        </div>
                      </div>
                      <Badge variant="secondary">{activity.type}</Badge>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}