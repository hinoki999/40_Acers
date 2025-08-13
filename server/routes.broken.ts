import axios from "axios";
import type { Express } from "express";
import { createServer, type Server } from "http";
import express from "express";
import Stripe from "stripe";
import multer from "multer";
import path from "path";
import fs from "fs";
import { storage } from "./storage";
import { setupAuth, isAuthenticated } from "./replitAuth";
import PaymentService from "./paymentService";
import { 
  aiRecommendationEngine, 
  riskAssessmentService, 
  ownershipVerificationService 
} from "./aiServices";
import { insertPropertySchema, insertInvestmentSchema, insertTransactionSchema, insertPropertyReportSchema } from "@shared/schema";
import { geocodeAddress } from "./geocoding";
import { getBitcoinPrice } from "./bitcoin";
import { z } from "zod";
import paymentsRouter from "./paymentsRoutes";
import { registerCommunityRoutes } from "./communityRoutes";
import { registerDocumentRoutes } from "./documentRoutes";

const investmentRequestSchema = z.object({
  propertyId: z.number(),
  shares: z.number().positive(),
});

const propertyReportRequestSchema = z.object({
  propertyId: z.number(),
  title: z.string().min(1),
  content: z.string().min(1),
  reportType: z.string().optional(),
  attachments: z.array(z.string()).optional(),
});

// Configure multer for file uploads
const uploadDir = path.join(process.cwd(), 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const multerStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    const { documentType } = req.body;
    const typeDir = path.join(uploadDir, documentType || 'general');
    if (!fs.existsSync(typeDir)) {
      fs.mkdirSync(typeDir, { recursive: true });
    }
    cb(null, typeDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + '-' + file.originalname);
  }
});

const upload = multer({
  storage: multerStorage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = /\.(jpg|jpeg|png|pdf|doc|docx)$/i;
    const extname = allowedTypes.test(path.extname(file.originalname));
    const mimetype = /^(image|application\/pdf|application\/msword|application\/vnd\.openxmlformats-officedocument\.wordprocessingml\.document)/.test(file.mimetype);
    
    if (extname && mimetype) {
      return cb(null, true);
    } else {
      cb(new Error('Only images, PDFs, and Word documents are allowed'));
    }
  }
});

export async function registerRoutes(app: Express): Promise<Server> {
  // Serve uploaded files statically
  app.use('/uploads', (req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    next();
  });
  app.use('/uploads', express.static(uploadDir));

  // File upload route (before auth middleware)
  app.post('/api/upload', upload.array('files', 10), (req: any, res) => {
    try {
      console.log('Upload request received:', req.files?.length || 0, 'files');
      
      if (!req.files || req.files.length === 0) {
        return res.status(400).json({ message: 'No files uploaded' });
      }

      const uploadedFiles = req.files.map((file: any) => ({
        filename: file.filename,
        originalName: file.originalname,
        path: `/uploads/${req.body.documentType || 'general'}/${file.filename}`,
        size: file.size,
        mimetype: file.mimetype
      }));

      console.log('Files uploaded successfully:', uploadedFiles.length);
      
      res.json({
        success: true,
        files: uploadedFiles,
        message: `${uploadedFiles.length} file(s) uploaded successfully`
      });
    } catch (error) {
      console.error('File upload error:', error);
      res.status(500).json({ message: 'File upload failed' });
    }
  });

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

  // User profile update route
  app.put('/api/user/profile', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const { userType, businessName, businessVerified, bio, location, investmentStyle } = req.body;
      
      // Get current user data
      const currentUser = await storage.getUser(userId);
      if (!currentUser) {
        return res.status(404).json({ message: "User not found" });
      }

      // Prepare update data
      const updateData = {
        id: userId,
        email: currentUser.email,
        firstName: currentUser.firstName,
        lastName: currentUser.lastName,
        profileImageUrl: currentUser.profileImageUrl,
        ...req.body, // Include all fields from request body
        updatedAt: new Date()
      };

      // Update user in database
      const updatedUser = await storage.upsertUser(updateData);
      
      console.log(`User ${userId} updated account type to: ${userType}`);
      res.json(updatedUser);
    } catch (error) {
      console.error("Error updating user profile:", error);
      res.status(500).json({ message: "Failed to update user profile" });
    }
  });

  // Property routes
  app.get('/api/properties', async (req, res) => {
    try {
      const allProperties = await storage.getAllProperties();
      const bitcoinPrice = await getBitcoinPrice();
      
      // Apply 49% ownership limit and recalculate token pricing
      const validProperties = allProperties.map(property => {
        const propertyValue = parseFloat(property.propertyValue);
        const squareFootage = property.squareFootage || 1000;
        
        // Formula: Property Value / 49% = Total Token Supply
        const totalTokenSupply = Math.floor(propertyValue / 0.49);
        
        // Token Supply / Square Footage = Token Price per Share
        const tokenPricePerShare = totalTokenSupply / squareFootage;
        
        // Max shares for 49% ownership
        const maxSharesFor49Percent = Math.floor(squareFootage * 0.49);
        
        // Check if 49% is still available
        const remainingShares = maxSharesFor49Percent - property.currentShares;
        const canOffer49Percent = remainingShares > 0;
        
        return {
          ...property,
          sharePrice: tokenPricePerShare.toFixed(2),
          maxShares: maxSharesFor49Percent,
          totalTokenSupply,
          tokenPricePerShare: tokenPricePerShare.toFixed(2),
          maxOwnershipAvailable: canOffer49Percent ? 49 : 0,
          remainingShares49Percent: Math.max(0, remainingShares),
          ownershipValue49Percent: propertyValue * 0.49,
          sharePriceBtc: bitcoinPrice ? tokenPricePerShare / bitcoinPrice : null,
          bitcoinPrice
        };
      }).filter(property => property.maxOwnershipAvailable > 0);
      
      res.json(validProperties);
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
      
      // Apply token pricing formula: Property Value / 49% = Token Supply
      const propertyValue = parseFloat(propertyData.propertyValue);
      const squareFootage = propertyData.squareFootage || 1000;
      
      const totalTokenSupply = Math.floor(propertyValue / 0.49);
      const tokenPricePerShare = totalTokenSupply / squareFootage;
      const maxSharesFor49Percent = Math.floor(squareFootage * 0.49);
      
      const propertyWithCoords = {
        ...propertyData,
        latitude: coordinates?.latitude?.toString() || null,
        longitude: coordinates?.longitude?.toString() || null,
        status: 'pending',
        verificationStatus: 'pending',
        sharePrice: tokenPricePerShare.toFixed(2),
        maxShares: maxSharesFor49Percent,
        currentShares: 0
      };
      
      const property = await storage.createProperty(propertyWithCoords);
      
      res.status(201).json({
        ...property,
        totalTokenSupply,
        tokenPricePerShare: tokenPricePerShare.toFixed(2),
        maxOwnershipOffered: 49,
        ownershipValue49Percent: propertyValue * 0.49,
        calculationFormula: {
          step1: `Property Value ($${propertyValue.toLocaleString()}) ÷ 49% = ${totalTokenSupply.toLocaleString()} total tokens`,
          step2: `Total Tokens (${totalTokenSupply.toLocaleString()}) ÷ Square Footage (${squareFootage.toLocaleString()}) = $${tokenPricePerShare.toFixed(2)} per token`,
          step3: `Max Shares for 49% = ${maxSharesFor49Percent.toLocaleString()} tokens`
        }
      });
    } catch (error) {
      console.error("Error creating property:", error);
      res.status(500).json({ message: "Failed to create property" });
    }
  });

  // Property Reports routes
  app.get('/api/properties/:id/reports', isAuthenticated, async (req: any, res) => {
    try {
      const propertyId = parseInt(req.params.id);
      const userId = req.user.claims.sub;
      
      // Get property to verify access
      const property = await storage.getProperty(propertyId);
      if (!property) {
        return res.status(404).json({ message: "Property not found" });
      }
      
      // Check if user is either property owner or has invested in this property
      const isPropertyOwner = property.ownerId === userId;
      const userInvestments = await storage.getUserInvestments(userId);
      const hasInvested = userInvestments.some(inv => inv.propertyId === propertyId);
      
      if (!isPropertyOwner && !hasInvested) {
        return res.status(403).json({ message: "Access denied. You must be the property owner or an investor to view reports." });
      }
      
      const reports = await storage.getPropertyReports(propertyId);
      res.json(reports);
    } catch (error) {
      console.error("Error fetching property reports:", error);
      res.status(500).json({ message: "Failed to fetch property reports" });
    }
  });

  app.post('/api/properties/:id/reports', isAuthenticated, async (req: any, res) => {
    try {
      const propertyId = parseInt(req.params.id);
      const userId = req.user.claims.sub;
      const reportData = propertyReportRequestSchema.parse(req.body);
      
      // Get property to verify ownership
      const property = await storage.getProperty(propertyId);
      if (!property) {
        return res.status(404).json({ message: "Property not found" });
      }
      
      // Only property owner can send reports
      if (property.ownerId !== userId) {
        return res.status(403).json({ message: "Only property owners can send reports" });
      }
      
      const report = await storage.createPropertyReport({
        propertyId,
        senderId: userId,
        title: reportData.title,
        content: reportData.content,
        reportType: reportData.reportType || 'update',
        attachments: reportData.attachments || [],
      });
      
      res.json(report);
    } catch (error) {
      console.error("Error creating property report:", error);
      res.status(500).json({ message: "Failed to create property report" });
    }
  });

  // Account deletion check route
  app.get('/api/user/can-delete-account', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      
      if (user?.userType === 'business') {
        const hasActiveInvestors = await storage.hasActiveInvestors(userId);
        res.json({ canDelete: !hasActiveInvestors, hasActiveInvestors });
      } else {
        res.json({ canDelete: true, hasActiveInvestors: false });
      }
    } catch (error) {
      console.error("Error checking account deletion eligibility:", error);
      res.status(500).json({ message: "Failed to check account deletion eligibility" });
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

      // Calculate 49% ownership limits
      const propertyValue = parseFloat(property.propertyValue);
      const squareFootage = property.squareFootage || 1000;
      const maxSharesFor49Percent = Math.floor(squareFootage * 0.49);
      const ownershipPercentage = (shares / maxSharesFor49Percent) * 49;
      
      // Enforce minimum meaningful investment (5% of available 49%)
      const minShares = Math.ceil(maxSharesFor49Percent * 0.05);
      if (shares < minShares) {
        return res.status(400).json({ 
          message: "Minimum 5% of available ownership required",
          minShares,
          minInvestment: minShares * parseFloat(property.sharePrice),
          maxOwnershipAvailable: 49
        });
      }

      // Check if enough shares are available within 49% limit
      if (property.currentShares + shares > maxSharesFor49Percent) {
        return res.status(400).json({ 
          message: "Exceeds 49% ownership limit",
          maxShares: maxSharesFor49Percent,
          availableShares: maxSharesFor49Percent - property.currentShares
        });
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

      res.status(201).json({
        ...investment,
        ownershipPercentage: ownershipPercentage.toFixed(3),
        propertyValueOwned: (propertyValue * ownershipPercentage / 100).toLocaleString(),
        tokenDetails: {
          tokenPrice: property.sharePrice,
          tokensOwned: shares,
          maxTokensFor49Percent: maxSharesFor49Percent
        }
      });
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
  
  // Register community routes
  registerCommunityRoutes(app);
  
  // Register document routes
  registerDocumentRoutes(app);
  
  const httpServer = createServer(app);
  return httpServer;
}

// E0G Analytics Routes
app.get('/api/e0g/test', async (req, res) => {
  const e0gData = await e0gAnalytics.monitorBridgeActivity();
  res.json({ success: true, data: e0gData });
});

// ===== E0G CRYPTO INTEGRATION ROUTES =====


// Register E0G routes

// ===== E0G CRYPTO INTEGRATION ROUTES =====


// Register E0G routes

// ===== E0G TRUST INTEGRATION =====
import { e0gTrust } from './e0gIntegration';

// Test E0G connection
app.get('/api/e0g/test', async (req, res) => {
  const isConnected = await e0gTrust.testConnection();
  res.json({ 
    connected: isConnected,
    apiUrl: 'http://134.122.21.37:3001'
  });
});

// Analyze wallet before investment
app.post('/api/e0g/analyze', async (req, res) => {
  try {
    const { walletAddress, propertyId, amount } = req.body;
    
    const analysis = await e0gTrust.analyzeInvestor(
      walletAddress || '0x742d35Cc6634C0532925a3b844Bc9e7595f0fA7b',
      propertyId || 1,
      amount || 10000
    );
    
    res.json({
      success: true,
      ...analysis
    });
  } catch (error: any) {
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
});

console.log('✅ E0G routes added');

const E0G_API = 'http://134.122.21.37:3001';

app.get('/api/e0g/test', async (req, res) => {
  try {
    const response = await axios.get(`${E0G_API}/health`);
    res.json({ 
      connected: true, 
      e0gStatus: response.data 
    });
  } catch (error: any) {
    res.json({ 
      connected: false, 
      error: error.message 
    });
  }
});

app.post('/api/e0g/analyze', async (req, res) => {
  try {
    const { walletAddress, propertyId, amount } = req.body;
    
    const response = await axios.post(
      `${E0G_API}/api/v1/trust/analyze`,
      { 
        walletAddress,
        context: { propertyId, amount }
      },
      { 
        headers: { 
          'X-API-Key': '40ACRES_KEY',
          'Content-Type': 'application/json'
        }
      }
    );
    
    res.json(response.data);
  } catch (error: any) {
    res.status(500).json({ 
      error: error.message 
    });
  }
});

// ===== E0G TRUST API INTEGRATION =====
const E0G_API_URL = 'http://134.122.21.37:3001';
const E0G_API_KEY = '40ACRES_KEY';

app.get('/api/e0g/health', async (req, res) => {
  try {
    const response = await axios.get(`${E0G_API_URL}/health`, { timeout: 5000 });
    res.json({ 
      connected: true, 
      e0gStatus: response.data,
      message: 'E0G Trust API is operational'
    });
  } catch (error: any) {
    res.json({ 
      connected: false, 
      error: error.message,
      message: 'E0G Trust API is not reachable'
    });
  }
});

app.post('/api/e0g/analyze', async (req, res) => {

// ===== E0G TRUST API INTEGRATION =====
  const E0G_API_URL = 'http://134.122.21.37:3001';
  const E0G_API_KEY = '40ACRES_KEY';

  app.get('/api/e0g/health', async (req, res) => {
    try {
      const response = await axios.get(`${E0G_API_URL}/health`, { timeout: 5000 });
      res.json({ 
        connected: true, 
        e0gStatus: response.data,
        message: 'E0G Trust API is operational'
      });
    } catch (error: any) {
      res.json({ 
        connected: false, 
        error: error.message,
        message: 'E0G Trust API is not reachable'
      });
    }
  });

  app.post('/api/e0g/analyze', async (req, res) => {
    try {
      const { walletAddress, propertyId, amount } = req.body;
      
      if (!walletAddress) {
        return res.status(400).json({ error: 'Wallet address required' });
      }
      
      console.log(`Analyzing wallet via E0G: ${walletAddress}`);
      
      const response = await axios.post(
        `${E0G_API_URL}/api/v1/trust/analyze`,
        { 
          walletAddress,
          context: { propertyId, amount }
        },
        { 
          headers: { 
            'X-API-Key': E0G_API_KEY,
            'Content-Type': 'application/json'
          },
          timeout: 5000
        }
      );
      
      res.json({
        success: true,
        ...response.data.result,
        poweredBy: 'E0G Crypto Intelligence'
      });
    } catch (error: any) {
      console.error('E0G analysis error:', error.message);
      res.status(500).json({ 
        success: false,
        error: error.message 
      });
    }
  });

  console.log('✅ E0G Trust API routes registered');
}
