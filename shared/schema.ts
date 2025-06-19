import {
  pgTable,
  text,
  varchar,
  timestamp,
  jsonb,
  index,
  serial,
  decimal,
  integer,
  boolean,
} from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Session storage table.
// (IMPORTANT) This table is mandatory for Replit Auth, don't drop it.
export const sessions = pgTable(
  "sessions",
  {
    sid: varchar("sid").primaryKey(),
    sess: jsonb("sess").notNull(),
    expire: timestamp("expire").notNull(),
  },
  (table) => [index("IDX_session_expire").on(table.expire)],
);

// User storage table.
// (IMPORTANT) This table is mandatory for Replit Auth, don't drop it.
export const users = pgTable("users", {
  id: varchar("id").primaryKey().notNull(),
  email: varchar("email").unique(),
  firstName: varchar("first_name"),
  lastName: varchar("last_name"),
  profileImageUrl: varchar("profile_image_url"),
  userType: text("user_type").notNull().default("investor"), // 'investor', 'business'
  businessName: text("business_name"),
  businessVerified: boolean("business_verified").notNull().default(false),
  stripeCustomerId: text("stripe_customer_id"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const properties = pgTable("properties", {
  id: serial("id").primaryKey(),
  ownerId: varchar("owner_id").notNull(),
  address: text("address").notNull(),
  city: text("city").notNull(),
  state: text("state").notNull(),
  zipcode: text("zipcode").notNull(),
  latitude: decimal("latitude", { precision: 10, scale: 8 }),
  longitude: decimal("longitude", { precision: 11, scale: 8 }),
  propertyValue: decimal("property_value", { precision: 12, scale: 2 }).notNull(),
  squareFootage: integer("square_footage").notNull(),
  maxShares: integer("max_shares").notNull(),
  sharePrice: decimal("share_price", { precision: 10, scale: 2 }).notNull(),
  currentShares: integer("current_shares").notNull().default(0),
  thumbnailUrl: text("thumbnail_url"),
  propertyType: text("property_type").notNull().default("Townhouse"),
  description: text("description"),
  bedrooms: integer("bedrooms"),
  bathrooms: decimal("bathrooms", { precision: 3, scale: 1 }),
  yearBuilt: integer("year_built"),
  lotSize: decimal("lot_size", { precision: 10, scale: 2 }),
  parking: text("parking"),
  amenities: text("amenities").array(),
  nearbySchools: text("nearby_schools").array(),
  walkScore: integer("walk_score"),
  crimeRating: text("crime_rating"),
  marketTrends: text("market_trends"),
  rentalYield: decimal("rental_yield", { precision: 5, scale: 2 }),
  appreciationRate: decimal("appreciation_rate", { precision: 5, scale: 2 }),
  status: text("status").notNull().default("pending"), // 'pending', 'active', 'funded', 'closed'
  
  // Legal documents
  deedDocuments: text("deed_documents").array(),
  titleDocuments: text("title_documents").array(),
  llcDocuments: text("llc_documents").array(),
  
  // Property media
  propertyImages: text("property_images").array(),
  propertyVideos: text("property_videos").array(),
  
  // Virtual tour
  zoomMeetingUrl: text("zoom_meeting_url"),
  zoomMeetingId: text("zoom_meeting_id"),
  zoomPassword: text("zoom_password"),
  
  // Property status
  verificationStatus: text("verification_status").notNull().default("pending"),
  isActive: boolean("is_active").notNull().default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const investments = pgTable("investments", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").notNull(),
  propertyId: integer("property_id").notNull(),
  sharesPurchased: integer("shares_purchased").notNull(),
  investmentAmount: decimal("investment_amount", { precision: 12, scale: 2 }).notNull(),
  purchasePrice: decimal("purchase_price", { precision: 10, scale: 2 }).notNull(),
  paymentTransactionId: integer("payment_transaction_id"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const transactions = pgTable("transactions", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").notNull(),
  propertyId: integer("property_id"),
  type: text("type").notNull(), // 'investment', 'withdrawal', 'dividend'
  amount: decimal("amount", { precision: 10, scale: 2 }).notNull(),
  shares: integer("shares"),
  status: text("status").notNull().default("pending"), // 'pending', 'completed', 'failed'
  email: varchar("email"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export type UpsertUser = typeof users.$inferInsert;
export type User = typeof users.$inferSelect;

export type Property = typeof properties.$inferSelect;
export type InsertProperty = typeof properties.$inferInsert;

export type Investment = typeof investments.$inferSelect;
export type InsertInvestment = typeof investments.$inferInsert;

export type Transaction = typeof transactions.$inferSelect;
export type InsertTransaction = typeof transactions.$inferInsert;

export const insertPropertySchema = createInsertSchema(properties).omit({
  id: true,
  currentShares: true,
  isActive: true,
  createdAt: true,
  updatedAt: true,
  latitude: true,
  longitude: true,
});

export const insertInvestmentSchema = createInsertSchema(investments).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertTransactionSchema = createInsertSchema(transactions).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

// Social Media Investor Network
export const socialInvestors = pgTable("social_investors", {
  id: serial("id").primaryKey(),
  userId: text("user_id").notNull(),
  propertyId: integer("property_id").notNull().references(() => properties.id),
  platform: text("platform").notNull(), // 'facebook' or 'instagram'
  profileUrl: text("profile_url").notNull(),
  profileImageUrl: text("profile_image_url"),
  displayName: text("display_name").notNull(),
  username: text("username").notNull(),
  investmentAmount: text("investment_amount").notNull(),
  sharesOwned: integer("shares_owned").notNull(),
  investmentDate: timestamp("investment_date").defaultNow().notNull(),
  isPublic: boolean("is_public").default(true).notNull(),
  followerCount: integer("follower_count"),
  verifiedAccount: boolean("verified_account").default(false),
  location: text("location"),
});

export type SocialInvestor = typeof socialInvestors.$inferSelect;
export type InsertSocialInvestor = typeof socialInvestors.$inferInsert;

// Investment Tiers and Withdrawal System
export const investmentTiers = pgTable("investment_tiers", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(), // "Starter", "Builder", "Partner"
  minInvestment: text("min_investment").notNull(),
  maxInvestment: text("max_investment"),
  lockupPeriodMonths: integer("lockup_period_months").notNull(),
  withdrawalFrequencyDays: integer("withdrawal_frequency_days").notNull(),
  earlyWithdrawalPenalty: decimal("early_withdrawal_penalty", { precision: 5, scale: 2 }), // percentage
  benefits: text("benefits").array(),
  description: text("description"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const userInvestmentAccounts = pgTable("user_investment_accounts", {
  id: serial("id").primaryKey(),
  userId: text("user_id").notNull().references(() => users.id),
  tierId: integer("tier_id").notNull().references(() => investmentTiers.id),
  totalInvested: text("total_invested").notNull(),
  availableBalance: text("available_balance").notNull(),
  lockedBalance: text("locked_balance").notNull(),
  lastWithdrawalDate: timestamp("last_withdrawal_date"),
  nextEligibleWithdrawal: timestamp("next_eligible_withdrawal"),
  accountStatus: text("account_status").notNull().default("active"), // active, suspended, closed
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const withdrawalRequests = pgTable("withdrawal_requests", {
  id: serial("id").primaryKey(),
  userId: text("user_id").notNull().references(() => users.id),
  accountId: integer("account_id").notNull().references(() => userInvestmentAccounts.id),
  propertyId: integer("property_id").references(() => properties.id),
  requestedAmount: text("requested_amount").notNull(),
  availableAmount: text("available_amount").notNull(),
  withdrawalType: text("withdrawal_type").notNull(), // "partial", "full", "emergency"
  status: text("status").notNull().default("pending"), // pending, approved, rejected, completed
  processingFee: text("processing_fee"),
  penaltyAmount: text("penalty_amount"),
  netAmount: text("net_amount"),
  reason: text("reason"),
  approvedBy: text("approved_by"),
  approvedAt: timestamp("approved_at"),
  processedAt: timestamp("processed_at"),
  bankDetails: jsonb("bank_details"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const milestonePerformance = pgTable("milestone_performance", {
  id: serial("id").primaryKey(),
  propertyId: integer("property_id").notNull().references(() => properties.id),
  milestoneType: text("milestone_type").notNull(), // "quarterly", "annual", "exit"
  targetDate: timestamp("target_date").notNull(),
  actualDate: timestamp("actual_date"),
  targetReturn: decimal("target_return", { precision: 10, scale: 2 }),
  actualReturn: decimal("actual_return", { precision: 10, scale: 2 }),
  performanceScore: decimal("performance_score", { precision: 5, scale: 2 }), // 0-100
  distributionAmount: text("distribution_amount"),
  distributionDate: timestamp("distribution_date"),
  status: text("status").notNull().default("pending"), // pending, achieved, missed
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow(),
});

export type InvestmentTier = typeof investmentTiers.$inferSelect;
export type InsertInvestmentTier = typeof investmentTiers.$inferInsert;
export type UserInvestmentAccount = typeof userInvestmentAccounts.$inferSelect;
export type InsertUserInvestmentAccount = typeof userInvestmentAccounts.$inferInsert;
export type WithdrawalRequest = typeof withdrawalRequests.$inferSelect;
export type InsertWithdrawalRequest = typeof withdrawalRequests.$inferInsert;
export type MilestonePerformance = typeof milestonePerformance.$inferSelect;
export type InsertMilestonePerformance = typeof milestonePerformance.$inferInsert;

// Payment and Wallet System
export const wallets = pgTable("wallets", {
  id: serial("id").primaryKey(),
  userId: text("user_id").notNull().references(() => users.id),
  balance: text("balance").notNull().default("0"),
  currency: text("currency").notNull().default("USD"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const paymentTransactions = pgTable("payment_transactions", {
  id: serial("id").primaryKey(),
  userId: text("user_id").notNull().references(() => users.id),
  propertyId: integer("property_id").references(() => properties.id),
  stripePaymentIntentId: text("stripe_payment_intent_id"),
  paypalOrderId: text("paypal_order_id"),
  transactionType: text("transaction_type").notNull(), // "listing_fee", "investment", "withdrawal"
  amount: text("amount").notNull(),
  currency: text("currency").notNull().default("USD"),
  status: text("status").notNull().default("pending"), // pending, completed, failed, refunded
  paymentMethod: text("payment_method").notNull(), // "stripe", "paypal"
  receiptUrl: text("receipt_url"),
  receiptNumber: text("receipt_number"),
  metadata: jsonb("metadata"),
  createdAt: timestamp("created_at").defaultNow(),
  completedAt: timestamp("completed_at"),
});

export const walletTransactions = pgTable("wallet_transactions", {
  id: serial("id").primaryKey(),
  walletId: integer("wallet_id").notNull().references(() => wallets.id),
  paymentTransactionId: integer("payment_transaction_id").references(() => paymentTransactions.id),
  transactionType: text("transaction_type").notNull(), // "deposit", "withdrawal", "investment", "return"
  amount: text("amount").notNull(),
  balanceBefore: text("balance_before").notNull(),
  balanceAfter: text("balance_after").notNull(),
  description: text("description"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const listingFees = pgTable("listing_fees", {
  id: serial("id").primaryKey(),
  propertyId: integer("property_id").notNull().references(() => properties.id),
  userId: text("user_id").notNull().references(() => users.id),
  propertyValue: text("property_value").notNull(),
  feePercentage: decimal("fee_percentage", { precision: 5, scale: 2 }).notNull(),
  calculatedFee: text("calculated_fee").notNull(),
  paymentTransactionId: integer("payment_transaction_id").references(() => paymentTransactions.id),
  status: text("status").notNull().default("pending"), // pending, paid, failed
  paidAt: timestamp("paid_at"),
  createdAt: timestamp("created_at").defaultNow(),
});

export type Wallet = typeof wallets.$inferSelect;
export type InsertWallet = typeof wallets.$inferInsert;
export type PaymentTransaction = typeof paymentTransactions.$inferSelect;
export type InsertPaymentTransaction = typeof paymentTransactions.$inferInsert;
export type WalletTransaction = typeof walletTransactions.$inferSelect;
export type InsertWalletTransaction = typeof walletTransactions.$inferInsert;
export type ListingFee = typeof listingFees.$inferSelect;
export type InsertListingFee = typeof listingFees.$inferInsert;

// User profiles for investment preferences
export const userProfiles = pgTable("user_profiles", {
  id: serial("id").primaryKey(),
  userId: text("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  riskTolerance: text("risk_tolerance").notNull().default("moderate"), // "conservative" | "moderate" | "aggressive"
  investmentGoals: text("investment_goals").array().default([]),
  budgetMin: integer("budget_min").default(0),
  budgetMax: integer("budget_max").default(10000),
  preferredLocations: text("preferred_locations").array().default([]),
  propertyTypes: text("property_types").array().default([]),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Challenges for gamification
export const challenges = pgTable("challenges", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  type: text("type").notNull(), // "investment" | "social" | "educational"
  rules: jsonb("rules"),
  rewards: jsonb("rewards"),
  startDate: timestamp("start_date").notNull(),
  endDate: timestamp("end_date").notNull(),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
});

export const challengeParticipants = pgTable("challenge_participants", {
  id: serial("id").primaryKey(),
  challengeId: integer("challenge_id").notNull().references(() => challenges.id, { onDelete: "cascade" }),
  userId: text("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  progress: integer("progress").default(0),
  completed: boolean("completed").default(false),
  joinedAt: timestamp("joined_at").defaultNow(),
});

// Leaderboard for community engagement
export const leaderboard = pgTable("leaderboard", {
  id: serial("id").primaryKey(),
  userId: text("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  category: text("category").notNull(), // "investments" | "social" | "overall"
  score: integer("score").default(0),
  rank: integer("rank").default(0),
  achievements: text("achievements").array().default([]),
  lastUpdated: timestamp("last_updated").defaultNow(),
});

export type UserProfile = typeof userProfiles.$inferSelect;
export type InsertUserProfile = typeof userProfiles.$inferInsert;
export type Challenge = typeof challenges.$inferSelect;
export type InsertChallenge = typeof challenges.$inferInsert;
export type ChallengeParticipant = typeof challengeParticipants.$inferSelect;
export type InsertChallengeParticipant = typeof challengeParticipants.$inferInsert;
export type LeaderboardEntry = typeof leaderboard.$inferSelect;
export type InsertLeaderboardEntry = typeof leaderboard.$inferInsert;
