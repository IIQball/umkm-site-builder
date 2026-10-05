/**
 * Payment and Transaction Types
 * Aligned with transactions table schema
 */

export type TransactionType = 'template_purchase';
export type PaymentStatus = 'pending' | 'success' | 'failed' | 'expired' | 'canceled' | 'refunded';

export interface TransactionInitiateInput {
  amount: number;
  type: 'template_purchase';
  storeId?: string;
  templateId?: string;
  assistedBy?: string | null;
  adminFee?: number;
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

export interface TransactionRecord {
  id: string;
  userId: string;
  type: TransactionType;
  amount: number; // in IDR
  adminFee?: number;
  status: PaymentStatus;
  storeId?: string;
  templateId?: string;
  assistedBy?: string | null;
  externalId: string;
  paymentGatewayRef?: string;
  paymentChannel?: string;
  createdAt: Date;
}

export interface CheckoutPageData {
  invoiceId: string;
  amount: number;
  amountFormatted: string;
  baseAmount?: number;
  adminFee?: number;
  assistedBy?: string | null;
  assistedMerchantName?: string | null;
  assistedStoreName?: string | null;
  paymentUrl: string;
  status: PaymentStatus;
  expiresAt: string;
  paymentMethod?: string;
  createdAt?: string | Date;
  templateThumbnailUrl?: string | null;
  designerName?: string | null;
  templateDescription?: string | null;
}

export interface OrderTransactionItem {
  id: string;
  userId: string;
  type: string;
  amount: number;
  adminFee?: number;
  basePrice?: number;
  status: string;
  storeId?: string | null;
  templateId?: string | null;
  assistedBy?: string | null;
  externalId?: string | null;
  paymentGatewayRef?: string | null;
  paymentChannel?: string | null;
  createdAt: string | Date;
  merchantName?: string | null;
  merchantEmail?: string | null;
  storeName?: string | null;
  adminName?: string | null;
  adminEmail?: string | null;
  template?: {
    id: string;
    name: string;
    thumbnailUrl?: string | null;
    price: number;
  } | null;
}

export interface DesignerOrderItem {
  id: string;
  userId: string;
  type: string;
  amount: number;
  status: string;
  storeId?: string | null;
  templateId?: string | null;
  externalId?: string | null;
  paymentGatewayRef?: string | null;
  paymentChannel?: string | null;
  createdAt: string | Date;
  template?: {
    id: string;
    name: string;
    thumbnailUrl?: string | null;
    price: number;
  } | null;
  user?: {
    id: string;
    name?: string | null;
    email: string;
    image?: string | null;
  } | null;
  commission?: {
    id: string;
    totalAmount?: number | null;
    designerAmount?: number | null;
    platformFee?: number | null;
  } | null;
}

