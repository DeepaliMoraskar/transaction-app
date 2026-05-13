import type { SortBy, StatusFilter, Transaction, TransactionStatus } from '../types';

// ─── Formatters ────────────────────────────────────────────────────────────

export const currencyFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
});

export const dateFormatter = new Intl.DateTimeFormat('en-US', {
  dateStyle: 'medium',
  timeStyle: 'short',
  timeZone: 'UTC',
});

// ─── Type guards ───────────────────────────────────────────────────────────

const STATUS_FILTER_VALUES: StatusFilter[] = ['all', 'success', 'failed', 'retrying'];
const SORT_BY_VALUES: SortBy[] = ['dateDesc', 'dateAsc', 'amountDesc', 'amountAsc', 'status'];

export const isStatusFilter = (v: string): v is StatusFilter =>
  STATUS_FILTER_VALUES.includes(v as StatusFilter);

export const isSortBy = (v: string): v is SortBy =>
  SORT_BY_VALUES.includes(v as SortBy);

// ─── Filter engine ─────────────────────────────────────────────────────────

export const filterBySearch = (search: string) => (tx: Transaction) =>
  tx.id.toLowerCase().includes(search.toLowerCase());

export const filterByStatus = (status: StatusFilter) => (tx: Transaction) => {
  if (status === 'all') return true;
  if (status === 'retrying') return tx.status === 'processing';
  return tx.status === status;
};

// ─── Sorters ───────────────────────────────────────────────────────────────

export const sorters: Record<SortBy, (a: Transaction, b: Transaction) => number> = {
  dateDesc: (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime(),
  dateAsc:  (a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime(),
  amountDesc: (a, b) => b.amount - a.amount,
  amountAsc:  (a, b) => a.amount - b.amount,
  status: (a, b) => a.status.localeCompare(b.status),
};

// ─── Row derivation ────────────────────────────────────────────────────────

export function getStatusBadgeClass(
  status: TransactionStatus,
  isRetrying: boolean,
  styles: Record<string, string>,
): string {
  if (isRetrying)            return styles.statusProcessing;
  if (status === 'success')  return styles.statusSuccess;
  if (status === 'failed')   return styles.statusFailed;
  return styles.statusPending;
}

export function getStatusLabel(status: TransactionStatus, isRetrying: boolean): string {
  return isRetrying ? 'Processing' : status;
}

// ─── Concurrency utility ───────────────────────────────────────────────────

export async function runWithLimit<T, R>(
  items: T[],
  limit: number,
  worker: (item: T) => Promise<R>,
): Promise<R[]> {
  const results = new Array<R>(items.length);
  const iterator = items.entries();

  const runner = async () => {
    for (const [index, item] of iterator) {
      results[index] = await worker(item);
    }
  };

  await Promise.all(Array.from({ length: Math.min(limit, items.length) }, runner));
  return results;
}
