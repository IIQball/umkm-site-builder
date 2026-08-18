/**
 * Payment types and interfaces
 */

export interface PaymentInitiateInput {
  amount: number;
  type: 'activation_fee' | 'template_purchase';
  templateId?: string; // for template_purchase only
}

export interface PaymentInitiateResponse {
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
  paymentDetails?: Record<string, any>;
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
  fees?: Record<string, any>;
  customer?: {
    givenNames?: string;
    email?: string;
    mobileNumber?: string;
  };
  metadata?: Record<string, any>;
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
  metadata?: Record<string, any>;
}

export interface PaymentRecord {
  id: string;
  userId: string;
  amount: number;
  transactionId: string; // Xendit ID
  status: 'pending' | 'completed' | 'failed' | 'cancelled';
  provider: string;
  metadata: {
    invoiceId?: string;
    paidAt?: string;
    method?: string;
    [key: string]: any;
  };
  createdAt: Date;
  updatedAt: Date;
}

export interface CheckoutPageData {
  invoiceId: string;
  amount: number;
  amountFormatted: string;
  paymentUrl: string;
  status: 'pending' | 'completed' | 'failed';
  expiresAt: string;
  paymentMethod?: string;
}
