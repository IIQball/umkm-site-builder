export interface CreditQuotaData {
  balance: number;
  totalUsed: number;
  totalPurchased: number;
  initialBonus: number;
  totalQuota: number;
  percentage: number;
  status: 'plenty' | 'low' | 'critical' | 'empty';
}

export interface CreditMutationItem {
  id: string;
  type: 'CREDIT' | 'DEBIT';
  amount: number;
  category: 'BONUS' | 'TOP_UP' | 'USAGE';
  description: string;
  referenceId: string | null;
  createdAt: string;
}

export interface CreditHistoryPagination {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface CreditHistorySummary {
  totalTopUpCredits: number;
  totalUsedCredits: number;
  bonusCredits: number;
}

export interface CreditHistoryResponse {
  quota: CreditQuotaData;
  mutations: CreditMutationItem[];
  pagination: CreditHistoryPagination;
  summary: CreditHistorySummary;
}
