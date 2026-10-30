/**
 * Billing Domain Types
 * Reconciliation & audit results for tenant AI credits vs paid Xendit invoices.
 */

export interface InvoiceReconciliationItem {
  id: string;
  externalId: string;
  amount: number;
  amountFormatted: string;
  status: string;
  paymentChannel: string | null;
  creditsGranted: number;
  createdAt: Date;
}

export interface TenantCreditReconciliation {
  tenantId: string;
  userId: string;
  storeName: string | null;
  ownerEmail: string | null;
  currentBalance: number;
  totalPurchasedInDb: number;
  totalUsedInDb: number;
  calculatedPurchasedCredits: number;
  totalPaidAmount: number;
  totalPaidAmountFormatted: string;
  successfulInvoicesCount: number;
  invoices: InvoiceReconciliationItem[];
  isBalanced: boolean;
  discrepancy: number; // calculatedPurchasedCredits - totalPurchasedInDb
}

export interface ReconciliationReport {
  generatedAt: Date;
  totalTenantsChecked: number;
  balancedTenantsCount: number;
  discrepantTenantsCount: number;
  totalRevenueIdr: number;
  totalRevenueIdrFormatted: string;
  totalCreditsPurchased: number;
  tenants: TenantCreditReconciliation[];
}
