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
   * Validate a bank account via Xendit Official Inquiries API or Mock Adapter
   */
  async validateBankAccount(params: {
    bankCode: string;
    accountNumber: string;
  }): Promise<{ isValid: boolean; accountHolderName?: string; message?: string; httpStatus?: number; isSandbox?: boolean }> {
    const bankCodeUpper = params.bankCode.trim().toUpperCase();
    const cleanNum = params.accountNumber.replace(/\D/g, '');
    const isSandbox = Boolean(this.apiKey && this.apiKey.startsWith('xnd_development_'));
    const isProduction = Boolean(this.apiKey && this.apiKey.startsWith('xnd_production_'));
    const isMock = !isSandbox && !isProduction;

    // 1. Mock Adapter for test suite and missing key
    if (isMock) {
      if (cleanNum.length < 5 || /^0+$/.test(cleanNum)) {
        return { isValid: false, httpStatus: 404, message: 'Nomor rekening tidak terdaftar pada bank yang dipilih' };
      }
      const mocks: Record<string, string> = {
        BCA: 'AHMAD SURYA PRATAMA (MOCK)', BRI: 'SITI RAHMAWATI (MOCK)',
        MANDIRI: 'DIMAS ARYA KUSUMA (MOCK)', BNI: 'LESTARI WULANDARI (MOCK)',
        BTN: 'EKO PRASETYO (MOCK)', BSI: 'MUHAMMAD RIZKY FAUZAN (MOCK)',
        CIMB: 'FARHAN MAULANA (MOCK)', MAYBANK: 'KEVIN TANUWIJAYA (MOCK)',
        PERMATA: 'ANDI SAPUTRA (MOCK)',
      };
      return { isValid: true, httpStatus: 200, accountHolderName: mocks[bankCodeUpper] || `PEMILIK ${bankCodeUpper} TEST` };
    }

    // 2. Sandbox deterministic test mapping for official test account
    if (isSandbox && cleanNum === '1234567890') {
      return { isValid: true, httpStatus: 200, isSandbox: true, accountHolderName: 'TEST ACCOUNT SANDBOX' };
    }

    // 3. Official Xendit Bank Account Data Inquiries
    try {
      const response = await fetch(`${this.baseUrl}/bank_account_data_inquiries`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Basic ${Buffer.from(`${this.apiKey}:`).toString('base64')}`,
        },
        body: JSON.stringify({ bank_code: bankCodeUpper, account_number: cleanNum }),
      });

      if (!response.ok) {
        const s = response.status;
        const msg = s === 404
          ? (isSandbox ? 'Mode Sandbox: Gunakan nomor rekening pengujian Xendit atau beralih ke API Key Production untuk validasi rekening riil.' : 'Nomor rekening tidak terdaftar pada bank yang dipilih')
          : (s === 400 || s === 422 ? 'Format nomor rekening tidak sesuai' : (s === 401 || s === 403 ? 'Layanan verifikasi rekening sedang bermasalah' : 'Gagal memverifikasi rekening. Silakan periksa kembali nomor Anda.'));
        return { isValid: false, httpStatus: s, isSandbox, message: msg };
      }

      const data = await response.json().catch(() => ({}));
      const name = data.account_holder_name || data.bank_account_holder_name;
      if (name) {
        return { isValid: true, httpStatus: response.status, isSandbox, accountHolderName: String(name).toUpperCase() };
      }

      return {
        isValid: false,
        httpStatus: 404,
        isSandbox,
        message: isSandbox ? 'Mode Sandbox: Gunakan nomor rekening pengujian Xendit atau beralih ke API Key Production untuk validasi rekening riil.' : 'Nomor rekening tidak terdaftar pada bank yang dipilih',
      };
    } catch {
      return { isValid: false, httpStatus: 500, isSandbox, message: 'Gagal memverifikasi rekening. Silakan periksa kembali nomor Anda.' };
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
