'use client';

import { useCallback, useMemo, useRef, useState } from 'react';
import { useVirtualizer } from '@tanstack/react-virtual';
import type { ChangeEvent } from 'react';

import { useDashboardFilters } from '../hooks/useDashboardFilters';
import { useToast } from '../hooks/useToast';
import { useDownload } from '../hooks/useDownload';
import { useTransactions } from '../hooks/useTransactions';
import { VIRTUAL_ROW_HEIGHT } from '../constants';
import { currencyFormatter } from '../utils';
import type { StatusFilter, Transaction } from '../types';

export function useDashboardViewModel(initialTransactions: Transaction[]) {
  const filters = useDashboardFilters();
  const { toasts, pushToast, removeToast } = useToast();
  const { downloadingIds, onDownload } = useDownload(pushToast);
  const [retryTotal, setRetryTotal] = useState(0);
  const parentRef = useRef<HTMLDivElement>(null);

  const {
    isLoading,
    visibleTransactions,
    visibleFailedIds,
    totalStats,
    selectedIds,
    selectedAmount,
    processingIds,
    summary,
    toggleSelection,
    selectAllFailed,
    clearSelection,
    runRetryCommand,
  } = useTransactions(initialTransactions, {
    statusFilter: filters.statusFilter,
    search: filters.debouncedSearch,
    sortBy: filters.sortBy,
  });

  // ─── Derived ────────────────────────────────────────────────────────────

  const globalBusy = processingIds.size > 0;
  const selectedSet = useMemo(() => new Set(selectedIds), [selectedIds]);
  const allFailedSelected = visibleFailedIds.length > 0 && visibleFailedIds.every(id => selectedSet.has(id));
  const someFailedSelected = visibleFailedIds.some(id => selectedSet.has(id));
  const retryProgress = retryTotal > 0
    ? Math.round(((retryTotal - processingIds.size) / retryTotal) * 100)
    : 0;
  const formattedSelectedAmount = currencyFormatter.format(selectedAmount);
  const formattedTotalAmount = currencyFormatter.format(totalStats.totalAmount);

  // ─── Virtualizer ────────────────────────────────────────────────────────

  const rowVirtualizer = useVirtualizer({
    count: visibleTransactions.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => VIRTUAL_ROW_HEIGHT,
    overscan: 10,
  });

  // ─── Filter handlers ────────────────────────────────────────────────────

  const onSearchChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    filters.setSearch(e.target.value);
  }, [filters.setSearch]);

  const onStatusChange = useCallback((status: StatusFilter) => {
    filters.setStatusFilter(status);
  }, [filters.setStatusFilter]);

  const onAmountHeaderClick = useCallback(() => {
    filters.setSortBy(filters.sortBy === 'amountDesc' ? 'amountAsc' : 'amountDesc');
  }, [filters.sortBy, filters.setSortBy]);

  const onDateHeaderClick = useCallback(() => {
    filters.setSortBy(filters.sortBy === 'dateDesc' ? 'dateAsc' : 'dateDesc');
  }, [filters.sortBy, filters.setSortBy]);

  // ─── Selection handlers ─────────────────────────────────────────────────

  const onSelectAllFailed = useCallback(() => {
    selectAllFailed(visibleFailedIds);
  }, [selectAllFailed, visibleFailedIds]);

  const onSelectAll = useCallback(() => {
    if (visibleFailedIds.every(id => selectedSet.has(id))) {
      clearSelection();
    } else {
      selectAllFailed(visibleFailedIds);
    }
  }, [visibleFailedIds, selectedSet, clearSelection, selectAllFailed]);

  // ─── Retry handlers ─────────────────────────────────────────────────────

  const handleRetry = useCallback(async () => {
    if (!selectedIds.length) return;
    setRetryTotal(selectedIds.length);
    clearSelection();
    await runRetryCommand(selectedIds);
    setRetryTotal(0);
  }, [selectedIds, clearSelection, runRetryCommand]);

  const handleSingleRetry = useCallback(async (id: string) => {
    setRetryTotal(1);
    await runRetryCommand([id]);
    setRetryTotal(0);
  }, [runRetryCommand]);

  return {
    // Filter state (raw — needed by Controls for controlled inputs)
    search: filters.search,
    statusFilter: filters.statusFilter,
    sortBy: filters.sortBy,
    // Filter handlers
    onSearchChange,
    onStatusChange,
    onAmountHeaderClick,
    onDateHeaderClick,
    // Transaction data
    isLoading,
    visibleTransactions,
    totalStats,
    formattedTotalAmount,
    // Selection
    selectedIds,
    selectedAmount,
    formattedSelectedAmount,
    selectedSet,
    allFailedSelected,
    someFailedSelected,
    visibleFailedIds,
    toggleSelection,
    onSelectAll,
    onSelectAllFailed,
    // Processing
    processingIds,
    globalBusy,
    retryTotal,
    retryProgress,
    summary,
    // Retry handlers
    handleRetry,
    handleSingleRetry,
    // Download
    downloadingIds,
    onDownload,
    // Toast
    toasts,
    removeToast,
    // Virtualizer
    parentRef,
    rowVirtualizer,
  };
}
