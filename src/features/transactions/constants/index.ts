import type { SortBy, StatusFilter } from '../types';

export const STATUS_FILTERS: StatusFilter[] = ['all', 'success', 'failed', 'retrying'];

export const SORT_OPTIONS: SortBy[] = ['dateDesc', 'amountDesc', 'amountAsc', 'status'];

export const TOAST_DURATION = 3000;

export const VIRTUAL_ROW_HEIGHT = 54;

export const SEARCH_DEBOUNCE_MS = 200;

// Re-export pure utils so existing imports from ../constants still resolve
export {
  currencyFormatter,
  dateFormatter,
  filterBySearch,
  filterByStatus,
  sorters,
  isStatusFilter,
  isSortBy,
} from '../utils';
