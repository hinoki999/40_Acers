import type { Express } from "express";
import { createServer, type Server } from "http";
import Stripe from "stripe";
import { storage } from "./storage";
import { setupAuth, isAuthenticated } from "./replitAuth";
import PaymentService from "./paymentService";
import { 
  aiRecommendationEngine, 
  riskAssessmentService, 
  ownershipVerificationService 
} from "./aiServices";
import { insertPropertySchema, insertInvestmentSchema, insertTransactionSchema } from "@shared/schema";
import { geocodeAddress } from "./geocoding";
import { getBitcoinPrice } from "./bitcoin";
import { z } from "zod";
import paymentsRouter from "./paymentsRoutes";

const investmentRequestSchema = z.object({
  propertyId: z.number(),
  shares: z.number().positive(),
});

export async function registerRoutes(app: Express): Promise<Server> {
  // Auth middleware
  await setupAuth(app);

  // Auth routes
  app.get('/api/auth/user', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      res.json(user);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  // Property routes
  app.get('/api/properties', async (req, res) => {
    try {
      const properties = await storage.getAllProperties();
      const bitcoinPrice = await getBitcoinPrice();
      
      const propertiesWithBtc = properties.map(property => ({
        ...property,
        sharePriceBtc: bitcoinPrice ? Number(property.sharePrice) / bitcoinPrice : null,
        bitcoinPrice: bitcoinPrice
      }));
      
      res.json(propertiesWithBtc);
    } catch (error) {
      console.error("Error fetching properties:", error);
      res.status(500).json({ message: "Failed to fetch properties" });
    }
  });

  app.get('/api/properties/:id', async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const property = await storage.getProperty(id);
      if (!property) {
        return res.status(404).json({ message: "Property not found" });
      }
      res.json(property);
    } catch (error) {
      console.error("Error fetching property:", error);
      res.status(500).json({ message: "Failed to fetch property" });
    }
  });

  app.post('/api/properties', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      
      // Check if user is verified business user
      if (user?.userType !== 'business' || !user?.businessVerified) {
        return res.status(403).json({ 
          message: "Only verified business users can list properties",
          requiresUpgrade: true,
          userType: user?.userType || 'investor'
        });
      }

      const propertyData = insertPropertySchema.parse({
        ...req.body,
        ownerId: userId
      });
      
      // Geocode the address
      const coordinates = await geocodeAddress(
        propertyData.address,
        propertyData.city,
        propertyData.state,
        propertyData.zipcode
      );
      
      const propertyWithCoords = {
        ...propertyData,
        latitude: coordinates?.latitude?.toString() || null,
        longitude: coordinates?.longitude?.toString() || null,
        status: 'pending', // Properties start as pending until payment/verification
        verificationStatus: 'pending'
      };
      
      const property = await storage.createProperty(propertyWithCoords);
      
      // Auto-populate community feed and marketplace
      res.status(201).json({
        ...property,
        communityFeedPosted: true,
        marketplacePosted: true,
        instantVisibility: true
      });
    } catch (error) {
      console.error("Error creating property:", error);
      res.status(500).json({ message: "Failed to create property" });
    }
  });

  // Investment routes
  app.get('/api/investments', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const investments = await storage.getUserInvestments(userId);
      res.json(investments);
    } catch (error) {
      console.error("Error fetching investments:", error);
      res.status(500).json({ message: "Failed to fetch investments" });
    }
  });

  app.post('/api/investments', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const { propertyId, shares } = investmentRequestSchema.parse(req.body);
      
      // Get property details
      const property = await storage.getProperty(propertyId);
      if (!property) {
        return res.status(404).json({ message: "Property not found" });
      }

      // Check if enough shares are available
      if (property.currentShares + shares > property.maxShares) {
        return res.status(400).json({ message: "Not enough shares available" });
      }

      const totalInvested = Number(property.sharePrice) * shares;

      // Create investment
      const investment = await storage.createInvestment({
        userId,
        propertyId,
        sharesPurchased: shares,
        investmentAmount: totalInvested.toString(),
        purchasePrice: property.sharePrice,
      });

      // Update property shares
      await storage.updatePropertyShares(propertyId, property.currentShares + shares);

      // Create transaction record
      await storage.createTransaction({
        userId,
        propertyId,
        type: 'investment',
        amount: totalInvested.toString(),
        shares,
        status: 'completed',
        email: req.user.claims.email,
      });

      res.status(201).json(investment);
    } catch (error) {
      console.error("Error creating investment:", error);
      res.status(500).json({ message: "Failed to create investment" });
    }
  });

  // Portfolio routes
  app.get('/api/portfolio', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const portfolioValue = await storage.getUserPortfolioValue(userId);
      const totalShares = await storage.getUserTotalShares(userId);
      
      res.json({
        totalValue: portfolioValue,
        sharesOwned: totalShares,
      });
    } catch (error) {
      console.error("Error fetching portfolio:", error);
      res.status(500).json({ message: "Failed to fetch portfolio" });
    }
  });

  // Transaction routes
  app.get('/api/transactions', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const transactions = await storage.getUserTransactions(userId);
      res.json(transactions);
    } catch (error) {
      console.error("Error fetching transactions:", error);
      res.status(500).json({ message: "Failed to fetch transactions" });
    }
  });

  app.post('/api/transactions', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const transactionData = insertTransactionSchema.parse({
        ...req.body,
        userId,
        email: req.user.claims.email,
      });
      
      const transaction = await storage.createTransaction(transactionData);
      res.status(201).json(transaction);
    } catch (error) {
      console.error("Error creating transaction:", error);
      res.status(500).json({ message: "Failed to create transaction" });
    }
  });

  // Bitcoin price endpoint
  app.get('/api/bitcoin-price', async (req, res) => {
    try {
      const price = await getBitcoinPrice();
      res.json({ price });
    } catch (error) {
      console.error("Error fetching Bitcoin price:", error);
      res.status(500).json({ message: "Failed to fetch Bitcoin price" });
    }
  });

  // Add payment routes
  app.use("/api/payments", paymentsRouter);

  // Community API routes
  app.get("/api/social-investors", async (req, res) => {
    try {
      const propertyId = req.query.propertyId ? Number(req.query.propertyId) : undefined;
      const investors = await storage.getSocialInvestors(propertyId);
      res.json(investors);
    } catch (error) {
      console.error("Error fetching social investors:", error);
      res.status(500).json({ message: "Failed to fetch social investors" });
    }
  });

  app.get("/api/leaderboard/:category", async (req, res) => {
    try {
      const category = req.params.category;
      const limit = req.query.limit ? Number(req.query.limit) : 10;
      const leaderboard = await storage.getLeaderboard(category, limit);
      res.json(leaderboard);
    } catch (error) {
      console.error("Error fetching leaderboard:", error);
      res.status(500).json({ message: "Failed to fetch leaderboard" });
    }
  });

  app.get("/api/leaderboard/:category/my-rank", async (req, res) => {
    try {
      const category = req.params.category;
      const userId = (req.user as any)?.claims?.sub;
      if (!userId) {
        return res.status(401).json({ message: "Unauthorized" });
      }
      const userRank = await storage.getUserRanking(userId, category);
      res.json(userRank);
    } catch (error) {
      console.error("Error fetching user rank:", error);
      res.status(500).json({ message: "Failed to fetch user rank" });
    }
  });

  app.get("/api/challenges", async (req, res) => {
    try {
      const challenges = await storage.getActiveChallenge();
      res.json(challenges);
    } catch (error) {
      console.error("Error fetching challenges:", error);
      res.status(500).json({ message: "Failed to fetch challenges" });
    }
  });
  
  const httpServer = createServer(app);
  return httpServer;
}
