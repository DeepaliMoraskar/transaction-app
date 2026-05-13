'use client';

import { useCallback } from 'react';
import { getStatusBadgeClass, getStatusLabel } from '../utils';
import type { Transaction } from '../types';

type RowData = {
  selected: boolean;
  downloadingIds: Set<string>;
  processingIds: ReadonlySet<string>;
};

type RowCallbacks = {
  onSelect: (id: string) => void;
  onDownload: (id: string) => void;
  onRetry: (id: string) => void;
};

export function useTransactionRowViewModel(
  tx: Transaction,
  data: RowData,
  callbacks: RowCallbacks,
) {
  const { selected, downloadingIds, processingIds } = data;
  const { onSelect, onDownload, onRetry } = callbacks;

  const isRetrying   = processingIds.has(tx.id);
  const isFailed     = tx.status === 'failed';
  const isSuccess    = tx.status === 'success';
  const isDownloading = downloadingIds.has(tx.id);
  const rowVariant   = isRetrying ? 'processing' : selected ? 'selected' : 'default';
  const statusLabel  = getStatusLabel(tx.status, isRetrying);
  const getStatusClass = (styles: Record<string, string>) =>
    getStatusBadgeClass(tx.status, isRetrying, styles);

  const onSelectChange  = useCallback(() => onSelect(tx.id),   [tx.id, onSelect]);
  const onRetryClick    = useCallback(() => onRetry(tx.id),    [tx.id, onRetry]);
  const onDownloadClick = useCallback(() => onDownload(tx.id), [tx.id, onDownload]);

  return {
    isRetrying,
    isFailed,
    isSuccess,
    isDownloading,
    rowVariant,
    statusLabel,
    getStatusClass,
    onSelectChange,
    onRetryClick,
    onDownloadClick,
  };
}
