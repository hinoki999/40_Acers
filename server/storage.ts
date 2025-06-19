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
      .select({ total: sum(investments.investmentAmount) })
      .from(investments)
      .where(eq(investments.userId, userId));
    return Number(result[0]?.total || 0);
  }

  async getUserTotalShares(userId: string): Promise<number> {
    const result = await db
      .select({ total: sum(investments.sharesPurchased) })
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
  // Payment and Wallet operations
  async getUserWallet(userId: string): Promise<Wallet | undefined> {
    const [wallet] = await db.select().from(wallets).where(eq(wallets.userId, userId));
    return wallet || undefined;
  }

  async createWallet(wallet: InsertWallet): Promise<Wallet> {
    const [newWallet] = await db.insert(wallets).values(wallet).returning();
    return newWallet;
  }

  async updateWallet(id: number, updates: Partial<Wallet>): Promise<Wallet> {
    const [wallet] = await db.update(wallets).set(updates).where(eq(wallets.id, id)).returning();
    return wallet;
  }

  async createPaymentTransaction(transaction: InsertPaymentTransaction): Promise<PaymentTransaction> {
    const [paymentTransaction] = await db.insert(paymentTransactions).values(transaction).returning();
    return paymentTransaction;
  }

  async updatePaymentTransaction(id: number, updates: Partial<PaymentTransaction>): Promise<PaymentTransaction> {
    const [transaction] = await db.update(paymentTransactions).set(updates).where(eq(paymentTransactions.id, id)).returning();
    return transaction;
  }

  async updatePaymentTransactionByStripeId(stripePaymentIntentId: string, updates: Partial<PaymentTransaction>): Promise<PaymentTransaction | undefined> {
    const [transaction] = await db.update(paymentTransactions)
      .set(updates)
      .where(eq(paymentTransactions.stripePaymentIntentId, stripePaymentIntentId))
      .returning();
    return transaction || undefined;
  }

  async getPaymentTransactions(userId: string): Promise<PaymentTransaction[]> {
    return await db.select().from(paymentTransactions).where(eq(paymentTransactions.userId, userId)).orderBy(desc(paymentTransactions.createdAt));
  }

  async createWalletTransaction(transaction: InsertWalletTransaction): Promise<WalletTransaction> {
    const [walletTransaction] = await db.insert(walletTransactions).values(transaction).returning();
    return walletTransaction;
  }

  async createListingFee(fee: InsertListingFee): Promise<ListingFee> {
    const [listingFee] = await db.insert(listingFees).values(fee).returning();
    return listingFee;
  }

  async updateListingFeeByPaymentId(paymentTransactionId: number, updates: Partial<ListingFee>): Promise<ListingFee | undefined> {
    const [fee] = await db.update(listingFees)
      .set(updates)
      .where(eq(listingFees.paymentTransactionId, paymentTransactionId))
      .returning();
    return fee || undefined;
  }

  async updatePropertyStatus(propertyId: number, status: string): Promise<void> {
    await db.update(properties).set({ status }).where(eq(properties.id, propertyId));
  }

  // Social Investor operations
  async getSocialInvestors(propertyId?: number): Promise<SocialInvestor[]> {
    if (propertyId) {
      return await db.select().from(socialInvestors).where(eq(socialInvestors.propertyId, propertyId));
    }
    return await db.select().from(socialInvestors);
  }

  async createSocialInvestor(investor: InsertSocialInvestor): Promise<SocialInvestor> {
    const [socialInvestor] = await db.insert(socialInvestors).values(investor).returning();
    return socialInvestor;
  }

  // Withdrawal System operations
  async getUserInvestmentAccount(userId: string): Promise<UserInvestmentAccount | undefined> {
    const [account] = await db.select().from(userInvestmentAccounts).where(eq(userInvestmentAccounts.userId, userId));
    return account || undefined;
  }

  async getWithdrawalRequests(userId: string): Promise<WithdrawalRequest[]> {
    return await db.select().from(withdrawalRequests).where(eq(withdrawalRequests.userId, userId)).orderBy(desc(withdrawalRequests.createdAt));
  }

  async createWithdrawalRequest(request: InsertWithdrawalRequest): Promise<WithdrawalRequest> {
    const [withdrawalRequest] = await db.insert(withdrawalRequests).values(request).returning();
    return withdrawalRequest;
  }

  async updateWithdrawalRequest(id: number, updates: Partial<WithdrawalRequest>): Promise<WithdrawalRequest> {
    const [request] = await db.update(withdrawalRequests).set(updates).where(eq(withdrawalRequests.id, id)).returning();
    return request;
  }

  async getInvestmentTiers(): Promise<InvestmentTier[]> {
    return await db.select().from(investmentTiers);
  }

  async getMilestonePerformance(propertyId?: number): Promise<MilestonePerformance[]> {
    if (propertyId) {
      return await db.select().from(milestonePerformance).where(eq(milestonePerformance.propertyId, propertyId));
    }
    return await db.select().from(milestonePerformance);
  }

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
