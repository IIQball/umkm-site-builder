/**
 * Designer Wallet & Ledger Types
 */

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
  createdAt: Date | string;
}

export type WalletMutation = WalletMutationRecord;

export interface BankAccount {
  id: string;
  bankName: string;
  accountNumber: string;
  accountHolder?: string;
  holderName?: string;
}

export interface PayoutHistoryItem {
  id: string;
  amount: number;
  status: string;
  gatewayMessage?: string | null;
  xenditPayoutId?: string | null;
  gatewayReference?: string | null;
  bankAccount?: BankAccount | null;
  createdAt: string | Date;
  updatedAt?: string | Date;
}

export interface WalletSummary {
  designerId: string;
  balance: number;
  availableBalance: number;
  walletId: string | null;
  mutations: WalletMutationRecord[];
}

