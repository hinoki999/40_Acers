import { db } from "./db";
import { hubspotContacts, hubspotDeals, users } from "@shared/schema";
import type { InsertHubspotContact, InsertHubspotDeal, HubspotContact, HubspotDeal } from "@shared/schema";
import { eq } from "drizzle-orm";

interface HubSpotConfig {
  apiKey: string;
  portalId: string;
  baseUrl: string;
}

interface HubSpotContactData {
  email: string;
  firstname?: string;
  lastname?: string;
  phone?: string;
  company?: string;
  jobtitle?: string;
  hs_lead_status?: string;
  lifecyclestage?: string;
  total_investments?: string;
  investment_count?: string;
  last_investment_date?: string;
  preferred_property_type?: string;
  investment_budget?: string;
}

interface HubSpotDealData {
  dealname: string;
  amount: string;
  dealstage: string;
  pipeline: string;
  closedate?: string;
  dealtype?: string;
  hubspot_deal_probability?: string;
  property_address?: string;
  investment_amount?: string;
}

export class HubSpotService {
  private config: HubSpotConfig;

  constructor() {
    this.config = {
      apiKey: process.env.HUBSPOT_API_KEY || '',
      portalId: process.env.HUBSPOT_PORTAL_ID || '',
      baseUrl: 'https://api.hubapi.com'
    };
  }

  private async makeRequest(endpoint: string, method: string = 'GET', data?: any) {
    const url = `${this.config.baseUrl}${endpoint}`;
    const headers: Record<string, string> = {
      'Authorization': `Bearer ${this.config.apiKey}`,
      'Content-Type': 'application/json'
    };

    const options: RequestInit = {
      method,
      headers,
      ...(data && { body: JSON.stringify(data) })
    };

    try {
      const response = await fetch(url, options);
      if (!response.ok) {
        throw new Error(`HubSpot API error: ${response.status} ${response.statusText}`);
      }
      return await response.json();
    } catch (error) {
      console.error('HubSpot API request failed:', error);
      throw error;
    }
  }

  // Contact Management
  async createContact(userData: any): Promise<HubspotContact | null> {
    try {
      const contactData: HubSpotContactData = {
        email: userData.email,
        firstname: userData.firstName || userData.username?.split(' ')[0],
        lastname: userData.lastName || userData.username?.split(' ')[1],
        phone: userData.phone,
        company: userData.company,
        jobtitle: userData.jobTitle,
        hs_lead_status: 'NEW',
        lifecyclestage: 'lead',
        total_investments: '0',
        investment_count: '0'
      };

      const hubspotResponse = await this.makeRequest('/crm/v3/objects/contacts', 'POST', {
        properties: contactData
      });

      // Store in our database
      const [contact] = await db.insert(hubspotContacts).values({
        userId: userData.id,
        hubspotContactId: hubspotResponse.id,
        email: userData.email,
        firstName: userData.firstName,
        lastName: userData.lastName,
        phone: userData.phone,
        company: userData.company,
        jobTitle: userData.jobTitle,
        leadSource: 'website',
        lifecycleStage: 'lead',
        syncStatus: 'active'
      }).returning();

      return contact;
    } catch (error) {
      console.error('Failed to create HubSpot contact:', error);
      return null;
    }
  }

  async updateContact(userId: string, updates: Partial<HubSpotContactData>): Promise<void> {
    try {
      const [contact] = await db.select().from(hubspotContacts).where(eq(hubspotContacts.userId, userId));
      
      if (!contact) {
        console.log('No HubSpot contact found for user:', userId);
        return;
      }

      await this.makeRequest(`/crm/v3/objects/contacts/${contact.hubspotContactId}`, 'PATCH', {
        properties: updates
      });

      // Update local record
      await db.update(hubspotContacts)
        .set({
          ...updates,
          updatedAt: new Date()
        })
        .where(eq(hubspotContacts.userId, userId));

    } catch (error) {
      console.error('Failed to update HubSpot contact:', error);
    }
  }

  async syncInvestmentData(userId: string, investmentData: any): Promise<void> {
    try {
      const updates: Partial<HubSpotContactData> = {
        total_investments: investmentData.totalAmount?.toString(),
        investment_count: investmentData.count?.toString(),
        last_investment_date: investmentData.lastDate,
        preferred_property_type: investmentData.preferredType,
        lifecyclestage: investmentData.totalAmount > 10000 ? 'customer' : 'opportunity'
      };

      await this.updateContact(userId, updates);
    } catch (error) {
      console.error('Failed to sync investment data:', error);
    }
  }

  // Deal Management
  async createDeal(dealData: {
    userId: string;
    propertyId?: number;
    dealName: string;
    amount: number;
    dealType: string;
    stage?: string;
    closeDate?: Date;
  }): Promise<HubspotDeal | null> {
    try {
      // Get associated contact
      const [contact] = await db.select().from(hubspotContacts).where(eq(hubspotContacts.userId, dealData.userId));
      
      const hubspotDealData: HubSpotDealData = {
        dealname: dealData.dealName,
        amount: dealData.amount.toString(),
        dealstage: dealData.stage || 'appointmentscheduled',
        pipeline: 'default',
        dealtype: dealData.dealType,
        closedate: dealData.closeDate?.toISOString(),
        hubspot_deal_probability: '25'
      };

      const hubspotResponse = await this.makeRequest('/crm/v3/objects/deals', 'POST', {
        properties: hubspotDealData,
        associations: contact ? [
          {
            to: { id: contact.hubspotContactId },
            types: [{ associationCategory: 'HUBSPOT_DEFINED', associationTypeId: 3 }]
          }
        ] : []
      });

      // Store in database
      const [deal] = await db.insert(hubspotDeals).values({
        userId: dealData.userId,
        propertyId: dealData.propertyId,
        hubspotDealId: hubspotResponse.id,
        dealName: dealData.dealName,
        amount: dealData.amount.toString(),
        stage: dealData.stage || 'appointmentscheduled',
        pipeline: 'default',
        dealType: dealData.dealType,
        closeDate: dealData.closeDate,
        probability: 25,
        source: 'website'
      }).returning();

      return deal;
    } catch (error) {
      console.error('Failed to create HubSpot deal:', error);
      return null;
    }
  }

  async updateDealStage(dealId: string, stage: string, probability?: number): Promise<void> {
    try {
      const [deal] = await db.select().from(hubspotDeals).where(eq(hubspotDeals.hubspotDealId, dealId));
      
      if (!deal) return;

      await this.makeRequest(`/crm/v3/objects/deals/${dealId}`, 'PATCH', {
        properties: {
          dealstage: stage,
          ...(probability && { hubspot_deal_probability: probability.toString() })
        }
      });

      await db.update(hubspotDeals)
        .set({
          stage,
          ...(probability && { probability }),
          updatedAt: new Date()
        })
        .where(eq(hubspotDeals.hubspotDealId, dealId));

    } catch (error) {
      console.error('Failed to update deal stage:', error);
    }
  }

  // Analytics and Reporting
  async getContactEngagement(contactId: string): Promise<any> {
    try {
      return await this.makeRequest(`/crm/v3/objects/contacts/${contactId}/associations/engagement`);
    } catch (error) {
      console.error('Failed to get contact engagement:', error);
      return null;
    }
  }

  async createEngagement(contactId: string, engagementData: any): Promise<void> {
    try {
      await this.makeRequest('/crm/v3/objects/engagements', 'POST', {
        properties: {
          hs_engagement_type: engagementData.type,
          hs_engagement_subject: engagementData.subject,
          hs_engagement_body: engagementData.body,
          hs_timestamp: new Date().toISOString()
        },
        associations: [
          {
            to: { id: contactId },
            types: [{ associationCategory: 'HUBSPOT_DEFINED', associationTypeId: 194 }]
          }
        ]
      });
    } catch (error) {
      console.error('Failed to create engagement:', error);
    }
  }

  // Bulk operations for performance
  async batchUpdateContacts(updates: Array<{ userId: string; data: Partial<HubSpotContactData> }>): Promise<void> {
    try {
      const batchData = await Promise.all(
        updates.map(async ({ userId, data }) => {
          const [contact] = await db.select().from(hubspotContacts).where(eq(hubspotContacts.userId, userId));
          return contact ? {
            id: contact.hubspotContactId,
            properties: data
          } : null;
        })
      );

      const validUpdates = batchData.filter(Boolean);
      
      if (validUpdates.length > 0) {
        await this.makeRequest('/crm/v3/objects/contacts/batch/update', 'POST', {
          inputs: validUpdates
        });
      }
    } catch (error) {
      console.error('Failed to batch update contacts:', error);
    }
  }

  // Webhook handling
  async handleWebhook(webhookData: any): Promise<void> {
    try {
      const { objectId, objectType, eventType } = webhookData;
      
      if (objectType === 'contact' && eventType === 'contact.propertyChange') {
        await this.syncContactFromHubSpot(objectId);
      } else if (objectType === 'deal' && eventType === 'deal.propertyChange') {
        await this.syncDealFromHubSpot(objectId);
      }
    } catch (error) {
      console.error('Failed to handle webhook:', error);
    }
  }

  private async syncContactFromHubSpot(hubspotContactId: string): Promise<void> {
    try {
      const contactData = await this.makeRequest(`/crm/v3/objects/contacts/${hubspotContactId}`);
      
      await db.update(hubspotContacts)
        .set({
          firstName: contactData.properties.firstname,
          lastName: contactData.properties.lastname,
          phone: contactData.properties.phone,
          company: contactData.properties.company,
          jobTitle: contactData.properties.jobtitle,
          lifecycleStage: contactData.properties.lifecyclestage,
          lastActivityDate: contactData.properties.lastmodifieddate ? new Date(contactData.properties.lastmodifieddate) : undefined,
          updatedAt: new Date()
        })
        .where(eq(hubspotContacts.hubspotContactId, hubspotContactId));
    } catch (error) {
      console.error('Failed to sync contact from HubSpot:', error);
    }
  }

  private async syncDealFromHubSpot(hubspotDealId: string): Promise<void> {
    try {
      const dealData = await this.makeRequest(`/crm/v3/objects/deals/${hubspotDealId}`);
      
      await db.update(hubspotDeals)
        .set({
          dealName: dealData.properties.dealname,
          amount: dealData.properties.amount,
          stage: dealData.properties.dealstage,
          probability: parseInt(dealData.properties.hubspot_deal_probability) || 0,
          closeDate: dealData.properties.closedate ? new Date(dealData.properties.closedate) : undefined,
          updatedAt: new Date()
        })
        .where(eq(hubspotDeals.hubspotDealId, hubspotDealId));
    } catch (error) {
      console.error('Failed to sync deal from HubSpot:', error);
    }
  }
}

export const hubspotService = new HubSpotService();