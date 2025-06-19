import {
  users,
  properties,
  investments,
  transactions,
  type User,
  type UpsertUser,
  type Property,
  type InsertProperty,
  type Investment,
  type InsertInvestment,
  type Transaction,
  type InsertTransaction,
} from "@shared/schema";
import { db } from "./db";
import { eq, desc, sum, and } from "drizzle-orm";

// Interface for storage operations
export interface IStorage {
  // User operations
  // (IMPORTANT) these user operations are mandatory for Replit Auth.
  getUser(id: string): Promise<User | undefined>;
  upsertUser(user: UpsertUser): Promise<User>;
  
  // Property operations
  getAllProperties(): Promise<Property[]>;
  getProperty(id: number): Promise<Property | undefined>;
  createProperty(property: InsertProperty): Promise<Property>;
  updatePropertyShares(id: number, shares: number): Promise<void>;
  
  // Investment operations
  getUserInvestments(userId: string): Promise<Investment[]>;
  createInvestment(investment: InsertInvestment): Promise<Investment>;
  getUserPortfolioValue(userId: string): Promise<number>;
  getUserTotalShares(userId: string): Promise<number>;
  
  // Transaction operations
  getUserTransactions(userId: string): Promise<Transaction[]>;
  createTransaction(transaction: InsertTransaction): Promise<Transaction>;
  getAllTransactions(): Promise<Transaction[]>;
  
  // User Profile operations
  getUserProfile(userId: string): Promise<UserProfile | undefined>;
  createUserProfile(profile: InsertUserProfile): Promise<UserProfile>;
  updateUserProfile(userId: string, profile: Partial<InsertUserProfile>): Promise<UserProfile>;
  
  // Challenge operations
  getAllChallenges(): Promise<Challenge[]>;
  getActivechallenge(): Promise<Challenge[]>;
  createChallenge(challenge: InsertChallenge): Promise<Challenge>;
  joinChallenge(challengeId: number, userId: string): Promise<ChallengeParticipant>;
  updateChallengeProgress(challengeId: number, userId: string, progress: number): Promise<void>;
  
  // Leaderboard operations
  getLeaderboard(category: string, limit?: number): Promise<LeaderboardEntry[]>;
  updateUserScore(userId: string, category: string, score: number): Promise<void>;
  getUserRanking(userId: string, category: string): Promise<LeaderboardEntry | undefined>;
}

export class DatabaseStorage implements IStorage {
  // User operations
  // (IMPORTANT) these user operations are mandatory for Replit Auth.

  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(userData)
      .onConflictDoUpdate({
        target: users.id,
        set: {
          ...userData,
          updatedAt: new Date(),
        },
      })
      .returning();
    return user;
  }

  // Property operations
  async getAllProperties(): Promise<Property[]> {
    return await db.select().from(properties).where(eq(properties.isActive, true)).orderBy(desc(properties.createdAt));
  }

  async getProperty(id: number): Promise<Property | undefined> {
    const [property] = await db.select().from(properties).where(eq(properties.id, id));
    return property;
  }

  async createProperty(property: InsertProperty): Promise<Property> {
    const [newProperty] = await db.insert(properties).values(property).returning();
    return newProperty;
  }

  async updatePropertyShares(id: number, shares: number): Promise<void> {
    await db.update(properties).set({ currentShares: shares }).where(eq(properties.id, id));
  }

  // Investment operations
  async getUserInvestments(userId: string): Promise<Investment[]> {
    return await db.select().from(investments).where(eq(investments.userId, userId));
  }

  async createInvestment(investment: InsertInvestment): Promise<Investment> {
    const [newInvestment] = await db.insert(investments).values(investment).returning();
    return newInvestment;
  }

  async getUserPortfolioValue(userId: string): Promise<number> {
    const result = await db
      .select({ total: sum(investments.totalInvested) })
      .from(investments)
      .where(eq(investments.userId, userId));
    return Number(result[0]?.total || 0);
  }

  async getUserTotalShares(userId: string): Promise<number> {
    const result = await db
      .select({ total: sum(investments.sharesOwned) })
      .from(investments)
      .where(eq(investments.userId, userId));
    return Number(result[0]?.total || 0);
  }

  // Transaction operations
  async getUserTransactions(userId: string): Promise<Transaction[]> {
    return await db.select().from(transactions).where(eq(transactions.userId, userId)).orderBy(desc(transactions.createdAt));
  }

  async createTransaction(transaction: InsertTransaction): Promise<Transaction> {
    const [newTransaction] = await db.insert(transactions).values(transaction).returning();
    return newTransaction;
  }

  async getAllTransactions(): Promise<Transaction[]> {
    return await db.select().from(transactions).orderBy(desc(transactions.createdAt));
  }

  // User Profile operations
  async getUserProfile(userId: string): Promise<UserProfile | undefined> {
    const [profile] = await db.select().from(userProfiles).where(eq(userProfiles.userId, userId));
    return profile;
  }

  async createUserProfile(profile: InsertUserProfile): Promise<UserProfile> {
    const [newProfile] = await db.insert(userProfiles).values(profile).returning();
    return newProfile;
  }

  async updateUserProfile(userId: string, profile: Partial<InsertUserProfile>): Promise<UserProfile> {
    const [updatedProfile] = await db
      .update(userProfiles)
      .set({ ...profile, updatedAt: new Date() })
      .where(eq(userProfiles.userId, userId))
      .returning();
    return updatedProfile;
  }

  // Challenge operations
  async getAllChallenges(): Promise<Challenge[]> {
    return await db.select().from(challenges).orderBy(desc(challenges.createdAt));
  }

  async getActiveChallenge(): Promise<Challenge[]> {
    const now = new Date();
    return await db
      .select()
      .from(challenges)
      .where(
        and(
          eq(challenges.isActive, true),
          lte(challenges.startDate, now),
          gte(challenges.endDate, now)
        )
      );
  }

  async createChallenge(challenge: InsertChallenge): Promise<Challenge> {
    const [newChallenge] = await db.insert(challenges).values(challenge).returning();
    return newChallenge;
  }

  async joinChallenge(challengeId: number, userId: string): Promise<ChallengeParticipant> {
    const [participant] = await db
      .insert(challengeParticipants)
      .values({ challengeId, userId })
      .returning();
    return participant;
  }

  async updateChallengeProgress(challengeId: number, userId: string, progress: number): Promise<void> {
    await db
      .update(challengeParticipants)
      .set({ progress, completed: progress >= 100 })
      .where(
        and(
          eq(challengeParticipants.challengeId, challengeId),
          eq(challengeParticipants.userId, userId)
        )
      );
  }

  // Leaderboard operations
  async getLeaderboard(category: string, limit: number = 10): Promise<LeaderboardEntry[]> {
    return await db
      .select()
      .from(leaderboard)
      .where(eq(leaderboard.category, category))
      .orderBy(desc(leaderboard.score))
      .limit(limit);
  }

  async updateUserScore(userId: string, category: string, score: number): Promise<void> {
    const existing = await db
      .select()
      .from(leaderboard)
      .where(and(eq(leaderboard.userId, userId), eq(leaderboard.category, category)));

    if (existing.length > 0) {
      await db
        .update(leaderboard)
        .set({ score, lastUpdated: new Date() })
        .where(and(eq(leaderboard.userId, userId), eq(leaderboard.category, category)));
    } else {
      await db.insert(leaderboard).values({ userId, category, score });
    }

    // Update ranks for this category
    const allEntries = await this.getLeaderboard(category, 1000);
    for (let i = 0; i < allEntries.length; i++) {
      await db
        .update(leaderboard)
        .set({ rank: i + 1 })
        .where(eq(leaderboard.id, allEntries[i].id));
    }
  }

  async getUserRanking(userId: string, category: string): Promise<LeaderboardEntry | undefined> {
    const [entry] = await db
      .select()
      .from(leaderboard)
      .where(and(eq(leaderboard.userId, userId), eq(leaderboard.category, category)));
    return entry;
  }
}

export const storage = new DatabaseStorage();
