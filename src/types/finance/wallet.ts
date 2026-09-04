/**
 * Designer Wallet & Ledger Types
 */

export type PayoutStatus = 'pending' | 'processing' | 'completed' | 'rejected';

export interface PayoutDisbursementResult {
  status: string;
  message: string;
}

export interface WalletOperationParams {
  designerId: string;
  amount: number;
  description: string;
  referenceId?: string;
  tx?: unknown;
}

export interface WalletMutationRecord {
  id: string;
  type: 'CREDIT' | 'DEBIT';
  amount: number;
  balanceAfter: number;
  description: string;
  referenceId: string | null;
  createdAt: Date;
}

export interface WalletSummary {
  designerId: string;
  balance: number;
  availableBalance: number;
  walletId: string | null;
  mutations: WalletMutationRecord[];
}

export interface BankAccount {
  id: string;
  bankName: string;
  accountNumber: string;
  holderName?: string;
  accountHolder?: string;
  accountHolderName?: string;
}

export interface PayoutHistoryItem {
  id: string;
  amount: number;
  status: string;
  gatewayMessage: string | null;
  xenditPayoutId?: string | null;
  gatewayReference?: string | null;
  createdAt: string;
  bankAccount?: {
    bankName: string;
    accountNumber: string;
    accountHolder: string;
  };
}
