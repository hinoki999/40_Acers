import OpenAI from "openai";
import { Property, User, Investment } from "@shared/schema";
import { storage } from "./storage";

// the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export interface PropertyRecommendation {
  property: Property;
  score: number;
  reasoning: string;
  investmentPotential: "High" | "Medium" | "Low";
  expectedRoi: string;
}

export interface RiskAssessment {
  overallRisk: "Low" | "Medium" | "High";
  riskScore: number; // 1-100
  factors: {
    location: { score: number; analysis: string };
    market: { score: number; analysis: string };
    property: { score: number; analysis: string };
    tokenization: { score: number; analysis: string };
  };
  recommendations: string[];
  investmentAdvice: string;
}

export interface UserProfile {
  riskTolerance: "Conservative" | "Moderate" | "Aggressive";
  investmentGoals: string[];
  budgetRange: { min: number; max: number };
  preferredLocations: string[];
  propertyTypes: string[];
}

export class AIPropertyRecommendationEngine {
  async generateRecommendations(
    userId: string, 
    userProfile?: UserProfile,
    limit: number = 5
  ): Promise<PropertyRecommendation[]> {
    const properties = await storage.getAllProperties();
    const userInvestments = await storage.getUserInvestments(userId);
    
    if (properties.length === 0) {
      return [];
    }

    // Get user investment history for personalization
    const investmentHistory = userInvestments.map(inv => ({
      propertyType: properties.find(p => p.id === inv.propertyId)?.propertyType,
      amount: inv.shares * Number(inv.sharePrice),
      location: properties.find(p => p.id === inv.propertyId)?.city
    }));

    const prompt = `
    You are an AI real estate investment advisor. Analyze these properties and recommend the best investments for a user.

    User Investment History: ${JSON.stringify(investmentHistory)}
    User Profile: ${JSON.stringify(userProfile || {})}
    
    Available Properties: ${JSON.stringify(properties.map(p => ({
      id: p.id,
      address: p.address,
      city: p.city,
      state: p.state,
      propertyType: p.propertyType,
      propertyValue: p.propertyValue,
      squareFootage: p.squareFootage,
      sharePrice: p.sharePrice,
      maxShares: p.maxShares,
      currentShares: p.currentShares,
      availableShares: p.maxShares - p.currentShares
    })))}

    Provide recommendations in this exact JSON format:
    {
      "recommendations": [
        {
          "propertyId": number,
          "score": number (1-100),
          "reasoning": "detailed explanation",
          "investmentPotential": "High|Medium|Low",
          "expectedRoi": "percentage estimate"
        }
      ]
    }

    Consider: location trends, property value vs market, tokenization efficiency, diversification, user preferences.
    Rank by investment potential and user fit.
    `;

    try {
      const response = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [{ role: "user", content: prompt }],
        response_format: { type: "json_object" },
        temperature: 0.7,
      });

      const result = JSON.parse(response.choices[0].message.content || "{}");
      
      return result.recommendations?.slice(0, limit).map((rec: any) => ({
        property: properties.find(p => p.id === rec.propertyId)!,
        score: rec.score,
        reasoning: rec.reasoning,
        investmentPotential: rec.investmentPotential,
        expectedRoi: rec.expectedRoi
      })).filter((rec: any) => rec.property) || [];
    } catch (error) {
      console.error("AI recommendation error:", error);
      return [];
    }
  }
}

export class InvestmentRiskAssessment {
  async assessPropertyRisk(propertyId: number): Promise<RiskAssessment> {
    const property = await storage.getProperty(propertyId);
    if (!property) {
      throw new Error("Property not found");
    }

    // Get market context
    const allProperties = await storage.getAllProperties();
    const sameStateProperties = allProperties.filter(p => p.state === property.state);
    const sameCityProperties = allProperties.filter(p => p.city === property.city);

    const prompt = `
    You are an AI investment risk analyst. Assess the investment risk for this tokenized real estate property.

    Target Property: ${JSON.stringify({
      address: property.address,
      city: property.city,
      state: property.state,
      propertyType: property.propertyType,
      propertyValue: property.propertyValue,
      squareFootage: property.squareFootage,
      pricePerSqFt: Number(property.propertyValue) / property.squareFootage,
      tokenPrice: property.sharePrice,
      totalTokens: property.maxShares,
      availableTokens: property.maxShares - property.currentShares,
      fundingProgress: (property.currentShares / property.maxShares) * 100
    })}

    Market Context:
    - Similar properties in ${property.state}: ${sameStateProperties.length}
    - Properties in ${property.city}: ${sameCityProperties.length}
    - Average price per sq ft in state: $${sameStateProperties.reduce((sum, p) => sum + (Number(p.propertyValue) / p.squareFootage), 0) / sameStateProperties.length || 0}

    Provide risk assessment in this exact JSON format:
    {
      "overallRisk": "Low|Medium|High",
      "riskScore": number (1-100, where 100 is highest risk),
      "factors": {
        "location": {
          "score": number (1-100),
          "analysis": "location risk analysis"
        },
        "market": {
          "score": number (1-100),
          "analysis": "market conditions analysis"
        },
        "property": {
          "score": number (1-100),
          "analysis": "property-specific risk analysis"
        },
        "tokenization": {
          "score": number (1-100),
          "analysis": "tokenization structure risk analysis"
        }
      },
      "recommendations": ["recommendation1", "recommendation2", "recommendation3"],
      "investmentAdvice": "detailed investment advice"
    }

    Consider: market saturation, property valuation accuracy, liquidity risk, geographic concentration, tokenization model efficiency.
    `;

    try {
      const response = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [{ role: "user", content: prompt }],
        response_format: { type: "json_object" },
        temperature: 0.3,
      });

      const result = JSON.parse(response.choices[0].message.content || "{}");
      return result as RiskAssessment;
    } catch (error) {
      console.error("Risk assessment error:", error);
      return {
        overallRisk: "Medium",
        riskScore: 50,
        factors: {
          location: { score: 50, analysis: "Unable to analyze - using default assessment" },
          market: { score: 50, analysis: "Unable to analyze - using default assessment" },
          property: { score: 50, analysis: "Unable to analyze - using default assessment" },
          tokenization: { score: 50, analysis: "Unable to analyze - using default assessment" }
        },
        recommendations: ["Conduct additional due diligence"],
        investmentAdvice: "Consider consulting with a financial advisor"
      };
    }
  }
}

export class OwnershipVerificationService {
  async verifyFiatOwnership(userId: string, propertyId: number): Promise<{
    isVerified: boolean;
    method: "bank_transfer" | "credit_card" | "wire";
    amount: number;
    transactionId: string;
    timestamp: Date;
  }> {
    // Simulate fiat verification process
    const investments = await storage.getUserInvestments(userId);
    const propertyInvestments = investments.filter(inv => inv.propertyId === propertyId);
    
    return {
      isVerified: propertyInvestments.length > 0,
      method: "bank_transfer",
      amount: propertyInvestments.reduce((sum, inv) => sum + (inv.shares * Number(inv.sharePrice)), 0),
      transactionId: `TX_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date()
    };
  }

  async verifyBlockchainOwnership(userId: string, propertyId: number): Promise<{
    isVerified: boolean;
    walletAddress: string;
    tokenBalance: number;
    contractAddress: string;
    blockchainNetwork: "ethereum" | "polygon" | "bsc";
    lastVerification: Date;
  }> {
    // Simulate blockchain verification
    const investments = await storage.getUserInvestments(userId);
    const propertyInvestments = investments.filter(inv => inv.propertyId === propertyId);
    const totalShares = propertyInvestments.reduce((sum, inv) => sum + inv.shares, 0);
    
    return {
      isVerified: totalShares > 0,
      walletAddress: `0x${Math.random().toString(16).substr(2, 40)}`,
      tokenBalance: totalShares,
      contractAddress: `0x${Math.random().toString(16).substr(2, 40)}`,
      blockchainNetwork: "polygon",
      lastVerification: new Date()
    };
  }

  async generateOwnershipProof(userId: string, propertyId: number): Promise<{
    fiatProof: any;
    blockchainProof: any;
    combinedVerificationScore: number;
    proofDocument: string;
  }> {
    const [fiatProof, blockchainProof] = await Promise.all([
      this.verifyFiatOwnership(userId, propertyId),
      this.verifyBlockchainOwnership(userId, propertyId)
    ]);

    const combinedScore = (fiatProof.isVerified ? 50 : 0) + (blockchainProof.isVerified ? 50 : 0);

    const proofDocument = Buffer.from(JSON.stringify({
      userId,
      propertyId,
      fiatProof,
      blockchainProof,
      verificationScore: combinedScore,
      timestamp: new Date(),
      signature: `PROOF_${Date.now()}`
    })).toString('base64');

    return {
      fiatProof,
      blockchainProof,
      combinedVerificationScore: combinedScore,
      proofDocument
    };
  }
}

export const aiRecommendationEngine = new AIPropertyRecommendationEngine();
export const riskAssessmentService = new InvestmentRiskAssessment();
export const ownershipVerificationService = new OwnershipVerificationService();