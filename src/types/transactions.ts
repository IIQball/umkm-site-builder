/**
 * Payment types and interfaces
 * Aligned with transactions table schema
 */

export type TransactionType = 'store_registration' | 'template_purchase';
export type PaymentStatus = 'pending' | 'success' | 'failed' | 'expired' | 'canceled' | 'refunded';

export interface TransactionInitiateInput {
  amount: number;
  type: 'store_registration' | 'template_purchase';
  storeId?: string;
  templateId?: string;
}

export interface TransactionInitiateResponse {
  invoiceId: string;
  paymentUrl: string;
  amount: number;
  expiresAt: string;
}

export interface XenditInvoice {
  id: string;
  invoiceNum?: string;
  userId?: string;
  userEmail?: string;
  amount: number;
  paidAmount: number;
  payerEmail?: string;
  description?: string;
  expiryDate?: string;
  invoiceUrl?: string;
  status: 'PAID' | 'PENDING' | 'EXPIRED' | 'SETTLED';
  paid: boolean;
  paidAt?: string;
  paymentMethod?: string;
  paymentChannel?: string;
  paymentDetails?: Record<string, unknown>;
  created?: string;
  updated?: string;
  successRedirectUrl?: string;
  failureRedirectUrl?: string;
  renotificationStatus?: string;
  currency?: string;
  items?: Array<{
    name: string;
    quantity: number;
    price: number;
  }>;
  fees?: Record<string, unknown>;
  customer?: {
    givenNames?: string;
    email?: string;
    mobileNumber?: string;
  };
  metadata?: Record<string, unknown>;
}

export interface XenditWebhookPayload {
  id: string;
  invoiceNum?: string;
  userId?: string;
  userEmail?: string;
  amount: number;
  paidAmount: number;
  payerEmail?: string;
  description?: string;
  expiryDate?: string;
  invoiceUrl?: string;
  status: 'PAID' | 'PENDING' | 'EXPIRED' | 'SETTLED';
  paid: boolean;
  paidAt?: string;
  paymentMethod?: string;
  paymentChannel?: string;
  created?: string;
  updated?: string;
  currency?: string;
  metadata?: Record<string, unknown>;
}

/**
 * Transaction record as stored in database
 * Maps directly to transactions table
 */
export interface TransactionRecord {
  id: string;
  userId: string;
  type: TransactionType;
  amount: number; // in IDR cents (multiply by 100 to store, divide by 100 to retrieve)
  status: PaymentStatus;
  storeId?: string;
  templateId?: string;
  externalId: string; // Xendit invoice ID
  paymentGatewayRef?: string; // Additional reference from Xendit
  paymentChannel?: string; // Payment method (e.g., BANK_TRANSFER, E_WALLET)
  createdAt: Date;
}

export interface CheckoutPageData {
  invoiceId: string;
  amount: number;
  amountFormatted: string;
  paymentUrl: string;
  status: PaymentStatus;
  expiresAt: string;
  paymentMethod?: string;
}
