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
  createdAt: Date;
}

export interface WalletSummary {
  designerId: string;
  balance: number;
  availableBalance: number;
  walletId: string | null;
  mutations: WalletMutationRecord[];
}
