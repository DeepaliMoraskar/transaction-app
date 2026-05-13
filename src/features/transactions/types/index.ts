export type TransactionStatus = 'success' | 'failed' | 'processing';

export interface Transaction {
  id: string;
  amount: number;
  currency: 'USD';
  timestamp: string;
  status: TransactionStatus;
}

export type StatusFilter = 'all' | 'success' | 'failed' | 'retrying';
export type SortBy = 'dateAsc' | 'dateDesc' | 'amountDesc' | 'amountAsc' | 'status';

export type Toast = {
  id: string;
  message: string;
  type?: 'success' | 'error' | 'info';
};

export type RetryResult = {
  total: number;
  success: number;
  failed: number;
};

export type TransactionQueryOptions = {
  statusFilter: StatusFilter;
  search: string;
  sortBy: SortBy;
};
