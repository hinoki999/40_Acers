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
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const properties = pgTable("properties", {
  id: serial("id").primaryKey(),
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
  zoomMeetingUrl: text("zoom_meeting_url"),
  zoomMeetingId: text("zoom_meeting_id"),
  zoomPassword: text("zoom_password"),
  isActive: boolean("is_active").notNull().default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const investments = pgTable("investments", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").notNull(),
  propertyId: integer("property_id").notNull(),
  sharesOwned: integer("shares_owned").notNull(),
  totalInvested: decimal("total_invested", { precision: 10, scale: 2 }).notNull(),
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
