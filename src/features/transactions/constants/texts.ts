import type { StatusFilter } from '../types';

export const texts = {
  dashboard: {
    title: 'Transactions',
    subtitle: 'Review your payment history and reprocess failed payments',
    loading: 'Loading transactions...',
    stats: {
      total: 'Total',
      amount: 'Amount',
      failed: 'Failed',
      success: 'Success',
    },
    progress: (current: number, total: number) =>
      `Reprocessing ${current} of ${total} payment${total !== 1 ? 's' : ''}…`,
    summary: (total: number, success: number, failed: number) =>
      `Reprocessed ${total} payments — ✓ ${success} succeeded, ✗ ${failed} failed.`,
    downloadSuccess: (id: string) => `Downloaded ${id}`,
    downloadError: (id: string) => `Failed to download ${id}`,
  },

  controls: {
    searchPlaceholder: 'Search by ID…',
    searchLabel: 'Search transactions by ID',
    selectAllFailed: (n: number) => `Select all ${n} failed`,
    reprocessSelected: (n: number) => `Reprocess ${n} Selected`,
    reprocessLabel: 'Reprocess Selected',
    statusLabels: {
      all: 'All',
      success: 'Success',
      failed: 'Failed',
      retrying: 'Processing',
    } satisfies Record<StatusFilter, string>,
  },

  table: {
    colId: 'ID',
    colAmount: 'Amount',
    colDate: 'Date',
    colStatus: 'Status',
    colInvoice: 'Invoice',
    emptyTitle: 'No transactions found',
    emptyHint: 'Try adjusting your search or filter',
    selectAllAriaLabel: 'Select all failed transactions',
    selectAllTitle: 'Select all failed',
  },

  row: {
    checkboxAriaLabel: (id: string) => `Select transaction ${id}`,
    retryingAriaLabel: (id: string) => `Reprocessing ${id}`,
    successAriaLabel: 'Success',
    processingHint: 'Processing…',
    reprocessTitle: (id: string) => `Reprocess payment ${id}`,
    reprocessLabel: 'Reprocess',
    downloadTitle: (id: string) => `Download invoice for ${id}`,
    downloadGenerating: 'Generating…',
    downloadLabel: 'Invoice',
  },

  errors: {
    dashboardError: 'Something went wrong in the dashboard.',
    tryAgain: 'Try again',
  },
} as const;
