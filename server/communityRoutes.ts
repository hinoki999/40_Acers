import { Express, Request, Response } from "express";
import { db } from "./db";
import { 
  communityPosts, 
  postLikes, 
  postComments, 
  userFollows, 
  userAchievements,
  syncSessions,
  userActivity,
  users 
} from "@shared/schema";
import { eq, desc, and, sql, count } from "drizzle-orm";
import { isAuthenticated } from "./replitAuth";

export function registerCommunityRoutes(app: Express): void {
  
  // Get community feed
  app.get("/api/community/feed", isAuthenticated, async (req: Request, res: Response) => {
    try {
      const userId = req.user?.id;
      const filterType = req.query.filterType as string || "all";
      
      let query = db
        .select({
          id: communityPosts.id,
          authorId: communityPosts.authorId,
          type: communityPosts.type,
          title: communityPosts.title,
          content: communityPosts.content,
          propertyId: communityPosts.propertyId,
          imageUrl: communityPosts.imageUrl,
          likesCount: communityPosts.likesCount,
          commentsCount: communityPosts.commentsCount,
          sharesCount: communityPosts.sharesCount,
          createdAt: communityPosts.createdAt,
          author: {
            firstName: users.firstName,
            lastName: users.lastName,
            profileImageUrl: users.profileImageUrl,
            communityRank: users.communityRank,
            location: users.location,
          }
        })
        .from(communityPosts)
        .leftJoin(users, eq(communityPosts.authorId, users.id))
        .where(eq(communityPosts.isPublic, true))
        .orderBy(desc(communityPosts.createdAt))
        .limit(20);

      const posts = await query;
      
      // Check if user has liked each post
      const postsWithLikes = await Promise.all(
        posts.map(async (post) => {
          const [like] = await db
            .select()
            .from(postLikes)
            .where(and(
              eq(postLikes.postId, post.id),
              eq(postLikes.userId, userId!)
            ));
          
          return {
            ...post,
            isLiked: !!like
          };
        })
      );

      res.json(postsWithLikes);
    } catch (error) {
      console.error("Error fetching community feed:", error);
      res.status(500).json({ error: "Failed to fetch community feed" });
    }
  });

  // Create community post
  app.post("/api/community/posts", isAuthenticated, async (req: Request, res: Response) => {
    try {
      const userId = req.user?.id;
      const { content, type, title, propertyId, imageUrl } = req.body;

      const [post] = await db.insert(communityPosts).values({
        authorId: userId!,
        type: type || "general",
        title: title || "Community Update",
        content,
        propertyId,
        imageUrl,
        isPublic: true
      }).returning();

      // Create user activity
      await db.insert(userActivity).values({
        userId: userId!,
        type: "post",
        title: "Created a community post",
        description: content.substring(0, 100) + "...",
        metadata: { postId: post.id },
        isPublic: true
      });

      res.json(post);
    } catch (error) {
      console.error("Error creating post:", error);
      res.status(500).json({ error: "Failed to create post" });
    }
  });

  // Like/unlike post
  app.post("/api/community/posts/:postId/like", isAuthenticated, async (req: Request, res: Response) => {
    try {
      const userId = req.user?.id;
      const postId = parseInt(req.params.postId);

      // Check if already liked
      const [existingLike] = await db
        .select()
        .from(postLikes)
        .where(and(
          eq(postLikes.postId, postId),
          eq(postLikes.userId, userId!)
        ));

      if (existingLike) {
        // Unlike
        await db.delete(postLikes).where(eq(postLikes.id, existingLike.id));
        await db.update(communityPosts)
          .set({ likesCount: sql`${communityPosts.likesCount} - 1` })
          .where(eq(communityPosts.id, postId));
      } else {
        // Like
        await db.insert(postLikes).values({
          userId: userId!,
          postId,
        });
        await db.update(communityPosts)
          .set({ likesCount: sql`${communityPosts.likesCount} + 1` })
          .where(eq(communityPosts.id, postId));
      }

      res.json({ success: true });
    } catch (error) {
      console.error("Error liking post:", error);
      res.status(500).json({ error: "Failed to like post" });
    }
  });

  // Share post
  app.post("/api/community/posts/:postId/share", isAuthenticated, async (req: Request, res: Response) => {
    try {
      const postId = parseInt(req.params.postId);
      
      await db.update(communityPosts)
        .set({ sharesCount: sql`${communityPosts.sharesCount} + 1` })
        .where(eq(communityPosts.id, postId));

      res.json({ success: true });
    } catch (error) {
      console.error("Error sharing post:", error);
      res.status(500).json({ error: "Failed to share post" });
    }
  });

  // Get community stats
  app.get("/api/community/stats", isAuthenticated, async (req: Request, res: Response) => {
    try {
      const [totalMembers] = await db.select({ count: count() }).from(users);
      const [totalInvested] = await db.select({ 
        total: sql<number>`sum(${users.totalInvestments})` 
      }).from(users);
      
      res.json({
        totalMembers: totalMembers.count,
        totalInvested: totalInvested.total || 0,
        propertiesFunded: 42, // Mock data
      });
    } catch (error) {
      console.error("Error fetching community stats:", error);
      res.status(500).json({ error: "Failed to fetch community stats" });
    }
  });

  // Get leaderboard
  app.get("/api/community/leaderboard/:type", isAuthenticated, async (req: Request, res: Response) => {
    try {
      const type = req.params.type;
      let orderBy;
      
      switch (type) {
        case "investors":
          orderBy = desc(users.totalInvestments);
          break;
        case "earners":
          orderBy = desc(users.totalEarnings);
          break;
        default:
          orderBy = desc(users.communityRank);
      }

      const leaderboard = await db
        .select({
          id: users.id,
          firstName: users.firstName,
          lastName: users.lastName,
          profileImageUrl: users.profileImageUrl,
          totalInvestments: users.totalInvestments,
          totalEarnings: users.totalEarnings,
          communityRank: users.communityRank,
          location: users.location,
          achievementsCount: sql<number>`(select count(*) from ${userAchievements} where ${userAchievements.userId} = ${users.id})`,
          roi: sql<number>`case when ${users.totalInvestments} > 0 then (${users.totalEarnings} / ${users.totalInvestments}) * 100 else 0 end`,
          portfolioValue: sql<number>`${users.totalInvestments} + ${users.totalEarnings}`,
        })
        .from(users)
        .orderBy(orderBy)
        .limit(10);

      res.json(leaderboard);
    } catch (error) {
      console.error("Error fetching leaderboard:", error);
      res.status(500).json({ error: "Failed to fetch leaderboard" });
    }
  });

  // Get recent achievements
  app.get("/api/community/achievements/recent", isAuthenticated, async (req: Request, res: Response) => {
    try {
      const achievements = await db
        .select()
        .from(userAchievements)
        .where(eq(userAchievements.isPublic, true))
        .orderBy(desc(userAchievements.earnedAt))
        .limit(10);

      res.json(achievements);
    } catch (error) {
      console.error("Error fetching achievements:", error);
      res.status(500).json({ error: "Failed to fetch achievements" });
    }
  });

  // Sync endpoints
  app.get("/api/sync/devices", isAuthenticated, async (req: Request, res: Response) => {
    try {
      const userId = req.user?.id;
      
      const devices = await db
        .select()
        .from(syncSessions)
        .where(eq(syncSessions.userId, userId!))
        .orderBy(desc(syncSessions.lastSyncAt));

      // Add mock sync status
      const devicesWithStatus = devices.map(device => ({
        ...device,
        syncStatus: device.isActive ? 'synced' : 'pending'
      }));

      res.json(devicesWithStatus);
    } catch (error) {
      console.error("Error fetching sync devices:", error);
      res.status(500).json({ error: "Failed to fetch sync devices" });
    }
  });

  app.get("/api/sync/status", isAuthenticated, async (req: Request, res: Response) => {
    try {
      const userId = req.user?.id;
      
      const [deviceCount] = await db
        .select({ count: count() })
        .from(syncSessions)
        .where(eq(syncSessions.userId, userId!));

      res.json({
        totalDevices: deviceCount.count,
        lastSync: new Date().toISOString(),
        pendingChanges: 0,
      });
    } catch (error) {
      console.error("Error fetching sync status:", error);
      res.status(500).json({ error: "Failed to fetch sync status" });
    }
  });

  app.post("/api/sync/trigger", isAuthenticated, async (req: Request, res: Response) => {
    try {
      const userId = req.user?.id;
      const { deviceId } = req.body;

      if (deviceId) {
        await db.update(syncSessions)
          .set({ lastSyncAt: new Date() })
          .where(and(
            eq(syncSessions.userId, userId!),
            eq(syncSessions.sessionId, deviceId)
          ));
      } else {
        await db.update(syncSessions)
          .set({ lastSyncAt: new Date() })
          .where(eq(syncSessions.userId, userId!));
      }

      res.json({ success: true });
    } catch (error) {
      console.error("Error triggering sync:", error);
      res.status(500).json({ error: "Failed to trigger sync" });
    }
  });

  app.delete("/api/sync/devices/:deviceId", isAuthenticated, async (req: Request, res: Response) => {
    try {
      const userId = req.user?.id;
      const deviceId = req.params.deviceId;

      await db.delete(syncSessions)
        .where(and(
          eq(syncSessions.userId, userId!),
          eq(syncSessions.sessionId, deviceId)
        ));

      res.json({ success: true });
    } catch (error) {
      console.error("Error disconnecting device:", error);
      res.status(500).json({ error: "Failed to disconnect device" });
    }
  });
}