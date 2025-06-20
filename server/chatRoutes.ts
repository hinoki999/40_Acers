import { Express, Request, Response } from "express";
import { WebSocketServer, WebSocket } from "ws";
import { Server } from "http";
import { isAuthenticated } from "./replitAuth";
import { db } from "./db";
import { eq, desc } from "drizzle-orm";

interface ChatMessage {
  id: number;
  propertyId: number;
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
  propertyId: number;
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

interface WebSocketClient {
  ws: WebSocket;
  userId: string;
  propertyId: number;
}

class PropertyChatManager {
  private clients: Map<string, WebSocketClient> = new Map();
  private rooms: Map<string, ZoomRoom[]> = new Map();
  private messages: Map<string, ChatMessage[]> = new Map();

  addClient(clientId: string, client: WebSocketClient) {
    this.clients.set(clientId, client);
    
    // Send existing messages to new client
    const propertyKey = `property_${client.propertyId}`;
    const existingMessages = this.messages.get(propertyKey) || [];
    
    client.ws.send(JSON.stringify({
      type: 'message_history',
      messages: existingMessages.slice(-50) // Send last 50 messages
    }));

    // Send active zoom rooms
    const activeRooms = this.rooms.get(propertyKey) || [];
    client.ws.send(JSON.stringify({
      type: 'zoom_rooms',
      rooms: activeRooms
    }));

    // Notify others about new user
    this.broadcastToProperty(client.propertyId, {
      type: 'user_joined',
      userId: client.userId,
      message: 'joined the chat'
    }, client.userId);
  }

  removeClient(clientId: string) {
    const client = this.clients.get(clientId);
    if (client) {
      this.broadcastToProperty(client.propertyId, {
        type: 'user_left',
        userId: client.userId,
        message: 'left the chat'
      }, client.userId);
    }
    this.clients.delete(clientId);
  }

  broadcastToProperty(propertyId: number, data: any, excludeUserId?: string) {
    this.clients.forEach((client) => {
      if (client.propertyId === propertyId && 
          client.userId !== excludeUserId && 
          client.ws.readyState === WebSocket.OPEN) {
        client.ws.send(JSON.stringify(data));
      }
    });
  }

  addMessage(propertyId: number, message: ChatMessage) {
    const propertyKey = `property_${propertyId}`;
    const messages = this.messages.get(propertyKey) || [];
    messages.push(message);
    
    // Keep only last 100 messages in memory
    if (messages.length > 100) {
      messages.splice(0, messages.length - 100);
    }
    
    this.messages.set(propertyKey, messages);
    
    // Broadcast to all clients in this property
    this.broadcastToProperty(propertyId, {
      type: 'new_message',
      message: message
    });
  }

  addZoomRoom(propertyId: number, room: ZoomRoom) {
    const propertyKey = `property_${propertyId}`;
    const rooms = this.rooms.get(propertyKey) || [];
    rooms.push(room);
    this.rooms.set(propertyKey, rooms);

    // Broadcast new zoom room
    this.broadcastToProperty(propertyId, {
      type: 'zoom_room_created',
      room: room
    });

    // Add system message about zoom room
    const systemMessage: ChatMessage = {
      id: Date.now(),
      propertyId: propertyId,
      userId: room.createdBy,
      userName: 'System',
      message: `Zoom room "${room.roomName}" created`,
      timestamp: new Date().toISOString(),
      type: 'zoom_created',
      metadata: room
    };

    this.addMessage(propertyId, systemMessage);
  }

  getActiveRooms(propertyId: number): ZoomRoom[] {
    const propertyKey = `property_${propertyId}`;
    return this.rooms.get(propertyKey) || [];
  }

  removeZoomRoom(propertyId: number, roomId: string) {
    const propertyKey = `property_${propertyId}`;
    const rooms = this.rooms.get(propertyKey) || [];
    const updatedRooms = rooms.filter(room => room.id !== roomId);
    this.rooms.set(propertyKey, updatedRooms);

    this.broadcastToProperty(propertyId, {
      type: 'zoom_room_removed',
      roomId: roomId
    });
  }
}

const chatManager = new PropertyChatManager();

export function registerChatRoutes(app: Express, server: Server): void {
  // WebSocket server setup
  const wss = new WebSocketServer({ 
    server: server, 
    path: '/ws/chat'
  });

  wss.on('connection', (ws: WebSocket, request) => {
    const url = new URL(request.url!, `http://${request.headers.host}`);
    const propertyId = parseInt(url.searchParams.get('propertyId') || '0');
    const userId = url.searchParams.get('userId') || '';

    if (!propertyId || !userId) {
      ws.close(1008, 'Missing propertyId or userId');
      return;
    }

    const clientId = `${userId}_${propertyId}_${Date.now()}`;
    const client: WebSocketClient = {
      ws,
      userId,
      propertyId
    };

    chatManager.addClient(clientId, client);

    ws.on('message', (data) => {
      try {
        const parsed = JSON.parse(data.toString());
        
        switch (parsed.type) {
          case 'send_message':
            const message: ChatMessage = {
              id: Date.now(),
              propertyId: propertyId,
              userId: userId,
              userName: parsed.userName || 'Unknown User',
              userAvatar: parsed.userAvatar,
              message: parsed.message,
              timestamp: new Date().toISOString(),
              type: 'message'
            };
            chatManager.addMessage(propertyId, message);
            break;

          case 'create_zoom':
            const zoomRoom: ZoomRoom = {
              id: `room_${Date.now()}`,
              propertyId: propertyId,
              roomName: parsed.roomName,
              meetingUrl: `https://zoom.us/j/${Math.floor(Math.random() * 1000000000)}`,
              meetingId: `${Math.floor(Math.random() * 1000)} ${Math.floor(Math.random() * 1000)} ${Math.floor(Math.random() * 1000)}`,
              password: `room${Math.floor(Math.random() * 10000)}`,
              createdBy: userId,
              createdAt: new Date().toISOString(),
              participants: 1,
              isActive: true,
              scheduledFor: parsed.scheduledFor
            };
            chatManager.addZoomRoom(propertyId, zoomRoom);
            break;

          case 'join_zoom':
            // Track zoom room participation
            ws.send(JSON.stringify({
              type: 'zoom_joined',
              roomId: parsed.roomId
            }));
            break;
        }
      } catch (error) {
        console.error('WebSocket message parsing error:', error);
      }
    });

    ws.on('close', () => {
      chatManager.removeClient(clientId);
    });

    ws.on('error', (error) => {
      console.error('WebSocket error:', error);
      chatManager.removeClient(clientId);
    });
  });

  // REST API endpoints
  app.get("/api/chat/:propertyId/messages", isAuthenticated, async (req: Request, res: Response) => {
    try {
      const propertyId = parseInt(req.params.propertyId);
      // In production, this would fetch from database
      // For now, return empty array as messages are handled via WebSocket
      res.json([]);
    } catch (error) {
      console.error('Error fetching chat messages:', error);
      res.status(500).json({ error: 'Failed to fetch messages' });
    }
  });

  app.get("/api/chat/:propertyId/zoom-rooms", isAuthenticated, async (req: Request, res: Response) => {
    try {
      const propertyId = parseInt(req.params.propertyId);
      const activeRooms = chatManager.getActiveRooms(propertyId);
      res.json(activeRooms);
    } catch (error) {
      console.error('Error fetching zoom rooms:', error);
      res.status(500).json({ error: 'Failed to fetch zoom rooms' });
    }
  });

  app.post("/api/chat/:propertyId/zoom-rooms", isAuthenticated, async (req: Request, res: Response) => {
    try {
      const propertyId = parseInt(req.params.propertyId);
      const { roomName, scheduledFor } = req.body;
      const userId = (req as any).user?.id;

      if (!roomName) {
        return res.status(400).json({ error: 'Room name is required' });
      }

      const zoomRoom: ZoomRoom = {
        id: `room_${Date.now()}`,
        propertyId: propertyId,
        roomName: roomName,
        meetingUrl: `https://zoom.us/j/${Math.floor(Math.random() * 1000000000)}`,
        meetingId: `${Math.floor(Math.random() * 1000)} ${Math.floor(Math.random() * 1000)} ${Math.floor(Math.random() * 1000)}`,
        password: `room${Math.floor(Math.random() * 10000)}`,
        createdBy: userId,
        createdAt: new Date().toISOString(),
        participants: 1,
        isActive: true,
        scheduledFor: scheduledFor
      };

      chatManager.addZoomRoom(propertyId, zoomRoom);
      res.json(zoomRoom);
    } catch (error) {
      console.error('Error creating zoom room:', error);
      res.status(500).json({ error: 'Failed to create zoom room' });
    }
  });

  app.delete("/api/chat/:propertyId/zoom-rooms/:roomId", isAuthenticated, async (req: Request, res: Response) => {
    try {
      const propertyId = parseInt(req.params.propertyId);
      const roomId = req.params.roomId;
      
      chatManager.removeZoomRoom(propertyId, roomId);
      res.json({ success: true });
    } catch (error) {
      console.error('Error removing zoom room:', error);
      res.status(500).json({ error: 'Failed to remove zoom room' });
    }
  });
}