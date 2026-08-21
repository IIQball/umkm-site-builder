/**
 * Xendit Client Helper (Finance Domain)
 * Handles invoice creation, payment verification, and webhook signature validation
 */

import { config } from "@/lib/config/app";
import type { XenditInvoice } from "@/types";
import crypto from 'node:crypto';

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
    metadata?: Record<string, unknown>;
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
  }

  /**
   * Get invoice details from Xendit
   */
  async getInvoice(invoiceNum: string): Promise<XenditInvoice> {
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
  }

  /**
   * Create a disbursement on Xendit
   */
  async createDisbursement(params: {
    externalId: string;
    amount: number;
    bankCode: string;
    accountHolderName: string;
    accountNumber: string;
    description: string;
  }): Promise<{ id: string; status: string; externalId: string }> {
    const body = {
      external_id: params.externalId,
      amount: Math.round(params.amount),
      bank_code: params.bankCode.toUpperCase(),
      account_holder_name: params.accountHolderName,
      account_number: params.accountNumber,
      description: params.description,
    };

    const response = await fetch(`${this.baseUrl}/disbursements`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Basic ${Buffer.from(`${this.apiKey}:`).toString("base64")}`,
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(
        `Xendit Disbursement API error: ${error.error_code || response.status} - ${error.message || response.statusText}`,
      );
    }

    const data = await response.json();
    return {
      id: String(data.id),
      status: String(data.status),
      externalId: String(data.external_id),
    };
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

      const bufA = Buffer.from(computed, 'utf8');
      const bufB = Buffer.from(signature, 'utf8');
      
      if (bufA.length !== bufB.length) {
        return false;
      }

      return crypto.timingSafeEqual(bufA, bufB);
    } catch {
      return false;
    }
  }

  /**
   * Map Xendit API response to internal interface
   */
  private mapXenditResponse(raw: Record<string, unknown>): XenditInvoice {
    return {
      id: String(raw.id),
      invoiceNum: String(raw.external_id),
      userId: raw.user_id ? String(raw.user_id) : undefined,
      userEmail: raw.user_email ? String(raw.user_email) : undefined,
      amount: Number(raw.amount),
      paidAmount: Number(raw.paid_amount) || 0,
      payerEmail: raw.payer_email ? String(raw.payer_email) : undefined,
      description: raw.description ? String(raw.description) : undefined,
      expiryDate: raw.expiry_date ? String(raw.expiry_date) : undefined,
      invoiceUrl: raw.invoice_url ? String(raw.invoice_url) : undefined,
      status: (String(raw.status || 'PENDING').toUpperCase() as 'PAID' | 'PENDING' | 'EXPIRED' | 'SETTLED'),
      paid: Boolean(raw.paid),
      paidAt: raw.paid_at ? String(raw.paid_at) : undefined,
      paymentMethod: raw.payment_method ? String(raw.payment_method) : undefined,
      paymentChannel: raw.payment_channel ? String(raw.payment_channel) : undefined,
      created: raw.created ? String(raw.created) : undefined,
      updated: raw.updated ? String(raw.updated) : undefined,
      currency: String(raw.currency || 'IDR'),
      metadata: typeof raw.metadata === 'object' ? (raw.metadata as Record<string, unknown>) : undefined,
    };
  }
}

export const xenditClient = new XenditClient();
