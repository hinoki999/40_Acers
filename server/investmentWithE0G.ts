import { e0gAPI } from './e0gAPIService';
import { db } from './db';
import { investments, investmentTrustScores } from '@shared/schema';

export async function createInvestmentWithE0GTrust(
  userId: number,
  propertyId: number,
  amount: number,
  shares: number,
  walletAddress: string
) {
  // Request trust analysis from E0G API
  console.log('🔐 Requesting E0G trust analysis...');
  
  const trustAnalysis = await e0gAPI.requestTrustAnalysis(walletAddress, {
    propertyId,
    investmentAmount: amount
  });
  
  // Check E0G's decision
  if (!trustAnalysis.approved) {
    throw new Error(`Investment blocked by E0G: ${trustAnalysis.recommendation}`);
  }
  
  // Create investment with E0G's trust score
  console.log('✅ E0G approved - Trust Score:', trustAnalysis.trustScore);
  
  const investment = await db.insert(investments).values({
    userId,
    propertyId,
    amount: amount.toString(),
    shares,
    status: 'completed'
  }).returning();
  
  // Store the trust score (but not E0G's proprietary data)
  await db.insert(investmentTrustScores).values({
    investmentId: investment[0].id,
    propertyId,
    userId,
    walletAddress,
    trustScore: trustAnalysis.trustScore.toString(),
    confidenceLevel: trustAnalysis.confidence.toString(),
    riskFlags: [trustAnalysis.riskLevel], // Only the level, not the details
    analysisTimestamp: new Date()
  });
  
  return {
    investment: investment[0],
    trustScore: trustAnalysis.trustScore,
    riskLevel: trustAnalysis.riskLevel,
    recommendation: trustAnalysis.recommendation
  };
}
