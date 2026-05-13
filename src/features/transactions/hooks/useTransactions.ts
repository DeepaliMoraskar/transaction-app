'use client';

import { useCallback, useMemo, useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { TransactionService } from '../api/transaction.service';
import { useBatchRetry } from './useBatchRetry';
import { filterBySearch, filterByStatus, sorters } from '../utils';
import type { Transaction, TransactionStatus, TransactionQueryOptions } from '../types';

export function useTransactions(initialData: Transaction[], options: TransactionQueryOptions) {
  const queryClient = useQueryClient();

  const { data: transactions = initialData, isLoading } = useQuery({
    queryKey: ['transactions'],
    queryFn: () => TransactionService.fetchTransactions(),
    initialData,
    staleTime: 1000 * 60 * 5,
  });

  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [summary, setSummary] = useState<{ total: number; success: number; failed: number } | null>(null);

  const onStatusUpdate = useCallback((id: string, status: TransactionStatus) => {
    queryClient.setQueryData<Transaction[]>(['transactions'], (old) =>
      old?.map(tx => tx.id === id ? { ...tx, status } : tx)
    );
    if (status === 'success') {
      setSelected(prev => {
        const next = new Set(prev);
        next.delete(id);
        return next;
      });
    }
  }, [queryClient]);

  const { retryBatch, activeRetryIds } = useBatchRetry(onStatusUpdate);

  const visibleTransactions = useMemo(() => {
    const { statusFilter, search, sortBy } = options;
    return transactions
      .filter(filterBySearch(search))
      .filter(filterByStatus(statusFilter))
      .sort(sorters[sortBy]);
  }, [transactions, options]);

  const visibleFailedIds = useMemo(
    () => visibleTransactions.filter(tx => tx.status === 'failed').map(tx => tx.id),
    [visibleTransactions],
  );

  const totalStats = useMemo(() => {
    const total = transactions.length;
    const failed = transactions.filter(tx => tx.status === 'failed').length;
    const success = transactions.filter(tx => tx.status === 'success').length;
    const totalAmount = transactions.reduce((sum, tx) => sum + tx.amount, 0);
    return { total, failed, success, totalAmount };
  }, [transactions]);

  const selectedIds = useMemo(() => Array.from(selected), [selected]);

  const selectedAmount = useMemo(
    () => transactions.filter(tx => selected.has(tx.id)).reduce((sum, tx) => sum + tx.amount, 0),
    [transactions, selected],
  );

  const runRetryCommand = useCallback(async (ids: string[]) => {
    if (!ids.length) return;
    setSummary(null);
    const results = await retryBatch(ids);
    const successCount = results.filter(s => s === 'success').length;
    setSummary({ total: ids.length, success: successCount, failed: ids.length - successCount });
  }, [retryBatch]);

  const toggleSelection = useCallback((id: string) => {
    setSelected(prev => {
      const next = new Set(prev);
      prev.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }, []);

  const selectAllFailed = useCallback((ids: string[]) => {
    setSelected(prev => {
      const next = new Set(prev);
      ids.forEach(id => next.add(id));
      return next;
    });
  }, []);

  const clearSelection = useCallback(() => setSelected(new Set()), []);

  return {
    isLoading,
    visibleTransactions,
    visibleFailedIds,
    totalStats,
    selectedIds,
    selectedAmount,
    processingIds: activeRetryIds,
    summary,
    toggleSelection,
    selectAllFailed,
    clearSelection,
    runRetryCommand,
  };
}
