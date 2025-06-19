import Stripe from "stripe";
import { storage } from "./storage";
import PDFDocument from "pdfkit";
import { createWriteStream } from "fs";
import { promisify } from "util";
import { pipeline } from "stream";

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error('Missing required Stripe secret: STRIPE_SECRET_KEY');
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2023-10-16" as any,
});

export interface PaymentRequest {
  userId: string;
  amount: number;
  currency: string;
  transactionType: "listing_fee" | "investment" | "withdrawal";
  propertyId?: number;
  metadata?: any;
}

export interface PaymentResult {
  clientSecret: string;
  paymentTransactionId: number;
  receiptNumber: string;
}

export class PaymentService {
  // Calculate dynamic listing fees based on property value
  static calculateListingFee(propertyValue: number): { fee: number; percentage: number } {
    let percentage = 0;
    
    if (propertyValue < 100000) {
      percentage = 2.5; // 2.5% for properties under $100k
    } else if (propertyValue < 500000) {
      percentage = 2.0; // 2.0% for properties $100k-$500k
    } else if (propertyValue < 1000000) {
      percentage = 1.5; // 1.5% for properties $500k-$1M
    } else {
      percentage = 1.0; // 1.0% for properties over $1M
    }

    const fee = (propertyValue * percentage) / 100;
    return { fee: Math.round(fee * 100) / 100, percentage }; // Round to 2 decimal places
  }

  // Create payment intent for listings
  static async createListingPaymentIntent(
    userId: string,
    propertyId: number,
    propertyValue: number
  ): Promise<PaymentResult> {
    const { fee, percentage } = this.calculateListingFee(propertyValue);
    const amountCents = Math.round(fee * 100);
    
    // Generate receipt number
    const receiptNumber = `40A-LST-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;

    // Create payment intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amountCents,
      currency: "usd",
      metadata: {
        userId,
        propertyId: propertyId.toString(),
        transactionType: "listing_fee",
        receiptNumber,
        propertyValue: propertyValue.toString(),
        feePercentage: percentage.toString(),
      },
    });

    // Save payment transaction
    const paymentTransaction = await storage.createPaymentTransaction({
      userId,
      propertyId,
      stripePaymentIntentId: paymentIntent.id,
      transactionType: "listing_fee",
      amount: fee.toString(),
      currency: "USD",
      status: "pending",
      paymentMethod: "stripe",
      receiptNumber,
      metadata: {
        propertyValue,
        feePercentage: percentage,
      },
    });

    // Save listing fee record
    await storage.createListingFee({
      propertyId,
      userId,
      propertyValue: propertyValue.toString(),
      feePercentage: percentage,
      calculatedFee: fee.toString(),
      paymentTransactionId: paymentTransaction.id,
      status: "pending",
    });

    return {
      clientSecret: paymentIntent.client_secret!,
      paymentTransactionId: paymentTransaction.id,
      receiptNumber,
    };
  }

  // Create payment intent for investments
  static async createInvestmentPaymentIntent(
    userId: string,
    propertyId: number,
    amount: number,
    shares: number
  ): Promise<PaymentResult> {
    const amountCents = Math.round(amount * 100);
    
    // Generate receipt number
    const receiptNumber = `40A-INV-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;

    // Create payment intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amountCents,
      currency: "usd",
      metadata: {
        userId,
        propertyId: propertyId.toString(),
        transactionType: "investment",
        receiptNumber,
        shares: shares.toString(),
      },
    });

    // Save payment transaction
    const paymentTransaction = await storage.createPaymentTransaction({
      userId,
      propertyId,
      stripePaymentIntentId: paymentIntent.id,
      transactionType: "investment",
      amount: amount.toString(),
      currency: "USD",
      status: "pending",
      paymentMethod: "stripe",
      receiptNumber,
      metadata: {
        shares,
      },
    });

    return {
      clientSecret: paymentIntent.client_secret!,
      paymentTransactionId: paymentTransaction.id,
      receiptNumber,
    };
  }

  // Process successful payment
  static async processSuccessfulPayment(paymentIntentId: string): Promise<void> {
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
    
    if (paymentIntent.status !== "succeeded") {
      throw new Error("Payment not successful");
    }

    const metadata = paymentIntent.metadata;
    const userId = metadata.userId;
    const transactionType = metadata.transactionType as "listing_fee" | "investment";
    const amount = paymentIntent.amount / 100; // Convert from cents

    // Update payment transaction
    const paymentTransaction = await storage.updatePaymentTransactionByStripeId(
      paymentIntentId,
      {
        status: "completed",
        completedAt: new Date(),
      }
    );

    if (!paymentTransaction) {
      throw new Error("Payment transaction not found");
    }

    // Generate receipt
    const receiptUrl = await this.generateReceipt(paymentTransaction);
    
    // Update with receipt URL
    await storage.updatePaymentTransaction(paymentTransaction.id, {
      receiptUrl,
    });

    if (transactionType === "listing_fee") {
      // Approve property listing
      const propertyId = parseInt(metadata.propertyId);
      await storage.updatePropertyStatus(propertyId, "active");
      
      // Update listing fee status
      await storage.updateListingFeeByPaymentId(paymentTransaction.id, {
        status: "paid",
        paidAt: new Date(),
      });
    } else if (transactionType === "investment") {
      // Process investment
      const propertyId = parseInt(metadata.propertyId);
      const shares = parseInt(metadata.shares);
      
      // Create investment record
      await storage.createInvestment({
        userId,
        propertyId,
        sharesPurchased: shares,
        investmentAmount: amount.toString(),
        purchasePrice: (amount / shares).toString(),
        paymentTransactionId: paymentTransaction.id,
      });

      // Update property shares
      await storage.updatePropertyShares(propertyId, shares);

      // Update investor wallet
      await this.updateWallet(userId, amount, "investment", paymentTransaction.id);
      
      // Update property owner wallet
      const property = await storage.getProperty(propertyId);
      if (property) {
        await this.updateWallet(property.ownerId, amount, "deposit", paymentTransaction.id);
      }
    }
  }

  // Update user wallet
  static async updateWallet(
    userId: string,
    amount: number,
    transactionType: "deposit" | "withdrawal" | "investment" | "return",
    paymentTransactionId: number
  ): Promise<void> {
    let wallet = await storage.getUserWallet(userId);
    
    if (!wallet) {
      wallet = await storage.createWallet({
        userId,
        balance: "0",
        currency: "USD",
      });
    }

    const currentBalance = parseFloat(wallet.balance);
    let newBalance = currentBalance;

    if (transactionType === "deposit" || transactionType === "return") {
      newBalance += amount;
    } else if (transactionType === "withdrawal" || transactionType === "investment") {
      newBalance -= amount;
    }

    // Update wallet balance
    await storage.updateWallet(wallet.id, {
      balance: newBalance.toString(),
      updatedAt: new Date(),
    });

    // Create wallet transaction record
    await storage.createWalletTransaction({
      walletId: wallet.id,
      paymentTransactionId,
      transactionType,
      amount: amount.toString(),
      balanceBefore: currentBalance.toString(),
      balanceAfter: newBalance.toString(),
      description: `${transactionType.charAt(0).toUpperCase() + transactionType.slice(1)} via 40 Acres`,
    });
  }

  // Generate PDF receipt
  static async generateReceipt(paymentTransaction: any): Promise<string> {
    return new Promise((resolve, reject) => {
      const doc = new PDFDocument();
      const filename = `receipt-${paymentTransaction.receiptNumber}.pdf`;
      const filepath = `/tmp/${filename}`;
      
      const stream = createWriteStream(filepath);
      doc.pipe(stream);

      // Header
      doc.fontSize(20).text('40 Acres Investment Platform', 50, 50);
      doc.fontSize(16).text('Payment Receipt', 50, 80);
      
      // Receipt details
      doc.fontSize(12);
      doc.text(`Receipt Number: ${paymentTransaction.receiptNumber}`, 50, 120);
      doc.text(`Date: ${new Date().toLocaleDateString()}`, 50, 140);
      doc.text(`Transaction Type: ${paymentTransaction.transactionType.replace('_', ' ').toUpperCase()}`, 50, 160);
      doc.text(`Amount: $${parseFloat(paymentTransaction.amount).toLocaleString()}`, 50, 180);
      doc.text(`Payment Method: ${paymentTransaction.paymentMethod.toUpperCase()}`, 50, 200);
      doc.text(`Status: ${paymentTransaction.status.toUpperCase()}`, 50, 220);
      
      if (paymentTransaction.propertyId) {
        doc.text(`Property ID: ${paymentTransaction.propertyId}`, 50, 240);
      }

      // Footer
      doc.text('Thank you for using 40 Acres!', 50, 300);
      doc.text('For support, contact: support@40acres.com', 50, 320);

      doc.end();

      stream.on('finish', () => {
        // In a real application, upload to cloud storage and return URL
        resolve(`/api/receipts/${filename}`);
      });

      stream.on('error', reject);
    });
  }

  // Get payment history for user
  static async getPaymentHistory(userId: string): Promise<any[]> {
    return await storage.getPaymentTransactions(userId);
  }

  // Generate CSV export for accounting
  static async generateAccountingCSV(userId: string): Promise<string> {
    const transactions = await storage.getPaymentTransactions(userId);
    
    const csvHeader = "Date,Receipt Number,Type,Amount,Status,Property ID,Payment Method\n";
    const csvRows = transactions.map(t => 
      `${new Date(t.createdAt).toISOString().split('T')[0]},${t.receiptNumber},${t.transactionType},${t.amount},${t.status},${t.propertyId || ''},${t.paymentMethod}`
    ).join('\n');
    
    return csvHeader + csvRows;
  }
}

export default PaymentService;