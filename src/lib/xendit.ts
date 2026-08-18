/**
 * Xendit client helper
 * Handles invoice creation, payment verification, and webhook signature validation
 */

import { config } from "@/lib/config/app";
import type { XenditInvoice } from "@/types/payments";
import crypto from "crypto";

// Xendit menggunakan base URL yang sama untuk sandbox dan production
const XENDIT_BASE_URL = "https://api.xendit.co";

export class XenditClient {
  private apiKey: string;
  private webhookSecret: string;
  private baseUrl: string;

  constructor() {
    this.apiKey = config.payments.xenditApiKey;
    this.webhookSecret = config.payments.xenditWebhookSecret;
    this.baseUrl = XENDIT_BASE_URL;
  }

  /**
   * Create an invoice on Xendit
   */
  async createInvoice(params: {
    invoiceNum: string;
    amount: number;
    payerEmail: string;
    description: string;
    expiryDate: Date;
    successRedirectUrl: string;
    failureRedirectUrl: string;
    metadata?: Record<string, any>;
  }): Promise<XenditInvoice> {
    const body = {
      external_id: params.invoiceNum,
      amount: Math.round(params.amount * 100) / 100, // IDR, 2 decimals
      payer_email: params.payerEmail,
      description: params.description,
      expiry_date: params.expiryDate.toISOString(),
      success_redirect_url: params.successRedirectUrl,
      failure_redirect_url: params.failureRedirectUrl,
      currency: "IDR",
      metadata: params.metadata || {},
    };

    try {
      const response = await fetch(`${this.baseUrl}/v2/invoices`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Basic ${Buffer.from(`${this.apiKey}:`).toString("base64")}`,
        },
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(
          `Xendit API error: ${error.error_code || response.status} - ${error.message || response.statusText}`,
        );
      }

      const invoice = await response.json();
      return this.mapXenditResponse(invoice);
    } catch (error) {
      console.error("[Xendit] Failed to create invoice:", error);
      throw error;
    }
  }

  /**
   * Get invoice details from Xendit
   */
  async getInvoice(invoiceNum: string): Promise<XenditInvoice> {
    try {
      const response = await fetch(
        `${this.baseUrl}/v2/invoices/${invoiceNum}`,
        {
          method: "GET",
          headers: {
            Authorization: `Basic ${Buffer.from(`${this.apiKey}:`).toString("base64")}`,
          },
        },
      );

      if (!response.ok) {
        if (response.status === 404) {
          throw new Error("Invoice not found");
        }
        const error = await response.json();
        throw new Error(
          `Xendit API error: ${error.error_code || response.status} - ${error.message || response.statusText}`,
        );
      }

      const invoice = await response.json();
      return this.mapXenditResponse(invoice);
    } catch (error) {
      console.error("[Xendit] Failed to get invoice:", error);
      throw error;
    }
  }

  /**
   * Verify webhook signature
   */
  verifyWebhookSignature(payload: string, signature: string): boolean {
    try {
      const computed = crypto
        .createHmac("sha256", this.webhookSecret)
        .update(payload)
        .digest("hex");

      return crypto.timingSafeEqual(
        Buffer.from(computed),
        Buffer.from(signature),
      );
    } catch (error) {
      console.error("[Xendit] Signature verification failed:", error);
      return false;
    }
  }

  /**
   * Map Xendit API response to internal interface
   */
  private mapXenditResponse(raw: any): XenditInvoice {
    return {
      id: raw.id,
      invoiceNum: raw.external_id,
      userId: raw.user_id,
      userEmail: raw.user_email,
      amount: raw.amount,
      paidAmount: raw.paid_amount || 0,
      payerEmail: raw.payer_email,
      description: raw.description,
      expiryDate: raw.expiry_date,
      invoiceUrl: raw.invoice_url,
      status: raw.status?.toUpperCase() || "PENDING",
      paid: raw.paid || false,
      paidAt: raw.paid_at,
      paymentMethod: raw.payment_method,
      paymentChannel: raw.payment_channel,
      created: raw.created,
      updated: raw.updated,
      currency: raw.currency || "IDR",
      metadata: raw.metadata,
    };
  }
}

export const xenditClient = new XenditClient();
