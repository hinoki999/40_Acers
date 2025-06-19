import { Router } from "express";
import { z } from "zod";
import { PaymentService } from "./paymentService";
import { storage } from "./storage";
import { isAuthenticated } from "./replitAuth";

const router = Router();

// Create investment payment intent
router.post("/create-investment-intent", isAuthenticated, async (req: any, res) => {
  try {
    const schema = z.object({
      propertyId: z.number(),
      amount: z.number().positive(),
      shares: z.number().positive(),
    });

    const { propertyId, amount, shares } = schema.parse(req.body);
    const userId = req.user.claims.sub;

    // Verify property exists and has available shares
    const property = await storage.getProperty(propertyId);
    if (!property) {
      return res.status(404).json({ message: "Property not found" });
    }

    const availableShares = property.maxShares - property.currentShares;
    if (shares > availableShares) {
      return res.status(400).json({ message: "Not enough shares available" });
    }

    const result = await PaymentService.createInvestmentPaymentIntent(
      userId,
      propertyId,
      amount,
      shares
    );

    res.json(result);
  } catch (error: any) {
    console.error("Payment intent creation error:", error);
    res.status(400).json({ message: error.message || "Failed to create payment intent" });
  }
});

// Confirm payment success
router.post("/confirm-payment", isAuthenticated, async (req: any, res) => {
  try {
    const schema = z.object({
      paymentIntentId: z.string(),
    });

    const { paymentIntentId } = schema.parse(req.body);

    await PaymentService.processSuccessfulPayment(paymentIntentId);

    res.json({ success: true, message: "Payment confirmed successfully" });
  } catch (error: any) {
    console.error("Payment confirmation error:", error);
    res.status(400).json({ message: error.message || "Failed to confirm payment" });
  }
});

// Get payment history
router.get("/history", isAuthenticated, async (req: any, res) => {
  try {
    const userId = req.user.claims.sub;
    const transactions = await PaymentService.getPaymentHistory(userId);
    res.json(transactions);
  } catch (error: any) {
    console.error("Payment history error:", error);
    res.status(500).json({ message: "Failed to fetch payment history" });
  }
});

// Export transaction data as CSV
router.get("/export-csv", isAuthenticated, async (req: any, res) => {
  try {
    const userId = req.user.claims.sub;
    const csvData = await PaymentService.generateAccountingCSV(userId);
    
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename="40acres-transactions.csv"');
    res.send(csvData);
  } catch (error: any) {
    console.error("CSV export error:", error);
    res.status(500).json({ message: "Failed to export transaction data" });
  }
});

// Create listing payment intent
router.post("/create-listing-intent", isAuthenticated, async (req: any, res) => {
  try {
    const schema = z.object({
      propertyId: z.number(),
      propertyValue: z.number().positive(),
    });

    const { propertyId, propertyValue } = schema.parse(req.body);
    const userId = req.user.claims.sub;

    // Check if user has business permissions
    const user = await storage.getUser(userId);
    if (!user || user.userType !== 'business') {
      return res.status(403).json({ message: "Only business users can list properties" });
    }

    const result = await PaymentService.createListingPaymentIntent(
      userId,
      propertyId,
      propertyValue
    );

    res.json(result);
  } catch (error: any) {
    console.error("Listing payment intent creation error:", error);
    res.status(400).json({ message: error.message || "Failed to create listing payment intent" });
  }
});

export default router;