import Stripe from "stripe";
import { db } from "./db";
import { paymentMethods, recurringInvestments, paymentTransactions } from "@shared/schema";
import type { InsertPaymentMethod, InsertRecurringInvestment, PaymentMethod } from "@shared/schema";
import { eq, and, lte } from "drizzle-orm";

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error('Missing required Stripe secret: STRIPE_SECRET_KEY');
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2023-10-16",
});

export class EnhancedPaymentService {
  // Payment Methods Management
  async addPaymentMethod(userId: string, paymentMethodId: string): Promise<PaymentMethod> {
    try {
      // Retrieve payment method from Stripe
      const stripePaymentMethod = await stripe.paymentMethods.retrieve(paymentMethodId);
      
      // Set as default if it's the first payment method
      const existingMethods = await db.select()
        .from(paymentMethods)
        .where(eq(paymentMethods.userId, userId));
      
      const isDefault = existingMethods.length === 0;
      
      // If setting as default, update other methods
      if (isDefault && existingMethods.length > 0) {
        await db.update(paymentMethods)
          .set({ isDefault: false })
          .where(eq(paymentMethods.userId, userId));
      }

      const [paymentMethod] = await db.insert(paymentMethods).values({
        userId,
        stripePaymentMethodId: paymentMethodId,
        type: stripePaymentMethod.type,
        last4: stripePaymentMethod.card?.last4 || stripePaymentMethod.us_bank_account?.last4,
        brand: stripePaymentMethod.card?.brand,
        expiryMonth: stripePaymentMethod.card?.exp_month,
        expiryYear: stripePaymentMethod.card?.exp_year,
        isDefault,
        isVerified: true,
        metadata: {
          fingerprint: stripePaymentMethod.card?.fingerprint,
          funding: stripePaymentMethod.card?.funding,
          country: stripePaymentMethod.card?.country
        }
      }).returning();

      return paymentMethod;
    } catch (error) {
      console.error('Failed to add payment method:', error);
      throw error;
    }
  }

  async setDefaultPaymentMethod(userId: string, paymentMethodId: number): Promise<void> {
    try {
      // Remove default from all other methods
      await db.update(paymentMethods)
        .set({ isDefault: false })
        .where(eq(paymentMethods.userId, userId));

      // Set the selected method as default
      await db.update(paymentMethods)
        .set({ isDefault: true })
        .where(and(
          eq(paymentMethods.id, paymentMethodId),
          eq(paymentMethods.userId, userId)
        ));
    } catch (error) {
      console.error('Failed to set default payment method:', error);
      throw error;
    }
  }

  async removePaymentMethod(userId: string, paymentMethodId: number): Promise<void> {
    try {
      const [paymentMethod] = await db.select()
        .from(paymentMethods)
        .where(and(
          eq(paymentMethods.id, paymentMethodId),
          eq(paymentMethods.userId, userId)
        ));

      if (!paymentMethod) {
        throw new Error('Payment method not found');
      }

      // Detach from Stripe
      await stripe.paymentMethods.detach(paymentMethod.stripePaymentMethodId);

      // Remove from database
      await db.delete(paymentMethods)
        .where(and(
          eq(paymentMethods.id, paymentMethodId),
          eq(paymentMethods.userId, userId)
        ));

      // If this was the default method, set another as default
      if (paymentMethod.isDefault) {
        const remainingMethods = await db.select()
          .from(paymentMethods)
          .where(eq(paymentMethods.userId, userId))
          .limit(1);

        if (remainingMethods.length > 0) {
          await this.setDefaultPaymentMethod(userId, remainingMethods[0].id);
        }
      }
    } catch (error) {
      console.error('Failed to remove payment method:', error);
      throw error;
    }
  }

  async getUserPaymentMethods(userId: string): Promise<PaymentMethod[]> {
    try {
      return await db.select()
        .from(paymentMethods)
        .where(eq(paymentMethods.userId, userId))
        .orderBy(paymentMethods.isDefault, paymentMethods.createdAt);
    } catch (error) {
      console.error('Failed to get user payment methods:', error);
      return [];
    }
  }

  // Recurring Investments
  async setupRecurringInvestment(data: {
    userId: string;
    propertyId?: number;
    paymentMethodId: number;
    amount: number;
    frequency: "weekly" | "monthly" | "quarterly";
  }): Promise<any> {
    try {
      // Verify payment method belongs to user
      const [paymentMethod] = await db.select()
        .from(paymentMethods)
        .where(and(
          eq(paymentMethods.id, data.paymentMethodId),
          eq(paymentMethods.userId, data.userId)
        ));

      if (!paymentMethod) {
        throw new Error('Payment method not found');
      }

      // Calculate next payment date
      const nextPaymentDate = this.calculateNextPaymentDate(data.frequency);

      // Create Stripe subscription for recurring payments
      const subscription = await stripe.subscriptions.create({
        customer: await this.getOrCreateStripeCustomer(data.userId),
        items: [{
          price_data: {
            currency: 'usd',
            product_data: {
              name: data.propertyId ? `Property Investment - ${data.propertyId}` : 'General Investment Fund'
            },
            unit_amount: Math.round(data.amount * 100),
            recurring: {
              interval: data.frequency === 'quarterly' ? 'month' : data.frequency,
              interval_count: data.frequency === 'quarterly' ? 3 : 1
            }
          }
        }],
        default_payment_method: paymentMethod.stripePaymentMethodId,
        metadata: {
          userId: data.userId,
          propertyId: data.propertyId?.toString() || '',
          type: 'recurring_investment'
        }
      });

      const [recurringInvestment] = await db.insert(recurringInvestments).values({
        userId: data.userId,
        propertyId: data.propertyId,
        paymentMethodId: data.paymentMethodId,
        amount: data.amount.toString(),
        frequency: data.frequency,
        nextPaymentDate,
        isActive: true
      }).returning();

      return {
        recurringInvestment,
        stripeSubscriptionId: subscription.id
      };
    } catch (error) {
      console.error('Failed to setup recurring investment:', error);
      throw error;
    }
  }

  async pauseRecurringInvestment(userId: string, recurringId: number): Promise<void> {
    try {
      await db.update(recurringInvestments)
        .set({ isActive: false })
        .where(and(
          eq(recurringInvestments.id, recurringId),
          eq(recurringInvestments.userId, userId)
        ));
    } catch (error) {
      console.error('Failed to pause recurring investment:', error);
      throw error;
    }
  }

  async resumeRecurringInvestment(userId: string, recurringId: number): Promise<void> {
    try {
      const nextPaymentDate = new Date();
      nextPaymentDate.setDate(nextPaymentDate.getDate() + 7); // Resume in a week

      await db.update(recurringInvestments)
        .set({ 
          isActive: true,
          nextPaymentDate
        })
        .where(and(
          eq(recurringInvestments.id, recurringId),
          eq(recurringInvestments.userId, userId)
        ));
    } catch (error) {
      console.error('Failed to resume recurring investment:', error);
      throw error;
    }
  }

  // Process due recurring investments (called by cron job)
  async processDueRecurringInvestments(): Promise<void> {
    try {
      const dueInvestments = await db.select()
        .from(recurringInvestments)
        .where(and(
          eq(recurringInvestments.isActive, true),
          lte(recurringInvestments.nextPaymentDate, new Date())
        ));

      for (const investment of dueInvestments) {
        try {
          await this.processRecurringPayment(investment);
        } catch (error) {
          console.error(`Failed to process recurring investment ${investment.id}:`, error);
          await this.handleRecurringPaymentFailure(investment);
        }
      }
    } catch (error) {
      console.error('Failed to process due recurring investments:', error);
    }
  }

  private async processRecurringPayment(investment: any): Promise<void> {
    const [paymentMethod] = await db.select()
      .from(paymentMethods)
      .where(eq(paymentMethods.id, investment.paymentMethodId));

    if (!paymentMethod) {
      throw new Error('Payment method not found');
    }

    // Create payment intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(parseFloat(investment.amount) * 100),
      currency: 'usd',
      payment_method: paymentMethod.stripePaymentMethodId,
      customer: await this.getOrCreateStripeCustomer(investment.userId),
      confirm: true,
      metadata: {
        type: 'recurring_investment',
        recurringInvestmentId: investment.id.toString(),
        userId: investment.userId,
        propertyId: investment.propertyId?.toString() || ''
      }
    });

    if (paymentIntent.status === 'succeeded') {
      // Update recurring investment
      const nextPaymentDate = this.calculateNextPaymentDate(investment.frequency);
      await db.update(recurringInvestments)
        .set({
          nextPaymentDate,
          totalPayments: investment.totalPayments + 1,
          failedPayments: 0, // Reset failed payments on success
          updatedAt: new Date()
        })
        .where(eq(recurringInvestments.id, investment.id));

      // Record successful payment
      await db.insert(paymentTransactions).values({
        userId: investment.userId,
        stripePaymentIntentId: paymentIntent.id,
        amount: investment.amount,
        currency: 'usd',
        status: 'completed',
        transactionType: 'recurring_investment',
        propertyId: investment.propertyId,
        paymentMethod: 'card',
        receiptNumber: `REC-${Date.now()}`,
        metadata: {
          recurringInvestmentId: investment.id,
          paymentNumber: investment.totalPayments + 1
        }
      });
    }
  }

  private async handleRecurringPaymentFailure(investment: any): Promise<void> {
    const failedPayments = investment.failedPayments + 1;
    
    await db.update(recurringInvestments)
      .set({
        failedPayments,
        isActive: failedPayments < 3, // Deactivate after 3 failures
        updatedAt: new Date()
      })
      .where(eq(recurringInvestments.id, investment.id));

    // TODO: Send notification to user about failed payment
  }

  // Advanced Payment Features
  async createSavedPaymentSetup(userId: string): Promise<{ clientSecret: string }> {
    try {
      const setupIntent = await stripe.setupIntents.create({
        customer: await this.getOrCreateStripeCustomer(userId),
        payment_method_types: ['card'],
        usage: 'off_session'
      });

      return { clientSecret: setupIntent.client_secret! };
    } catch (error) {
      console.error('Failed to create setup intent:', error);
      throw error;
    }
  }

  async processOffSessionPayment(userId: string, amount: number, propertyId?: number): Promise<any> {
    try {
      const [defaultPaymentMethod] = await db.select()
        .from(paymentMethods)
        .where(and(
          eq(paymentMethods.userId, userId),
          eq(paymentMethods.isDefault, true)
        ));

      if (!defaultPaymentMethod) {
        throw new Error('No default payment method found');
      }

      const paymentIntent = await stripe.paymentIntents.create({
        amount: Math.round(amount * 100),
        currency: 'usd',
        customer: await this.getOrCreateStripeCustomer(userId),
        payment_method: defaultPaymentMethod.stripePaymentMethodId,
        confirm: true,
        off_session: true,
        metadata: {
          userId,
          propertyId: propertyId?.toString() || '',
          type: 'investment'
        }
      });

      return paymentIntent;
    } catch (error) {
      console.error('Failed to process off-session payment:', error);
      throw error;
    }
  }

  // Utility Methods
  private async getOrCreateStripeCustomer(userId: string): Promise<string> {
    // This would typically involve checking if customer exists and creating if not
    // For now, returning a placeholder - this should be implemented based on your user system
    return `cus_${userId}`;
  }

  private calculateNextPaymentDate(frequency: string): Date {
    const now = new Date();
    switch (frequency) {
      case 'weekly':
        return new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
      case 'monthly':
        const monthly = new Date(now);
        monthly.setMonth(monthly.getMonth() + 1);
        return monthly;
      case 'quarterly':
        const quarterly = new Date(now);
        quarterly.setMonth(quarterly.getMonth() + 3);
        return quarterly;
      default:
        return new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
    }
  }

  // Payment Analytics
  async getPaymentAnalytics(userId: string): Promise<any> {
    try {
      const userMethods = await this.getUserPaymentMethods(userId);
      const recurringInvestments = await db.select()
        .from(recurringInvestments)
        .where(eq(recurringInvestments.userId, userId));

      const recentTransactions = await db.select()
        .from(paymentTransactions)
        .where(eq(paymentTransactions.userId, userId))
        .orderBy(paymentTransactions.createdAt)
        .limit(10);

      return {
        totalPaymentMethods: userMethods.length,
        activeRecurringInvestments: recurringInvestments.filter(r => r.isActive).length,
        totalRecurringValue: recurringInvestments
          .filter(r => r.isActive)
          .reduce((sum, r) => sum + parseFloat(r.amount), 0),
        recentTransactions,
        methodBreakdown: userMethods.reduce((acc, method) => {
          acc[method.type] = (acc[method.type] || 0) + 1;
          return acc;
        }, {} as Record<string, number>)
      };
    } catch (error) {
      console.error('Failed to get payment analytics:', error);
      return null;
    }
  }
}

export const enhancedPaymentService = new EnhancedPaymentService();